document.addEventListener('DOMContentLoaded', async () => {
    const { publicKey } = await fetch('/student/request_payment_key')
        .then(result => result.json())
    const stripe = Stripe(publicKey)

    new BaseModal('settle-bill-modal')
    const payBillModal = new FormModal('pay-bill-modal')
    let totalAmount = 0.0

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PHP',
      });

    const bills = document.querySelectorAll('[data-target="settle-bill-modal"]')
    const fees = document.querySelector('#fees-table tbody')
    const payments = document.getElementById('payments-table')
    const paymentsMessage = document.getElementById('payments-message')
    const amountInput = document.getElementById('amount')
    const settleBillBtn = document.getElementById('settle-bill')

    bills.forEach(bill => {
        fees.innerHTML = ''

        bill.addEventListener('click', async() => {
            const billId = bill.getAttribute('data-entry')
            let response = await fetch(`/student/get_bill_info?bill_id=${billId}`)
            let result = await response.json()

            // clear first
            fees.innerHTML = ''

            result.fees.forEach(item => {
                const fee = document.createElement('tr')
                fee.innerHTML = `
                    <td>${item[0]}</td>
                    <td style="text-align: right;">${formatter.format(item[1])}</td>
                `
                fees.appendChild(fee)
            })

            let total = formatter.format(result.total_amount)
            totalAmount = result.total_amount
            amountInput.max = totalAmount
            document.querySelector('[name=bill_id]').value = billId
            document.querySelector('[name=amount]').value = 0
            document.querySelector('[name=amount]').max = result.balance
            document.getElementById('bills-total').textContent = total
            document.getElementById('total-paid').textContent = formatter.format(result.total_paid)
            document.getElementById('bills-balance').textContent = formatter.format(result.balance)

            amountInput.onkeyup = () => {
                if (amountInput.value > result.balance)
                    amountInput.value = result.balance
            }

            if (result.status === 'complete')
                settleBillBtn.style.display = 'none'
            else
                settleBillBtn.style.display = 'block'

            if (!result.payments || !result.payments.length) {
                payments.style.display = 'none'
                paymentsMessage.style.display = 'block'
            } else {
                payments.style.display = 'block'
                paymentsMessage.style.display = 'none'
                payments.querySelector('tbody').innerHTML = ''

                for (const payment of result.payments) {
                    payments.querySelector('tbody').innerHTML +=  `
                        <td>${new Date(payment.timestamp).toLocaleDateString(
                            'en-us', {  
                                year:"numeric", 
                                month:"short", 
                                day:"numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}</td>
                        <td style="text-align: right;">${formatter.format(payment.amount)}</td>
                    `
                }
            }
        })
    })

    const amountSubmit = document.getElementById('amount-submit')
    const amountSection = document.getElementById('amount-section')
    const paymentSection = document.getElementById('payment-section')
    const paymentBack = document.getElementById('payment-back')
    const paymentLoader = document.getElementById('payment-loading')

    let elements = null
    let paymentElement = null
    let prevAmount = 0.0

    amountSubmit.addEventListener('click', async () => {
        let amount = parseFloat(amountInput.value)

        if (!amount) {
            payBillModal.showMessage('Amount is required.')
            return
        }

        if (amount !== prevAmount) {
            prevAmount = amount

            payBillModal.showMessage('Initiating payment intent.')
            amountSubmit.disabled = true
            amountInput.disabled = true
            
            const { clientSecret } = await fetch(`/student/create_payment_intent?amount=${amount}`)
                .then(result => result.json())

            if (!clientSecret) {
                payBillModal.showMessage('Could not initiate the payment intent.')
                amountSubmit.disabled = false
                amountInput.disabled = false

                return
            }

            elements = stripe.elements({ clientSecret })

            paymentElement = elements.create('payment')
            paymentElement.mount('#payment-element')

            payBillModal.onSubmit(async () => {
                paymentBack.disabled = true
                paymentLoader.style.display = 'flex'

                const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    redirect: 'if_required',
                    confirmParams: {
                        return_url: `${window.location.origin}/student/payment_success`,
                    }
                })

                if (stripeError) {
                    payBillModal.showMessage(stripeError.message)
                    paymentBack.disabled = false
                    payBillModal.enable()
                    paymentLoader.style.display = 'none'
                    
                    return false
                }

                // Inform the server that the payment has been confirmed
                const { message, success } = await fetch('/student/acknowledge_payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: amount,
                        payment_id: paymentIntent.id,
                        bill_id: document.querySelector('[name=bill_id]').value
                    })
                }).then(result => result.json())

                if (success) {
                    payBillModal.showMessage(message)
                    document.getElementsByClassName('loading-spinner')[0].style.display = 'none'
                    document.getElementsByClassName('loading-check')[0].style.display = 'block'
                    document.getElementsByClassName('loading-text')[0].textContent = 'Success! Reloading...'
                    setTimeout(() => {
                        window.location.reload()
                    }, 4000)
                }

                return true
            })
        }

        payBillModal.hideMessage()
        amountSection.style.display = 'none'
        paymentSection.style.display = 'block'
    })

    paymentBack.addEventListener('click', () => {
        payBillModal.hideMessage()
        paymentSection.style.display = 'none'
        amountSection.style.display = 'block'
        amountInput.disabled = false
        amountSubmit.disabled = false
    })
})