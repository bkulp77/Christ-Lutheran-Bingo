const initialPhrases = [
    "Driving on 820", "Bad Dad Jokes", "Operator Error on Clicker", "20 Min Sermon", "25 Min Sermon",
    "Reference to Wyoming", "Skipping Someone on Communion", "Talks Too Much About Epistle", "Service Starts Late", "Promotes Bible Study",
    "Reference to Parenting in Sermon", "30 Minute Plus Sermon", "Calls For Volunteers", "Pastor Goes out of Order From Bulitin", "Pastor Talks About His Family", "Pastor Talks About His Hobbies", "Pastor Talks About His Pets",
    "Acolyte Struggles", "Late Arrival Distraction", "Coffee Hour Mention", "Offertory Delay", "Kid Runs Off During Children's Message",
    "Organ Volume Surge", "Cell Phone Going Off", "Coughing Fit Symphony", "Full Moon Observed", "Pastor Overtime Warning","Pastor Mentions Last Parishes"
];

const gridElement = document.getElementById("grid");
const shuffleBtn = document.getElementById("shuffle-btn");
const resetBtn = document.getElementById("reset-btn");

let currentItems = [...initialPhrases];

function initBoard(shuffle = false) {
    gridElement.innerHTML = "";
    
    if (shuffle) {
        // Fisher-Yates Shuffle Algorithm
        for (let i = currentItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentItems[i], currentItems[j]] = [currentItems[j], currentItems[i]];
        }
    } else {
        currentItems = [...initialPhrases];
    }

    // Build grid indices mapping around a 5x5 layout matrix
    let phraseIndex = 0;
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (i === 12) {
            cell.textContent = "FREE SPACE";
            cell.classList.add("free-space", "selected");
        } else {
            cell.textContent = currentItems[phraseIndex];
            phraseIndex++;
            
            cell.addEventListener("click", () => {
                cell.classList.toggle("selected");
            });
        }
        gridElement.appendChild(cell);
    }
}

shuffleBtn.addEventListener("click", () => initBoard(true));
resetBtn.addEventListener("click", () => initBoard(false));

// Initialize template card on startup configuration
initBoard(false);
