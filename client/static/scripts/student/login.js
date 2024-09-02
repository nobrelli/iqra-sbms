const form = document.getElementById('student-login-form');
const message = document.getElementById('form-message');

form.onsubmit = async(event) => {
    event.preventDefault();

    document.getElementById('form-message-container').style.display = 'block';
    message.textContent = 'Logging in...';

    let response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    });
    
    let result = await response.json();

    message.textContent = result.message;

    if (result.success) {
        const params = new URLSearchParams(window.location.search);

        setTimeout(() => {
            window.location.href = params.has('next') ? params.get('next') : '/student';
        }, 2000);
    }
}