/**
 * Transforms an object into a FormData object.
 * @param obj Input data.
 * @return {FormData} FormData object.
 */
function formData(obj) {
    let fd = new FormData();
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        fd.append(keys[i], obj[keys[i]]);
    }
    return fd;
}

/**
 * Wrapper for {@link #fetch} function for sending JSON post requests.
 * @param input
 * @param object
 * @param method Optional. Defaults to POST.
 * @return {Promise<Response>}
 */
async function fetchJson(input, object, method = 'POST') {
    return fetch(input, {
        method: method,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(object),
    });
}

let setup = false;

/**
 * Helper function for generating messages. Displays the message with a button on screen.
 * @param text Message text.
 * @param button Button label.
 */
function message(text, button = 'Ok') {
    let message, messageText, messageButton, messageBackground;
    if (!setup) {
        message = document.querySelector('._message');
        messageText = document.querySelector('._message_body');
        messageButton = document.querySelector('._message_button');
        messageBackground = document.querySelector('._message_background');
        messageButton.addEventListener('click', evt => {
            message.classList.add('hidden');
        });
        messageBackground.addEventListener('click', evt => {
            message.classList.add('hidden');
        });
    }

    messageText.textContent = text;
    messageButton.textContent = button;
    message.classList.remove('hidden');
}