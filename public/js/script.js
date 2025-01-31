let currentStudentId = null; // To store the ID of the current student
let initiation = null;
let perfectionnement = null;

import { openJury, saveJury, selectedJury } from './modules/jury.js';

// import { theDate, theTime } from './extra/timing.js';

document.querySelector('#openJury1').addEventListener('click',
    function (event) { openJury(1, event); });
document.querySelector('#saveJury1').addEventListener('click',
    function (event) { saveJury(1, event); });

document.querySelector('#openJury2').addEventListener('click',
    function (event) { openJury(2, event); });
document.querySelector('#saveJury2').addEventListener('click',
    function (event) { saveJury(2, event); });

document.getElementById('searchButton').addEventListener('click', function () {

    const searchIdentifiant = document.getElementById('searchIdentifiant').value;

    fetch(`/api/data?identifiant=${encodeURIComponent(searchIdentifiant)}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');

            if (data.length > 0) {
                resultDiv.innerHTML = '';
                etudiant.innerHTML = data[0].name;

                initiation = data[0].initiation;
                perfectionnement = data[0].perfectionnement;

                currentStudentId = data[0]._id; // Store the current student ID

            } else {
                alert('Aucun(e) étudiant(e) trouvé(e)');
                resultDiv.innerHTML = 'Aucun(e) étudiant(e) trouvé(e).';
                resultDiv.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erreur lors de la recherche d\'un étudiant.');
        });
});

document.getElementById('submitBtn').addEventListener('click', function () {
    if (!currentStudentId) {
        alert('Veuillez d\'abord cherchez un étudiant.');
        return;
    }

    try {

        if (!initiation || (initiation.score === undefined) || initiation.score < 10) {
            var jury_init = {
                jury1: selectedJury.jury1,
                jury2: selectedJury.jury2
            };
        } else {
            if (!perfectionnement || (perfectionnement.score === undefined) || perfectionnement.score < 10) {
                var jury_perf = {
                    jury1: selectedJury.jury1,
                    jury2: selectedJury.jury2
                };
            } else {
                alert('Document verrouillé.');
                console.log('Value is valid, aborting...');
                return; // Abort the function
            }
        }

        const updatedJury = {
            juryinit: jury_init,
            juryperf: jury_perf
        };

        console.log('Updated jury:', updatedJury);

        fetch(`/api/data/${currentStudentId}`, { // backticks
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedJury)
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was NOK.');
                return response.json();
            })
            .then(data => {
                alert(data.msg)
                // currentStudentId = null; // Reset after update
                // document.getElementById('dataForm').reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erreur lors de l\'enregistrement des données.');
            });
    } catch (error) {
    };
});
