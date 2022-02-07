function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];
            var className = `cell cell-${i}-${j}`;
            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function renderEndGame() {
    var strHTML = `<div class="end-game"> <button onclick = "init()" > Restart </button > <span></span> </div > `;
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML += strHTML;
}

function sortNums(nums) {
    var numsCopy = nums.slice()

    for (let i = 0; i < numsCopy.length; i++) {
        for (let j = 1; j < numsCopy.length - 1; j++) {
            if (numsCopy[j] < numsCopy[j - 1]) {
                var temp = numsCopy[j]
                numsCopy[j] = numsCopy[j - 1]
                numsCopy[j - 1] = temp
            }
        }
    }
    return numsCopy
}

function printPrimaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][d]
        console.log(item)
    }
}

function printSecondaryDiagonal(squareMat) {
    for (var d = 0; d < squareMat.length; d++) {
        var item = squareMat[d][squareMat.length - d - 1]
        console.log(item)
    }
}

function countAround(mat, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var currCell = mat[i][j]
            if (currCell === '$') count++
        }
    }
    return count
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function drawNum(array) {
    var idx = getRandomInt(0, array.length - 1);
    var num = array[idx];
    array.splice(idx, 1);
    return num;
}
// Move the player by keyboard arrows
function handleKey(event) {

    var i = gGamerPos.i;
    var j = gGamerPos.j;


    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
            moveTo(i + 1, j);
            break;

    }

}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}

function emptyCells() {
    var res = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell === EMPTY) res.push({ i: i, j: j });
        }
    }
    return res;
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//timer
function startStopWatch() {
    gWatchInterval = setInterval(updateWatch, 1)
    gStartTime = Date.now()
}

function updateWatch() {
    var now = Date.now()
    var time = ((now - gStartTime) / 1000).toFixed(3)
    var elTime = document.querySelector('.time')
    elTime.innerText = time
}

function endStopWatch() {
    clearInterval(gWatchInterval)
    gWatchInterval = null
}