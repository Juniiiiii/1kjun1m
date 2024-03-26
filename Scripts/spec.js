const specSquares = document.getElementById('square-wave').querySelectorAll('span');
const specSquareDivs = document.getElementById('square-wave').querySelectorAll('span div');
const specFold = document.querySelector('.spec-fold');
const topWave = document.getElementById('top-wave');
const botWave = document.getElementById('bot-wave');

const specRows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spec-rows'));
const specCols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--spec-cols'));
const maxSquareCount = specRows * specCols;

const topWaveSet = new Set();
const botWaveSet = new Set();

let allSquareRows = [], specIsUpdating = false, squareObserver, squareScale, squareRowShowing = new Set(), curSquareRow;

//top, wave, bot
for (var i = 0; i < 3 * specRows + 1; i++) allSquareRows.push([]);

function specIndexToRowCol(index) {
    return [Math.floor(index / specCols), index % specCols];
}

function specRowColToIndex(row, col) {
    return row * specCols + col;
}

let squareAnimating = false, squareFlipped = false, squareAnimationSpeed = 40, squareAnimationDuration = 100;

document.addEventListener('DOMContentLoaded', () => {
    specSquares.forEach(square => {
        if (square.getAttribute('index') == 0) {
            square.addEventListener('click', (event) => {
                flipSquares(square.getAttribute('index'));
            });
        } else {
            square.addEventListener('click', (event) => {
                rippleSquares(square.getAttribute('index'));
            });
        }
    });

    const specGaussianRange = 3;
    for (var i = 0; i < specCols; i++) {
        for (var j = 0; j < randomInt(5, 9); j++) {
            let r = gaussianRandom(0, 1.5);
            r = Math.abs(r);
            r = clamp(r, 0, specGaussianRange);
            r = r * specRows / specGaussianRange;
            r = Math.floor(r);
            r = specRows - r;
            addSquareTop(r, i);
        }
    }

    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < specCols; j++) {
            let currentSquare = specSquareDivs[specRowColToIndex(i, j)];
            allSquareRows[specRows + i + 1].push(currentSquare);
            if (j == 0) currentSquare.classList.add('border-one');
            else currentSquare.classList.add('border-left');
        }
    }

    for (var i = 1; i < specRows; i++) {
        for (var j = 0; j < specCols; j++) {
            let currentSquare = specSquareDivs[specRowColToIndex(i, j)];
            allSquareRows[specRows + i + 1].push(currentSquare);
            if (j == 0) currentSquare.classList.add('border-top');
            else currentSquare.classList.add('border-top-left');
        }
    }

    for (var i = 0; i < specCols; i++) {
        for (var j = 0; j < specRows; j++) {
            let r = gaussianRandom(0, 1.5);
            r = Math.abs(r);
            r = clamp(r, 0, specGaussianRange);
            r = r * specRows / specGaussianRange;
            r = Math.floor(r);
            addSquareBot(r, i);
        }
    }

    /* squareObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            curSquareRow = entry.target.getAttribute('row-num');
            if (curSquareRow) {
                if (entry.isIntersecting && !squareRowShowing.has(curSquareRow)) {
                    allSquareRows[curSquareRow].forEach(square => {
                        square.classList.remove('hide-border');
                    });
                    squareRowShowing.add(curSquareRow);
                } else {
                    allSquareRows[curSquareRow].forEach(square => {
                        square.classList.add('hide-border');
                    });
                    squareRowShowing.delete(curSquareRow);
                }
            }
        })
    });

    allSquareRows.forEach((row, index) => {
        if (row[0]) {
            squareObserver.observe(row[0]);
            row[0].setAttribute('row-num', index);
        }
    }); */
});

function flipSquares(index) {
    if (squareAnimating) return;
    squareAnimating = true;
    if (squareFlipped) specFold.style.backgroundImage = '-webkit-linear-gradient(315deg, rgba(0, 0, 0, 0) 50%, var(--white) 50%)';
    else specFold.style.backgroundImage = '-webkit-linear-gradient(315deg, rgba(0, 0, 0, 0) 50%, var(--black) 50%)';
    anime({
        targets: specSquareDivs,
        scale: {value: squareFlipped ? 1 : 0, easing: 'easeInOutQuad', duration: squareAnimationDuration},
        delay: anime.stagger(squareAnimationSpeed, 
            {grid: [specCols, specRows], 
            from: index}),
        complete: function(anim) {
            squareAnimating = false;
            squareFlipped = !squareFlipped;
        }
    });
}

function rippleSquares(index) {
    if (squareAnimating) return;
    squareAnimating = true;
    anime({
        targets: specSquareDivs,
        scale: [
            {value: squareFlipped ? 1 : 0, easing: 'easeInOutQuad', duration: squareAnimationDuration},
            {value: oneZero(squareFlipped ? 1 : 0), easing: 'easeInOutQuad', duration: squareAnimationDuration * 1.5}
        ],
        delay: anime.stagger(squareAnimationSpeed,
            {grid: [specCols, specRows],
            from: index}),
        complete: function(anim) {
            squareAnimating = false;
        }
    });
}

function addSquareTop(row, col) {
    if (topWaveSet.has(specRowColToIndex(row, col)) || row <= 0) return;
    if (row == specRows && col == 1) return; // spec-fold

    var span = document.createElement('span');
    span.style.gridArea = row + ' / ' + col;

    if (span.style.gridArea == "") return;

    var div = document.createElement('div');
    span.appendChild(div);

    div.style.scale = squareScalingFunctionReverse(row);

    if (row == specRows) div.classList.add('border-bot');
    else {
        /* assignBorder(div); */
        /* div.style.borderRadius = (1 - row/specRows) * 60 + '%'; */
        div.classList.add('border-one');
    }
    /* div.classList.add('hide-border'); */

    if (row == specRows && topWaveSet.has(specRowColToIndex(row, col - 1))) {
        div.style.borderLeft = 'none';
    }

    topWave.appendChild(span);
    allSquareRows[row].push(div);

    topWaveSet.add(specRowColToIndex(row, col));
}

function addSquareBot(row, col) {
    if (botWaveSet.has(specRowColToIndex(row, col)) || row > specRows) return;

    var span = document.createElement('span');
    span.style.gridArea = row + ' / ' + col;

    if (span.style.gridArea == "") return;

    var div = document.createElement('div');
    span.appendChild(div);

    div.style.scale = squareScalingFunction(row);

    if (row == 0) div.classList.add('border-top');
    else {
        /* assignBorder(div); */
        div.classList.add('border-one');
        /* div.style.borderRadius = row/specRows * 60 + '%'; */
    }
    /* div.classList.add('hide-border'); */

    botWave.appendChild(span);
    allSquareRows[specRows * 2 + row].push(div);

    botWaveSet.add(specRowColToIndex(row, col));
}

function showBorderOnRow(row) {
    allSquareRows[row].forEach(square => {
        square.classList.remove('hide-border');
    });
}

function hideBorderOnRow(row) {
    allSquareRows[row].forEach(square => {
        square.classList.add('hide-border');
    });
}

let squareParameter = 9.1;
function squareScalingFunction(row) {
    return (squareParameter + 1)/(row + squareParameter);
}

function squareScalingFunctionReverse(row) {
    return (squareParameter + 1) / (-row + specRows + 1 + squareParameter);
}