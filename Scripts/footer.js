const footer = document.querySelector('.footer');
const footerGrid = document.querySelector('.footer .footer-grid');
const textGrid = document.querySelector('.footer .text-grid');
const footerLinks = document.querySelectorAll('.footer-grid a');

const footerCols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--footer-cols'));
const footerRows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--footer-rows'));

const allSquares = [];
const squareDuration = 100;
const squareSpeed = 35;

let squareAnimating = false;
let prevColor = null, curColor = null;

document.addEventListener('DOMContentLoaded', () => {
    for (var i = 0; i < footerCols * footerRows; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('index', i);
        footerGrid.appendChild(square);
        allSquares.push(square);
    }

    allSquares.forEach(square => {
        square.addEventListener('click', () => {
            rippleAt(square.getAttribute('index'));
        })
    });
});

function rippleAt(index) {
    if (squareAnimating) return;
    squareAnimating = true;
    anime({
        targets: allSquares,
        scale: [
            {value: 0, easing: 'easeInOutQuad', duration: squareDuration},
            {value: 1, easing: 'easeInOutQuad', duration: squareDuration * 1.5}
        ],
        delay: anime.stagger(squareSpeed,
            {
                grid: [footerCols, footerRows],
                from: index
            }
        ),
        begin: function(anim) {
            changeColor();
        },
        complete: function(anim) {
            squareAnimating = false;
        }
    });
}

function changeColor() {
    prevColor = curColor;
    while (prevColor == curColor) curColor = randomElement(particleColors);

    footer.style.backgroundColor = curColor;
    textGrid.style.color = curColor;
    footerLinks.forEach(link => link.style.color = curColor);
}
