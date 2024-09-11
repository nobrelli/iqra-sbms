const moveStep = step => {
    const steps = document.querySelectorAll('#add-bill-modal .modal-step')

    steps.forEach(current => {
        if (current.getAttribute('data-step') == step) {
            current.style.display = 'block'
        } else {
            current.style.display = 'none'
        }
    })
}

const evalYear = year => {
    level = ''

    if (year === 1)
        level = '1st Year'
    else if (year === 2)
        level = '2nd Year'
    else if (year === 3)
        level = '3rd Year'
    else if (year === 4)
        level = '4th Year'

    return level
}

(() => {
    new FormModal(
        'add-fee-modal', 
        '/admin/add_fee'
    )

    const addBillModal = new FormModal(
        'add-bill-modal', 
        '/admin/add_bill'
    )

    const addDiscontModal = new FormModal(
        'add-discount-modal', 
        '/admin/add_discount'
    )

    new FormModal(
        'edit-fee-modal', 
        '/admin/edit_fee',
        '/admin/get_fee_info'
    )

    new FormModal(
        'edit-discount-modal', 
        '/admin/edit_discount',
        '/admin/get_discount_info'
    )

    new ConfirmModal('delete-fee-modal', async() => {
        let response = await fetch('/admin/delete_fee', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_id: document.querySelector('#delete-fee-modal [name="entry_id"]').value
            })
        });
        
        let result = await response.json();
    
        if (result.success) {
            return ['Fee deleted.', true]
        }
    
        return ['Cannot delete.', false]
    })

    new ConfirmModal('delete-discount-modal', async() => {
        let response = await fetch('/admin/delete_discount', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_id: document.querySelector('#delete-discount-modal [name="entry_id"]').value
            })
        });
        
        let result = await response.json();
    
        if (result.success) {
            return ['Discount deleted.', true]
        }
    
        return ['Cannot delete.', false]
    })


    const search = document.getElementById('student-search-input')
    const table = document.getElementById('student-search-table')
    const target = document.querySelector('#student-search-table tbody')
    const loader = document.getElementById('search-loader')
    const createButton = document.querySelector('#create-bill')

    search.addEventListener('keyup', async(event) => {
        if (/^[a-zA-Z]$/.test(event.key)) {
            table.style.display = 'block'
            loader.style.display = 'block'
            loader.textContent = 'Loading...'

            // begin lookup
            let response = await fetch(`/admin/search_student?q=${search.value}`)
            let result = await response.json()

            // display to the table
            target.innerHTML = ''

            if (result.message.length) {
                for (const entry of result.message) {
                    const searchEntry = document.createElement('tr')
                    searchEntry.innerHTML = `
                        <td>${entry.student_id}</td>
                        <td>${entry.fullname}</td>
                        <td>${entry.gender}</td>
                        <td>${entry.program}</td>
                        <td>${entry.year}</td>
                        <td>${entry.status}</td>`

                    searchEntry.addEventListener('click', () => {
                        document.getElementById('billing-recipient').textContent = 'Create bill for ' + entry.fullname
                        document.getElementById('student-id').innerHTML = `<b>${entry.student_id}</b>`
                        document.getElementById('student-name').innerHTML = `<b>${entry.fullname}</b>`
                        document.getElementById('student-program').innerHTML = `<b>${entry.program}</b>`
                        document.getElementById('student-year').innerHTML = `<b>${evalYear(entry.year)}</b>`
                        document.getElementById('student-status').innerHTML = `<b>${entry.status}</b>`

                        // move to next step
                        moveStep(2)
                    })

                    target.appendChild(searchEntry)
                }

                loader.style.display = 'none'
            } else {
                loader.textContent = 'No students found.'
                table.style.display = 'none'
            }
        }
    })

    createButton.addEventListener('click', async() => {
        createButton.setAttribute('disabled', 'disabled')

        let response = await fetch('/admin/add_bill', {
            method: 'post',
            body: JSON.stringify({ 
                student_id: document.getElementById('student-id').textContent.trim()
            })
        })
        let result = await response.json()
        addBillModal.showMessage(result.message)

        if (result.success) {
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        }
    })
})()