// General modal class
class BaseModal {
    constructor(modalId) {
        // modal element
        this.modalEl = document.getElementById(modalId)

        // elements that opens the modal when clicked
        const triggers = document.getElementsByClassName('modal-trigger')

        // list of modal triggers that opens only this modal
        this.triggerEl = []

        // message box
        this.message = this.modalEl.querySelector('.modal-message')

        // find the trigger element that targets this modal
        for (const trigger of triggers) {
            if (trigger.getAttribute('data-target') === modalId) {
                trigger.addEventListener('click', event => {
                    event.preventDefault()
                    this.hideMessage()
                    this.modalEl.style.display = 'flex'

                    // if (trigger.hasAttribute('data-entry')) {
                    //     const triggerEntry = trigger.getAttribute('data-entry')
                    //     const entryId = this.modalEl.querySelector('[name="entry_id"]')

                    //     if (entryId) {
                    //         entryId.value = triggerEntry
                    //         this._populate(triggerEntry)
                    //     }
                    // }
                })

                this.triggerEl.push(trigger)

                // It means there's only one trigger
                if (!trigger.hasAttribute('data-entry'))
                    break
            }
        }

        // close button
        this.close = this.modalEl.getElementsByClassName('modal-close')[0]

        this.close.addEventListener('click', event => {
            event.preventDefault()
            this.modalEl.style.display = 'none'
        })
    }

    showMessage(message) {
        this.message.innerHTML = '' // wipe out first
        this.message.classList.remove('multiple')

        if (typeof message === 'string') {
            const line = document.createElement('p')
            line.textContent = message
            this.message.appendChild(line)
        } else {
            this.message.classList.add('multiple')

            for (const [_, value] of Object.entries(message)) {
                const line = document.createElement('p')
                line.innerHTML = `${value}`
                this.message.appendChild(line)
            }
        }

        this.message.style.display = 'block'
    }
    
    hideMessage() {
        this.message.style.display = 'none'
    }
}


class FormModal extends BaseModal {
    constructor(
        modalId, 
        submitURL, 
        getURL = '', 
        method='post', 
        callbackSuccess = null, 
        callbackFailure = null, 
        refreshAfter = true
    ) {
        super(modalId)

        this.submitURL = submitURL
        this.getURL = getURL
        this.method = method
        this.callbackSuccess = callbackSuccess
        this.callbackFailure = callbackFailure
        this.refreshAfter = refreshAfter
        this.form = this.modalEl.querySelector('form')

        // set trigger element(s)' click events
        if (this.triggerEl.length > 0)
            this.triggerEl.forEach(trigger => {
                trigger.addEventListener('click', event => {
                    event.preventDefault()
                    this.hideMessage()
                    this.modalEl.style.display = 'flex'

                    if (trigger.hasAttribute('data-entry')) {
                        const triggerEntry = trigger.getAttribute('data-entry')
                        const entryId = this.modalEl.querySelector('[name="entry_id"]')

                        if (entryId) {
                            entryId.value = triggerEntry
                            this._populate(triggerEntry)
                        }
                    }
                })
            })

        if (this.form && this.submitURL)
            this._processForm()
    }

    _processForm() {
        this.form.addEventListener('submit', async(event) => {
            event.preventDefault()
            
            this.disable()
            this.showMessage('Processing...')

            try {
                let response = (this.method === 'post') ?
                await fetch(this.submitURL, {
                    method: 'post',
                    body: new FormData(this.form)
                }) : ''

                let { message, data, success, html } = await response.json()

                // show message
                this.showMessage(message)

                if (html) {
                    const receiptWindow = window.open('', '_blank')
                    receiptWindow.document.write(html)
                }

                if (success) {
                    if (this.refreshAfter)
                        setTimeout(() => {
                            window.location.reload()
                        }, 2000)

                    if (this.callbackSuccess)
                        this.callbackSuccess(data)
                } else {
                    this.enable()

                    if (this.callbackFailure)
                        this.callbackFailure(data)
                }
            } catch (error) {
                this.showMessage('An error occurred in the server.')
                this.enable()

                if (this.callbackFailure)
                    this.callbackFailure(error)
            } finally {
                this.modalEl.scrollTo(0, 0)
            }
        })
    }

    onSubmit(handler) {
        this.form.onsubmit = event => {
            event.preventDefault()
            this.disable()
            
            if (!handler())
                this.enable()
        }
    }

    disable() {
        this.form.querySelector('[type="submit"]').disabled = true
        this.close.style.display = 'none'
    }

    enable() {
        this.form.querySelector('[type="submit"]').disabled = false
        this.close.style.display = 'block'
    }

    async _populate(entryId) {
        let result = await fetch(`${this.getURL}?entry_id=${entryId}`)
            .then(result => result.json())

        for (const [key, value] of Object.entries(result)) {
            const target = this.modalEl.querySelector(`[name=${key}]`)
            target.value = value
        }
    }
}


class ConfirmModal extends BaseModal {
    constructor(
        modalId, 
        callbackIfYes, 
        callbackIfNo = undefined
    ) {
        super(modalId)

        // set trigger element(s)' click events
        if (this.triggerEl.length > 0)
            this.triggerEl.forEach(trigger => {
                trigger.addEventListener('click', event => {
                    event.preventDefault()
                    this.hideMessage()
                    this.modalEl.style.display = 'flex'

                    if (trigger.hasAttribute('data-entry')) {
                        const triggerEntry = trigger.getAttribute('data-entry')
                        this.modalEl.querySelector('[name="entry_id"]').value = triggerEntry
                    }
                })
            })

        const yesBtn = this.modalEl.querySelector('.modal-yes-btn')
        const noBtn = this.modalEl.querySelector('.modal-no-btn')

        yesBtn.addEventListener('click', async() => {
            yesBtn.setAttribute('disabled', 'disabled')
            noBtn.setAttribute('disabled', 'disabled')

            let result = await callbackIfYes()

            this.showMessage(result[0])

            if (result[1]) {
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                yesBtn.removeAttribute('disabled')
            }
        })

        noBtn.addEventListener('click', () => {
            this.hideMessage()

            if (callbackIfNo)
                callbackIfNo(this.modalEl)
            else
                this.modalEl.style.display = 'none'
        })
    }
}