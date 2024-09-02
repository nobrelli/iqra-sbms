const form = document.getElementById('change-password-form');
const message = document.getElementsByClassName('form-message')[0];
const submit = document.getElementsByClassName('form-button')[0];

form.onsubmit = async(event) => {
    event.preventDefault();

    message.innerHTML = ''
    message.classList.remove('multiple')
    submit.setAttribute('disabled', 'disabled')
    
    message.innerHTML = '<p>Processing...</p>';
    message.style.display = 'block';

    let response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    });
    
    let result = await response.json();

    message.innerHTML = ''

    if (typeof result.message === 'string') {
        message.innerHTML = `<p>${result.message}</p>`
    } else {
        message.classList.add('multiple')

        for (const [_, value] of Object.entries(result.message)) {
            const line = document.createElement('p')
            line.innerHTML = `${value}`
            message.appendChild(line)
        }
    }

    if (result.success)
        window.location.reload();
    else
        submit.removeAttribute('disabled')
}