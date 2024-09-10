(() => {
    new FormModal('add-semester-modal', '/admin/add_semester')
    new FormModal('add-program-modal', '/admin/add_program')
    new FormModal('add-subject-modal', '/admin/add_subject')
    
    new FormModal('edit-program-modal', '/admin/edit_program', '/admin/get_program_info')
    new FormModal('edit-subject-modal', '/admin/edit_subject', '/admin/get_subject_info')
    
    new ConfirmModal('delete-program-modal', async() => {
        let response = await fetch('/admin/delete_program', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_id: document.querySelector('#delete-program-modal [name="entry_id"]').value
            })
        });
        
        let result = await response.json();
    
        if (result.success) {
            return ['Program deleted.', true]
        }
    
        return ['Cannot delete.', false]
    })
    
    new ConfirmModal('delete-subject-modal', async() => {
        let response = await fetch('/admin/delete_subject', {
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

    new ConfirmModal('close-semester-modal', async() => {
        let response = await fetch('/admin/close_semester', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_id: document.querySelector('#close-semester-modal [name="entry_id"]').value
            })
        });
        
        let result = await response.json();
    
        if (result.success) {
            return ['Semester closed.', true]
        }
    
        return ['Cannot close semester.', false]
    })
    
    new ConfirmModal('delete-semester-modal', async() => {
        let response = await fetch('/admin/delete_semester', {
            method: 'POST',
            body: JSON.stringify({ 
                entry_id: document.querySelector('#delete-semester-modal [name="entry_id"]').value
            })
        });
        
        let result = await response.json();
    
        if (result.success) {
            return ['Semester deleted.', true]
        }
    
        return ['Cannot delete.', false]
    })
    
    const addSemesterModal = document.getElementById('add-semester-modal')
    const addSemesterModalYearStart = addSemesterModal.querySelector('[name="year_start"]')
    const addSemesterModalYearEnd = addSemesterModal.querySelector('[name="year_end"]')
    
    addSemesterModalYearEnd.setAttribute('readonly', 'readonly')
    addSemesterModalYearStart.onchange = () => {
        addSemesterModalYearEnd.value = parseInt(addSemesterModalYearStart.value) + 1
    }
})()