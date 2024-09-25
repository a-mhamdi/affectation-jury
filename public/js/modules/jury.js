function openJury(membre) {
    document.getElementById('popupJury' + membre).style.display = 'block';
    fetchJury(membre);
}

const selectedJury = {
    jury1: 'UNDEF',
    jury2: 'UNDEF'
};

async function saveJury(membre) {
    const theJury = document.getElementById('selectJury' + membre).value;

    if (membre === 1) {
        selectedJury.jury1 = theJury;
        jury1.innerHTML = theJury;
    } else {
        selectedJury.jury2 = theJury;
        jury2.innerHTML = theJury;
    }
    document.getElementById('popupJury' + membre).style.display = 'none';
}

export { openJury, saveJury, selectedJury };

/* LOCAL USAGE */

async function fetchJury(membre) {
    try {
        const response = await fetch('/api/getJury');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const choices = await response.json();
        const selection = 'selectJury' + membre;

        const select = document.getElementById(selection);
        select.innerHTML = ''; // Clear existing options

        if (choices.length === 0) {
            console.log('No choices found');
            const option = document.createElement('option');
            option.textContent = 'No choices available';
            select.appendChild(option);
        } else {
            // Add a default option
            const defaultOption = document.createElement('option');
            defaultOption.value = 'Indéfini';
            defaultOption.textContent = '-> SÉLECTIONNEZ <-';
            select.appendChild(defaultOption);

            choices.forEach(choice => {
                const option = document.createElement('option');
                option.value = choice.name || choice._id; // Use _id as fallback
                option.textContent = choice.name; // choice.label || choice.name; // Use name as fallback
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error fetching choices:', error);
    }
}
