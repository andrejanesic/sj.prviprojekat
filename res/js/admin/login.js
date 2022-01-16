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
if (document.body.id === 'login') {
    window.onload = () => {
        const email = document.querySelector('._email');
        const pass = document.querySelector('._password');
        const error = document.querySelector('._error');
        console.log('click');
        document.querySelector('._login').addEventListener('click', async (ev) => {
            let params = {
                email: email.value,
                password: pass.value,
            };

            // let {e} = schema.validate(params, {abortEarly: false});
            // if (e != null) {
            //     error.classList.remove('hidden');
            //     return;
            // }

            fetchJson('/api/login/admin', params)
                .then(async (response) => {
                    if (response.status === 200) {
                        let body = await response.json();
                        document.cookie = `token=${body.token}`;
                        window.location = window.location.origin + '/admin'
                    } else {
                        let err = await response.text();
                        message(err);
                    }
                }).catch(err => {
                message(err);
            });
        });
    }
}