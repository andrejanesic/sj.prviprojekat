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
//a

if (document.body.id === 'password') {
    window.onload = () => {
        const password = document.querySelector('._password');
        const token = window.location.search.match(/token=([^&]+)/)[1];
        const resetUuid = window.location.search.match(/resetUuid=([^&]+)/)[1];
        document.querySelector('._reset').addEventListener('click', async (ev) => {
            let params = {
                password: password.value,
                token: token,
                resetUuid: resetUuid,
            };

            // let {e} = schema.validate(params, {abortEarly: false});
            // if (e != null) {
            //     error.classList.remove('hidden');
            //     return;
            // }

            fetchJson('/api/reset/submit/admin', params)
                .then(async (response) => {
                    console.log(response);
                    if (response.status === 200) {
                        message('Your password has been successfully reset. You may now log in.');
                    } else {
                        response.text().then(t => message(t)).catch(err => message(err));
                    }
                }).catch(err => {
                message(err);
            });
        });
    }
}