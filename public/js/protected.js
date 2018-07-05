function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

function checkUser() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        location.href = 'http://localhost:3000/';
    } else {
        $.ajax({
            url: '/api/users',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                console.log(response);
                $('#loader-wrapper').hide();
                const payloadData = parseJwt(token);
                console.log(payloadData);
                $('#email').text(`Welcome back: ${payloadData.username}`);
            },
            error: () => {
                sessionStorage.removeItem('token');
                location.href = 'http://localhost:3000/';
            },
        });
    }
}
$(() => {
    checkUser();
});
