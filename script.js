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
    const claimBtn = document.getElementById('claim-bingo-btn');
    const claimArea = document.getElementById('claim-area');
    const nameInput = document.getElementById('winner-name');
    const timestampEl = document.getElementById('card-timestamp');
    const winnersList = document.getElementById('winners-list');
    const winOverlay = document.getElementById('win-overlay');
    const ackWinBtn = document.getElementById('ack-win-btn');
    let hasWon = false;
    let cardGeneratedAt = null;

    const WINNERS_KEY = 'bingoWinners';
    const WINNERS_DATE_KEY = 'bingoWinnersDate';

    function todayStr() {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    }

    function loadWinners() {
        const storedDate = localStorage.getItem(WINNERS_DATE_KEY);
        const today = todayStr();
        if (storedDate !== today) {
            localStorage.removeItem(WINNERS_KEY);
            localStorage.setItem(WINNERS_DATE_KEY, today);
            return [];
        }
        try { return JSON.parse(localStorage.getItem(WINNERS_KEY) || '[]'); }
        catch { return []; }
    }
    function saveWinners(list) {
        localStorage.setItem(WINNERS_KEY, JSON.stringify(list));
        localStorage.setItem(WINNERS_DATE_KEY, todayStr());
    }
    function renderWinners() {
        const winners = loadWinners();
        if (!winners.length) {
            winnersList.innerHTML = '<li style="color:#627d98;">No winners yet</li>';
            return;
        }
        winnersList.innerHTML = winners.map((w, idx) => `
            <li style="flex-direction:column; align-items:stretch;">
                <div style="display:flex; justify-content:space-between;">
                    <span><strong>${escapeHtml(w.name)}</strong></span>
                    <span>${w.time}</span>
                </div>
                <button class="view-card-btn" data-idx="${idx}" style="margin-top:4px; font-size:12px; padding:4px 8px; background:#0b69a3; color:#fff; border:none; border-radius:4px; cursor:pointer;">View Card</button>
                <div class="winner-card" id="winner-card-${idx}" style="display:none; margin-top:6px;"></div>
            </li>
        `).join('');

        winnersList.querySelectorAll('.view-card-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx, 10);
                const cardEl = document.getElementById('winner-card-' + idx);
                if (cardEl.style.display === 'none') {
                    cardEl.style.display = 'block';
                    cardEl.innerHTML = renderMiniCard(winners[idx].board);
                    btn.textContent = 'Hide Card';
                } else {
                    cardEl.style.display = 'none';
                    btn.textContent = 'View Card';
                }
            });
        });
    }

    function renderMiniCard(board) {
        if (!board || board.length !== 25) return '<em>No card data</em>';
        const cells = board.map(c => `
            <div style="
                background:${c.selected ? '#1982c4' : '#f0f4f8'};
                color:${c.selected ? '#fff' : '#102a43'};
                border:1px solid #bcccdc;
                border-radius:3px;
                font-size:7px;
                padding:2px;
                text-align:center;
                line-height:1.1;
                word-break:break-word;
                overflow:hidden;
            ">${escapeHtml(c.text)}</div>
        `).join('');
        return `<div style="display:grid; grid-template-columns:repeat(5,1fr); gap:2px; width:100%; aspect-ratio:1;">${cells}</div>`;
    }
    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));
    }
    function formatTime(date) {
        return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }

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
        claimArea.style.display = 'block';
        nameInput.value = '';
        winOverlay.style.display = 'flex';
    }

    function generateBoard() {
        grid.innerHTML = '';
        hasWon = false;
        claimArea.style.display = 'none';
        cardGeneratedAt = new Date();
        timestampEl.textContent = 'Card generated: ' + formatTime(cardGeneratedAt);
        timestampEl.style.color = '';
        timestampEl.style.fontWeight = '';

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

    ackWinBtn.addEventListener('click', () => {
        winOverlay.style.display = 'none';
        nameInput.focus();
    });

    claimBtn.addEventListener('click', () => {
        if (!hasWon) return;
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please enter your name.');
            nameInput.focus();
            return;
        }
        const winners = loadWinners();
        const cells = Array.from(document.querySelectorAll('.bingo-cell'));
        const board = cells.map(cell => ({
            text: cell.textContent.trim(),
            selected: cell.classList.contains('selected')
        }));
        winners.unshift({
            name: name,
            time: formatTime(new Date()),
            cardTime: formatTime(cardGeneratedAt),
            board: board
        });
        saveWinners(winners);
        renderWinners();
        claimArea.style.display = 'none';
        alert('Recorded! Card was generated at ' + formatTime(cardGeneratedAt));
    });

    resetBtn.addEventListener('click', generateBoard);
    generateBoard();
    renderWinners();
});