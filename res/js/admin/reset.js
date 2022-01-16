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

if (document.body.id === 'reset') {
    window.onload = () => {
        const email = document.querySelector('._email');
        document.querySelector('._reset').addEventListener('click', async (ev) => {
            let params = {
                email: email.value,
            };

            // let {e} = schema.validate(params, {abortEarly: false});
            // if (e != null) {
            //     error.classList.remove('hidden');
            //     return;
            // }

            fetchJson('/api/reset/request/admin', params)
                .then(async (response) => {
                    console.log(response);
                    if (response.status === 200) {
                        message('Your password reset link has been sent. Check your email.');
                    } else {
                        response.text().then(t => message(t)).catch(err => message(err));
                    }
                }).catch(err => {
                message(err);
            });
        });
    }
}