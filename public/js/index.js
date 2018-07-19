

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
                  
                 $('.alert').attr('aria-hidden','false').removeClass('hidden');
  
            },

        });
    });
}



function createAccount() {
$('.Create').on('click', function () {
    
    if($('.createForm').is(':visible')){
        $('.createForm').addClass('hidden');
    } else {
        $('.createForm').removeClass('hidden');
    }
});

}

function selectLogin() {
$('.landing').on('click', 'button.SelectLogin', function () {
    console.log('hello')
    location.href = '/login.html';    
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
$(selectLogin);
