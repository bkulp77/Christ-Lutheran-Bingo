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
        "30+ Minute Sermon",
        "Full Moon Observation",
        "Call for Volunteers",
        "Coughing Fit in Pews",
        "No Foul, No Flag",
        "Infant Crying",
        "Shuffling Bulletins",
        "Late Arrival Walks to Front",
        "Standard Liturgy Stumble",
        "Peace Be With You",
        "Reference to Fort Worth",
        "Kid Wandering From Children's Chat"

    
    ];
 const grid = document.getElementById('bingo-grid');
    const resetBtn = document.getElementById('reset-btn');
    let hasWon = false;

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function checkBingo() {
        if (hasWon) return;

        const cells = Array.from(document.querySelectorAll('.bingo-cell'));
        const matrix = [];
        
        // Split flat array of 25 cells into 5 rows of 5
        for (let i = 0; i < 5; i++) {
            matrix.push(cells.slice(i * 5, i * 5 + 5));
        }

        // 1. Check Rows
        for (let r = 0; r < 5; r++) {
            if (matrix[r].every(cell => cell.classList.contains('selected'))) {
                triggerWin();
                return;
            }
        }

        // 2. Check Columns
        for (let c = 0; c < 5; c++) {
            if (matrix.every(row => row[c].classList.contains('selected'))) {
                triggerWin();
                return;
            }
        }

        // 3. Check Diagonal (Top-Left to Bottom-Right)
        if (matrix.every((row, i) => row[i].classList.contains('selected'))) {
            triggerWin();
            return;
        }

        // 4. Check Anti-Diagonal (Top-Right to Bottom-Left)
        if (matrix.every((row, i) => row[4 - i].classList.contains('selected'))) {
            triggerWin();
            return;
        }
    }

    function triggerWin() {
        hasWon = true;
        setTimeout(() => {
            alert("🎉 BINGO! 🎉");
        }, 100);
    }

    function generateBoard() {
        grid.innerHTML = '';
        hasWon = false;
        const shuffledPrompts = shuffle([...prompts]);
        let promptIndex = 0;

        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');

            if (i === 12) {
                cell.textContent = "FREE SPACE";
                cell.classList.add('free-space');
                cell.classList.add('selected'); 
            } else {
                cell.textContent = shuffledPrompts[promptIndex];
                promptIndex++;
            }

            cell.addEventListener('click', () => {
                if (i === 12) return; 
                
                cell.classList.toggle('selected');
                checkBingo();
            });

            grid.appendChild(cell);
        }
    }

    resetBtn.addEventListener('click', generateBoard);
    generateBoard();
});