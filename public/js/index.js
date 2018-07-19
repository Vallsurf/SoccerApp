
// Function for Logging a User in
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
                $('.alert').attr('aria-hidden', 'false').removeClass('hidden');
            },

        });
    });
}

// Login Button redirect to Login Page
function selectLogin() {
    $('.landing').on('click', 'button.SelectLogin', () => {
        location.href = '/login.html';
    });
}

// Function for Submitting and Creating a New Account
function submitNew() {
    $('.createAccount').submit((event) => {
        event.preventDefault();
        const user = newusername.value;
        const pass = newpassword.value;
        const first = firstName.value;
        const last = lastName.value;
        const data = {
            username: `${user}`, password: `${pass}`, firstname: `${first}`, lastname: `${last}`,
        };
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
                $('.alert').attr('aria-hidden', 'false').removeClass('hidden');
            },

        });
    });
}


$(login);
$(createAccount);
$(submitNew);
$(selectLogin);
