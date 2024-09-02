(() => {
    new FormModal(
        'add-subject-modal', 
        '/admin/add_program_subject'
    )
    
    new FormModal(
        'edit-subject-modal', 
        '/admin/edit_program_subject', 
        '/admin/get_program_subject_info'
    )
    
    new ConfirmModal('delete-subject-modal', async() => {
        let response = await fetch('/admin/delete_program_subject', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_id: document.querySelector('#delete-subject-modal [name="entry_id"]').value
            })
        });
        
        let result = await response.json();
    
        if (result.success) {
            return ['Subject deleted.', true]
        }
    
        return ['Cannot delete.', false]
    })
    
    const subjectsEl = document.querySelectorAll('[name="subject"], [name="prereq"]')
    
    subjectsEl.forEach(async(el) => {
        let response = await fetch('/admin/get_subjects')
        let result = await response.json()
    
        for (const [id, code, description] of result) {
            const option = document.createElement('option')
            option.value = el.getAttribute('name') === 'subject' ? id : code
            option.text = `${code} - ${description}`
    
            el.appendChild(option)
        }
    })
})()