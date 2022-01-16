// const schema = Joi
//     .object({
//         email: Joi
//             .string()
//             .email()
//             .required(),
//
//         password: Joi
//             .string()
//             .min(8)
//             .max(30)
//             .required(),
//     });
//

function registerSave(el) {
    const url = '/api/' + document.location.pathname.match(/([a-z]+)$/)[1];

    el.addEventListener('click', (ev) => {
        ev.preventDefault();

        let row = ev.target.parentNode.parentNode;
        let uuidKey = row.dataset.uuidkey;
        let uuidVal = row.dataset.uuidval;
        let inputs = row.querySelectorAll('input');
        let params = {};
        inputs.forEach(i => {
            if (i.checked)
                params[i.dataset.property] = 'true';
            else
                params[i.dataset.property] = i.value;
        });

        // post or put (insert or update)
        let method;
        let urlExt = '';
        if (!uuidVal) {
            method = 'POST';
        } else {
            params[uuidKey] = uuidVal;
            method = 'PUT';
            urlExt += '/' + uuidVal;
        }

        let token = document.cookie.match(/token=([^;]+)/)[1];
        params.token = token;

        fetchJson(url + urlExt, params, method)
            .then(async (response) => {
                console.log(response);
                if (response.status === 201) {
                    window.location.reload();
                    return false;
                } else if (response.status === 204) {
                    message('Updated');
                } else {
                    response.text().then(t => message(t)).catch(err => message(err));
                }
            }).catch(err => {
            message(err);
        });
    });
}

function registerDelete(el) {
    const url = '/api/' + document.location.pathname.match(/([a-z]+)$/)[1];

    el.addEventListener('click', (ev) => {
        ev.preventDefault();

        let row = ev.target.parentNode.parentNode;
        let uuidVal = row.dataset.uuidval;
        let params = {};

        // post or put (insert or update)
        let method;
        let urlExt = '';
        if (!uuidVal) {
            message('Error: undefined UUID key.');
            return;
        }
        method = 'DELETE';
        urlExt += '/' + uuidVal;

        let token = document.cookie.match(/token=([^;]+)/)[1];
        params.token = token;

        fetchJson(url + urlExt, params, method)
            .then(async (response) => {
                console.log(response);
                if (response.status === 200) {
                    message('Deleted');
                    row.remove();
                } else {
                    response.text().then(t => message(t)).catch(err => message(err));
                }
            }).catch(err => {
            message(err);
        });
    });
}

if (document.body.id === 'model') {
    window.onload = () => {
        document.querySelectorAll('._save').forEach(el => {
            registerSave(el);
        });
        document.querySelectorAll('._delete').forEach(el => {
            registerDelete(el);
        });
    }
}