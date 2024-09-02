(() => {
    let checkedEntries = []

    new ConfirmModal('delete-message-modal', async () => {
        let response = await fetch('/student/delete_messages', {
            method: 'POST',
            body: JSON.stringify({
                entry_ids: checkedEntries
            })
        });

        let result = await response.json();

        if (result.success) {
            return [checkedEntries.length + ' message(s) deleted.', true]
        }

        return ['Cannot delete.', false]
    })

    const deleteButton = document.getElementById('delete-message')
    const tableElement = document.getElementById('inbox-messages-table')
    const checkAllElement = tableElement.querySelector('.table-check-all')
    const checkOneElement = tableElement.querySelectorAll('.table-check-this')
    const source = checkAllElement
    const rows = tableElement.querySelectorAll('tbody tr')

    rows.forEach((message, index) => {
        const entryID = message.querySelector('input').getAttribute('data-target')

        message.addEventListener('click', event => {
            if (event.target !== checkOneElement[index])
                window.location.href = '/student/inbox/read/' + entryID
        })
    })

    source.addEventListener('change', () => {
        checkedEntries = [] // reset

        checkOneElement.forEach((checkbox, index) => {
            checkbox.checked = source.checked
            checkedEntries.push(checkbox.getAttribute('data-target'))
            deleteButton.style.pointerEvents = 'auto'
        })

        if (!source.checked) {
            checkedEntries = []
            deleteButton.style.pointerEvents = 'none'
        }
    })

    checkOneElement.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            const entryID = checkbox.getAttribute('data-target')
            const current = checkedEntries.indexOf(entryID)
            
            if (!checkbox.checked) {
                source.checked = false
                checkedEntries.splice(current, 1)
            } else {
                // scan if all checkboxes are checked
                const checked = tableElement.querySelectorAll('input:checked')
                
                if (checked.length === rows.length) {
                    source.checked = true
                }

                checkedEntries.push(entryID)
                deleteButton.style.pointerEvents = 'auto'
            }

            if (!checkedEntries.length) {
                deleteButton.style.pointerEvents = 'none'
            }
        })
    })
})()