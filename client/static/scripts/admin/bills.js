document.addEventListener('DOMContentLoaded', async () => {
    new BaseModal('settle-bill-modal')
    const payBillModal = new FormModal('pay-bill-modal', '/admin/acknowledge_payment')
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
            let response = await fetch(`/admin/get_bill_info?bill_id=${billId}`)
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

            document.querySelector('[name=entry_id]').value = billId
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
})