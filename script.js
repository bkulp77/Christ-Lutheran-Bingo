document.addEventListener('DOMContentLoaded', () => {
    const prompts = [
        "Driving on 820",
        "Bad Dad Joke",
        "Clicker Not Working",
        "20-Minute Sermon",
        "25-Minute Sermon",
        "Skipping Someone on Communion",
        "Epistle Reading Rant",
        "Talk Too Much About Reading",
        "Service Starts Late",
        "Promotes Bible Study",
        "Cell Phone Goes Off",
        "Reference to Wyoming",
        "Mic Feedback",
        "Technical Glitch",
        "Call for Volunteers",
        "Coughing Fit in Pews",
        "Hymn Accompaniment Mistake",
        "Infant Crying",
        "Shuffling Bulletins",
        "Late Arrival Walks to Front",
        "Standard Liturgy Stumble",
        "Peace Be With You",
        "Reference to Fort Worth",
        "Organ Postlude Applause"
    ];

    const grid = document.getElementById('bingo-grid');
    const resetBtn = document.getElementById('reset-btn');

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function generateBoard() {
        grid.innerHTML = '';
        const shuffledPrompts = shuffle([...prompts]);
        let promptIndex = 0;

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');

            if (i === 12) {
                cell.textContent = "FREE SPACE";
                cell.classList.add('free-space');
            } else {
                cell.textContent = shuffledPrompts[promptIndex];
                promptIndex++;
            }

            cell.addEventListener('click', () => {
                cell.classList.toggle('selected');
            });

            grid.appendChild(cell);
        }
    }

    resetBtn.addEventListener('click', generateBoard);
    generateBoard();
});
