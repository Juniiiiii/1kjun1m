const specSquares = document.getElementById('square-wave').querySelectorAll('span');
const specSquareDivs = document.getElementById('square-wave').querySelectorAll('span div');
const specFold = document.querySelector('.spec-fold');

const specRows = getComputedStyle(document.documentElement).getPropertyValue('--spec-rows');
const specCols = getComputedStyle(document.documentElement).getPropertyValue('--spec-cols');

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
    })
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