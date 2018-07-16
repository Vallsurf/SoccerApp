

function login() {
    $('.login').submit((event) => {
        event.preventDefault();
        const user = username.value;
        const pass = password.value;

        const data = { username: `${user}`, password: `${pass}` };
        $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/protected.html';
            },

            error: (err) => {
                console.log(err);
            },

        });
    });
}

function createAccount() {
    $('.Create').on('click', (event) => {
        event.preventDefault();
        $('.login-container').addClass('hidden');
        $('.createForm').removeClass('hidden');
    });
}

function submitNew() {
    $('.createAccount').submit((event) => {
        event.preventDefault();

        console.log('hello');
        const user = newusername.value;
        const pass = newpassword.value;
        const first = firstName.value;
        const last = lastName.value;
        console.log(user);
        const data = {
            username: `${user}`, password: `${pass}`, firstname: `${first}`, lastname: `${last}`,
        };
        console.log(data);
        $.ajax({
            url: '/api/users',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            success: (response) => {
                $('.createForm').addClass('hidden');
                $('.successful').removeClass('hidden');
            },

            error: (err) => {
                console.log(err);
            },

        });
    });
}


$(login);
$(createAccount);
$(submitNew);
