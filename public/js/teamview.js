function checkUser() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        location.href = 'http://localhost:3000/';
    } else {
    	const teamid = location.hash.substr(1);
    	 $.ajax({
            url: `/api/teams/${teamid}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                console.log(response);
                $('.teamthis').text(` Team: ${response.name}`);
                $('.teaminfo tbody').append(`
                	<tr>
                    <td>1</td>
                    <td>${response.formation.Forward1.name}</td>
                	<td>${response.formation.Forward1.position}</td>
                    </tr>

                    <tr>
                    <td>2</td>
                    <td>${response.formation.Forward2.name}</td>
                    <td>${response.formation.Forward2.position}</td>
                    </tr>

                    <tr>
                    <td>3</td>
                    <td>${response.formation.Midfield1.name}</td>
                    <td>${response.formation.Midfield1.position}</td>
                    </tr>

                    <tr>
                    <td>4</td>
                    <td>${response.formation.Midfield2.name}</td>
                    <td>${response.formation.Midfield2.position}</td>
                    </tr>

                    <tr>
                    <td>5</td>
                    <td>${response.formation.Defense1.name}</td>
                    <td>${response.formation.Defense1.position}</td>
                    </tr>

                    <tr>
                    <td>6</td>
                    <td>${response.formation.Defense2.name}</td>
                    <td>${response.formation.Defense2.position}</td>
                    </tr>

                    <tr>
                    <td>7</td>
                    <td>${response.formation.Utility.name}</td>
                    <td>${response.formation.Utility.position}</td>
                    </tr>

                    <tr>
                    <td>8</td>
                    <td>${response.formation.Goalie.name}</td>
                    <td>${response.formation.Goalie.position}</td>
                    </tr>
                	
                    `);
            },

            error: () => {
                location.href = 'http://localhost:3000/';
            },
        });
    }
}

$(checkUser);
