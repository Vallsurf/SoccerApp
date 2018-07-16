
let teamdata;
let position;

function getToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        location.href = 'http://localhost:3000/';
    } else { return token; }
}

function loadTeam() {
    const token = getToken();
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
                teamdata = response;
                console.log(teamdata);
                $('.teamthis').text(` Team: ${response.name}`);
                $('.teaminfo tbody').append(`
                	<tr>
                    <td>1</td>
                    <td>${response.formation.Player1.name}</td>
                	<td>${response.formation.Player1.position}</td>
                    <td><a class="editpos" id="Player1">Edit</a></td>
                    </tr>

                    <tr>
                    <td>2</td>
                    <td>${response.formation.Player2.name}</td>
                    <td>${response.formation.Player2.position}</td>
                    <td><a class="editpos" id="Player2">Edit</a></td>
                    </tr>

                    <tr>
                    <td>3</td>
                    <td>${response.formation.Player3.name}</td>
                    <td>${response.formation.Player3.position}</td>
                    <td><a class="editpos" id="Player3">Edit</a></td>
                    </tr>

                    <tr>
                    <td>4</td>
                    <td>${response.formation.Player4.name}</td>
                    <td>${response.formation.Player4.position}</td>
                    <td><a class="editpos" id="Player4">Edit</a></td>
                    </tr>

                    <tr>
                    <td>5</td>
                    <td>${response.formation.Player5.name}</td>
                    <td>${response.formation.Player5.position}</td>
                    <td><a class="editpos" id="Player5">Edit</a></td>
                    </tr>

                    <tr>
                    <td>6</td>
                    <td>${response.formation.Player6.name}</td>
                    <td>${response.formation.Player6.position}</td>
                    <td><a class="editpos" id="Player6">Edit</a></td>
                    </tr>

                    <tr>
                    <td>7</td>
                    <td>${response.formation.Player7.name}</td>
                    <td>${response.formation.Player7.position}</td>
                    <td><a class="editpos" id="Player7">Edit</a></td>
                    </tr>

                    <tr>
                    <td>8</td>
                    <td>${response.formation.Player8.name}</td>
                    <td>${response.formation.Player8.position}</td>
                    <td><a class="editpos" id="Player8">Edit</a></td>
                    </tr>
                	
                    `);
            },

            error: () => {
                location.href = 'http://localhost:3000/';
            },
        });
    }
}

// function getPlayers(element) {
//     // $('.editpos').on('click', (event) => {
//         // event.preventDefault();
//         const token = getToken();
//         console.log(teamdata)
//         const playerName = teamdata.formation[element.id].name
//          $('.editname').html(`<h1>Replace Player <h3>${playerName}</h3>`);
//         $.ajax({
//             url: '/api/players',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//             success: (response) => {
//                 $('.teaminfo').hide();
//                 // console.log(response);
//                 $('.editteam').removeClass('hidden');
//                 for (let i = 0; i < response.length; i++) {
//                     $('.players tbody').append(
//                         `<tr>
//                           <th scope="row">${i + 1}</th>
//                           <td>${response[i].name}</td>
//                           <td>${response[i].position}</td>
//                           <td><input type="radio"  name="selectedPlayer" value="${response[i]._id}"></td>
//                         </tr>
//                        `,
//                     );
//                 }
//             },
//             error: () => {
//                 sessionStorage.removeItem('token');
//                 location.href = 'http://localhost:3000/';
//             },
//         });
//     // });
// }


function getPlayers() {
    $('.teaminfo').on('click', 'a.editpos', function () {
        // event.preventDefault();
        position = $(this).attr('id');
        const token = getToken();
        const playerName = teamdata.formation[position].name;
        $('.editname').html(`<h1>Replace Player <h3>${playerName}</h3>`);
        $.ajax({
            url: '/api/players',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                $('.teaminfo').hide();
                // console.log(response);
                $('.editteam').removeClass('hidden');
                for (let i = 0; i < response.length; i++) {
                    $('.players tbody').append(
                        `<tr>
                          <th scope="row">${i + 1}</th>
                          <td>${response[i].name}</td>
                          <td>${response[i].position}</td>
                          <td><input type="radio"  name="selectedPlayer" value="${response[i]._id}"></td>
                        </tr>
                       `,
                    );
                }
            },
            error: () => {
                sessionStorage.removeItem('token');
                location.href = 'http://localhost:3000/';
            },
        });
    });
}


function submitEdit() {
    $('.players').submit((event) => {
        event.preventDefault();

        // i need the team id, position, and newplayer id

        // const newName = teamname.value;
        const subPlayers = $('input[name=selectedPlayer]:checked').val();


        if ((subPlayers == null)) {
            $('.warning').html('<h4>You Must Select a Player</h4>').attr('hidden', false);
            console.log('notselected');
            return false;
        }

        console.log(subPlayers);
        console.log(position);
        console.log(teamdata._id);

        const updateTeam = {
            id: teamdata._id,
            formation: {
                [position]: subPlayers,
            },
        };

        console.log(updateTeam);


        const token = getToken();

        $.ajax({
            url: `/api/teams/roster/${teamdata._id}`,
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                //     Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify(updateTeam),
            success: (response) => {
                console.log('updated');
                location.href = '/protected.html';
            },
            error: (err) => {
                console.log(err);
            },
        });
        return true;
    });
}

$(loadTeam);
$(submitEdit);
$(getPlayers);
