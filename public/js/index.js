$(function() {
    $('#login').click(() => {
        $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            data: {
                name: 'admin3',
                password: 'admin',
            },
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/protected.html';
            }
        })
    })
})