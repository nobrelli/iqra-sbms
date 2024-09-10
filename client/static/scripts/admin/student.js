const getRand = () => {
    return Math.round(Math.random() * (999 - 1) + 1)
}

const initAcadYear = async () => {
    const acadYear = document.querySelector('#add-student-modal #semester')

    acadYear.setAttribute('readonly', 'readonly')

    let response = await fetch('/admin/get_current_academic_year')
    let result = await response.json()

    acadYear.value = result.semester
}

const initStudentId = () => {
    let randLead = getRand()
    let randMid = getRand()
    let trail = new Date().getFullYear()

    const studentId = document.querySelector('#add-student-modal #student_id')
    studentId.setAttribute('readonly', 'readonly')

    // There might be a better way for this, toLocaleString, I think..
    randLead = randLead < 100 ? `0${randLead}` : randLead
    randMid = randMid < 100 ? `0${randMid}` : randMid

    studentId.value = `${randLead}-${randMid}-${trail}`
}

const initPrograms = async () => {
    const programs = document.querySelectorAll('#add-student-modal #program, #edit-student-modal #program')

    let response = await fetch('/admin/get_programs')
    let result = await response.json()


    programs.forEach(program => {
        program.setAttribute('required', true)
        program.innerHTML = '<option value="" disabled>Select</option>'

        for (const [id, code, description] of result) {
            const option = document.createElement('option')
            option.value = program.getAttribute('name') === 'program' ? id : code
            option.text = `${code} - ${description}`

            program.appendChild(option)
        }
    })
}

const initTable = (modal) => {
    let checkedEntries = []

    const tableElement = document.getElementById('students-table')

    if (!tableElement) {
        return
    }

    const createButton = document.getElementById('create-bill')
    const checkAllElement = tableElement.querySelector('.table-check-all')
    const checkOneElement = tableElement.querySelectorAll('.table-check-this')
    const source = checkAllElement
    const rows = tableElement.querySelectorAll('tbody tr')
    const messageBox = document.getElementById('message-box')

    source.addEventListener('change', () => {
        checkedEntries = [] // reset

        checkOneElement.forEach((checkbox, index) => {
            checkbox.checked = source.checked
            checkedEntries.push(checkbox.getAttribute('data-target'))
            createButton.disabled = false
        })

        if (!source.checked) {
            checkedEntries = []
            createButton.disabled = true
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

                createButton.disabled = false
                checkedEntries.push(entryID)
            }

            if (!checkedEntries.length) {
                createButton.disabled = true
            }
        })
    })

    createButton.addEventListener('click', async () => {
        createButton.setAttribute('disabled', 'disabled')

        let response = await fetch('/admin/add_multiple_bill', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_ids: checkedEntries,
                message: messageBox.value
            })
        });
        
        let result = await response.json()
        modal.showMessage(result.message)
    
        if (result.success) {
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        }
    })
}

(() => {
    const addBillModal = new FormModal(
        'add-bill-modal', 
        '/admin/add_bill'
    )

    new FormModal(
        'add-student-modal',
        '/admin/add_student'
    )

    new FormModal(
        'edit-student-modal',
        '/admin/edit_student',
        '/admin/get_student_info'
    )

    new ConfirmModal('delete-student-modal', async () => {
        let response = await fetch('/admin/delete_student', {
            method: 'POST',
            body: JSON.stringify({
                entry_id: document.querySelector('#delete-student-modal [name="entry_id"]').value
            })
        });

        let result = await response.json();

        if (result.success) {
            return ['Student deleted.', true]
        }

        return ['Cannot delete.', false]
    })

    const filter = document.getElementById('student-filter')
    const studentEntries = document.querySelectorAll('#students-table tbody tr')

    filter.addEventListener('keyup', () => {
        const value = filter.value.toLowerCase()

        studentEntries.forEach((entry, _) => {
            const id = entry.querySelector('.student-id a').textContent
            const lname = entry.querySelector('.student-lname').textContent.toLowerCase()
            const fname = entry.querySelector('.student-fname').textContent.toLowerCase()

            if (id.includes(value)
                || lname.includes(value)
                || fname.includes(value)) {
                entry.style.visibility = 'visible'
            } else {
                entry.style.visibility = 'collapse'
            }
        })
    })

    initTable(addBillModal)
    initAcadYear()
    // initStudentId()
    initPrograms()
})()

