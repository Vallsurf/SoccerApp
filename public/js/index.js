function locateButtonClick() {
    $('.login').on('click', (event) => {
        event.preventDefault();
        const data = { username: 'admin5', password: 'admin' };
        $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(data),
            success: (response) => {
                sessionStorage.setItem('token', response.token);
                location.href = '/protected.html';
            },
        });
    });
}


$(locateButtonClick);
