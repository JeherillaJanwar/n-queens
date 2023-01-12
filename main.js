let size = 8;

for (let i = 0; i < size; i++) {
    document.writeln('<div>');
    for (let j = 0; j < size; j++) {
        document.writeln(`<div id="cell${i}${j}" class="cell"></div>`);
    }
    document.writeln('</div>');
}

for (let i = 0; i < size; i++) {
    document.writeln(`<span id="queen${i}" class="queen">&#9819;</span>`);
}

function makeBoard() {
    for (let i = 0; i < size; i++) {
        let id = "queen" + i;
        select(id).style.visibility = "hidden";
    }
    draw();
    init();
}

let k = 0;
let queens = [-1, -1, -1, -1, -1, -1, -1, -1];
let playing = null;
let speed = 100;
const select = (selector) => document.getElementById(selector);
const playBTN = document.querySelector(".play");
const resetBTN = document.querySelector(".reset");
const log = select("log")

function draw() {
    let count = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            id = "cell" + i + j;
            select(id).style.top = (i + 1) * 40 + 30 + "px";
            select(id).style.left = (j + 1) * 40 + "px";
            if (count++ % 2 == 0) select(id).style.backgroundColor = "#333";
            else select(id).style.backgroundColor = "#ddd";
        }
        count++;
    }
}

function search() {
    if (k == size) {
        clearInterval(playing);
        select("solved").style.cssText = "display: inline";
        select("log_entry").insertAdjacentHTML(
            "afterbegin",
            `<li style="color: green">Solved...</li>`
        );
        return;
    }

    let j = findPosition(k);
    if (j < 0) {
        displayQueens();
        queens[k] = -1;
        k--;
        select("log_entry").insertAdjacentHTML(
            "afterbegin",
            `<li><span style="color: red">Can not be placed in row ${k + 1}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;<strong>Backtrack to the row ${k}</strong><li>`
        );
        console.log(`Can not be placed in row ${k + 1}`);
    } else {
        queens[k] = j;
        k++;
        displayQueens();
        if (k == size) {
            clearInterval(playing);
            select("solved").style.cssText = "display: inline";
            select("log_entry").insertAdjacentHTML(
                "afterbegin",
                `<li style="color: green">Solved...</li>`
            );
            console.log("Solved!")
            return;
        } else {
            select("log_entry").insertAdjacentHTML(
                "afterbegin",
                `<li>New Queen is placed in position [${k - 1}, ${queens[k - 1]}]</li>`
            );
            console.log(`New Queen is placed in position [${k - 1}, ${queens[k - 1]}]`)
        }
    }
}

function findPosition(k) {
    let start = queens[k] + 1;
    for (let j = start; j < size; j++)
        if (isValid(k, j)) return j;
    return -1;
}

function isValid(row, column) {
    for (let i = 1; i <= row; i++)
        if (
            queens[row - i] == column ||
            queens[row - i] == column - i ||
            queens[row - i] == column + i
        )
            return false;
    return true;
}

function play() {
    playing = setInterval(search, speed);
    if (k == size) clearInterval(playing);
    playBTN.style.cssText = "display: none;";
    resetBTN.style.cssText = "display: inline;";
    log.style.opacity = 1;
}


function reset() {
    clearInterval(playing);
    select("log_entry").innerHTML = "";
    k = 0;
    queens = [-1, -1, -1, -1, -1, -1, -1, -1];
    displayQueens();
    playBTN.style.cssText = "display: inline;";
    resetBTN.style.cssText = "display: none;";
    log.style.opacity = 0;
    select("solved").style.cssText = "display: none";
}

function changeSpeed() {
    speed = select("speed").value;
    reset();
}

function displayQueens() {
    for (let i = 0; i < k; i++) {
        let id = "queen" + i;
        select(id).style.top = y + (i + 0) * 40 + "px";
        select(id).style.left = x + (queens[i] + 0) * 40 + "px";
        select(id).style.visibility = "visible";
    }
    for (let i = k < 0 ? 0 : k; i < size; i++) {
        let id = "queen" + i;
        select(id).style.visibility = "hidden";
    }
}

function getElementPos(element) {
    let box = element.getBoundingClientRect();
    return {
        x: box.left,
        y: box.top,
        w: box.right - box.left - 5,
        h: box.bottom - box.top - 5,
    };
}

function init() {
    posLoc = getElementPos(select("main"));
    x = posLoc.x;
    y = posLoc.y;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let id = "cell" + i + j;
            select(id).style.top = y + j * 40 + "px";
            select(id).style.left = x + i * 40 + "px";
        }
    }
}
