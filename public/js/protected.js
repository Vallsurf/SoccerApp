function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}


function getToken() {
    const token = sessionStorage.getItem('token');
    if (!token) {
        location.href = 'http://localhost:3000/';
    } else { return token; }
}

function getTeams() {
    const token = getToken();
    $.ajax({
        url: '/api/teams',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        success: (response) => {
                        const payloadData = parseJwt(token);
            // console.log(payloadData);
            $('#email').text(`Welcome back ${payloadData.username}!`);
            for (let i = 0; i < response.length; i++) {
                const base_url = window.location.origin;
                $('#teams').append(
                    `<div class ="team row row-eq-height">
                     <div class ="col-md-8"> ${response[i].name} </div>
                     <div class ="col-md-2"><a href='${base_url}/teamview.html#${response[i]._id}'>View</a></div>
                     <div class ="delete col-md-2"><a class="delete" href='#${response[i]._id}'>Delete</a>
                     <button class="btn btn-info btn-block hidden" id="${response[i]._id}" type="submit" id="delete">Delete?</button></div>
                     </div> `,
                );
            }
        },
        error: () => {
            sessionStorage.removeItem('token');
            location.href = 'http://localhost:3000/';
        },
    });
}

function deleteTeam() {
    $('#teams').on('click', 'a.delete', (event) => {
        console.log('clicked')
        // event.preventDefault();
        const teamid = location.hash.substr(1);
        $(`#${teamid}`).removeClass('hidden');
        $(`#${teamid}`).on('click', (event) => {
            const token = getToken();
            $.ajax({
                url: `/api/teams/${teamid}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                success: (response) => {
                    const base_url = window.location.origin;
                    location.href = `${base_url}/protected.html`;
                },
                error: (err) => {
                    console.log(err);
                },
            });
        });
    });
}


function createTeam() {
    $('.create').on('click', (event) => {
        event.preventDefault();
        const token = getToken();

        $.ajax({
            url: '/api/players',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            success: (response) => {
                $('.teams-container').hide();
                console.log(response);
                $('.createteam').removeClass('hidden');
                for (let i = 0; i < response.length; i++) {
                    $('.createteam tbody').append(
                        `<tr>
                          <th scope="row">${i + 1}</th>
                          <td>${response[i].name}</td>
                          <td>${response[i].position}</td>
                          <td><input type="checkbox"  name="selectedPlayer" value="${response[i]._id}"></td>
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

function submitNewTeam() {
$('.newteam').submit((event) => {

    const newName = teamname.value;
    const subPlayers = $('input[name=selectedPlayer]:checked').map((i, values) => $(values).val()).get();
    if (!(subPlayers.length == 8)) {
        $('.warning').html('<h4>You Must Select 8 Players</h4>').attr('hidden', false);
        return false;
    }
    else{
        //hides warning if present
    $('.warning').attr('hidden', true);
    //creates object of checked selection
    const newteam = {
        name: `${newName}`,
        formation: {
            Forward1: subPlayers[0],
            Forward2: subPlayers[1],
            Midfield1: subPlayers[2],
            Midfield2: subPlayers[3],
            Defense1: subPlayers[4],
            Defense2: subPlayers[5],
            Utility: subPlayers[6],
            Goalie: subPlayers[7],
        },
    };

    const token = getToken();

    $.ajax({
        url: '/api/teams',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(newteam),
        success: (response) => {
            console.log('added')
        },
    });
    return true;
}
});
}

$(getTeams);
$(getToken);
$(createTeam);
$(deleteTeam);
$(submitNewTeam);


// $(createSubmit);
// function createSubmit() {
//     $('#createSubmit').on('click', (event) => {
//         event.preventDefault();
//         // const teamName = $('input[name=teamname]').val();
//         const newName = teamname.value
//         console.log(newName);
//         const subPlayers = $('input[name=selectedPlayer]:checked').map((i, values) => $(values).val()).get();

//         if (!(subPlayers.length == 8)) { $('.warning').html('<h4>You Must Select 8 Players</h4>').attr('hidden', false); }
//         else {

//             $('.warning').attr('hidden', true);
//             const newteam = {name: 'My Team 2',
//                             formation: {
//                     Forward1: subPlayers[0],
//                     Forward2: subPlayers[1],
//                     Midfield1: subPlayers[2],
//                     Midfield2: subPlayers[3],
//                     Defense1: subPlayers[4],
//                     Defense2: subPlayers[5],
//                     Utility: subPlayers[6],
//                     Goalie: subPlayers[7]
//                 }
//             };
//                 console.log(newteam);
//             }

//     });
// }
