const specPageWrapper = document.querySelector('.spec-page-wrapper');
const specPageWrapperRect = specPageWrapper.getBoundingClientRect();
const specPage = document.querySelector('.spec-page');
const specTsunami = document.querySelector('.spec-tsunami');
const specSquares = document.getElementById('square-wave').querySelectorAll('span');
const specSquareDivs = document.getElementById('square-wave').querySelectorAll('span div');
//const specWave = document.getElementById('wave-path');
let specPageWithinView = false;
let tsunamiRange = [specPageWrapperRect.y + specPageWrapperRect.height * (1/3) + window.scrollY,
                    specPageWrapperRect.y + specPageWrapperRect.height + window.scrollY]

const specRows = getComputedStyle(document.documentElement).getPropertyValue('--spec-rows');
const specCols = getComputedStyle(document.documentElement).getPropertyValue('--spec-cols');

let squareScalingDuration = 100, squareScalingSpeed = 40, squareScaling = false, squareBlacked = false;

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', function() {
        if (specPageWithinView) moveTsunamiIntoPage(
            (window.scrollY + window.innerHeight - tsunamiRange[0]) * 100 / (tsunamiRange[1] - tsunamiRange[0]) + (-100)
        );
    });

    specSquares.forEach(square => {
        if (square.getAttribute('index') == 0) {
            square.addEventListener('click', (event) => {
                squareFlippingAnimation(square.getAttribute('index'));
            });
        } else {
            square.addEventListener('click', (event) => {
                squareScalingAnimation(square.getAttribute('index'));
            });
        }
    });

    var specPageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            specPageWithinView = entry.isIntersecting;
        });
    });

    specPageObserver.observe(specPageWrapper);
});

function moveTsunamiIntoPage(percentage) {
    specTsunami.style.transform = 'translateY(' + clamp(percentage, -100, 0) + '%)';
}

function squareFlippingAnimation(index) {
    if (squareScaling) return;
    squareScaling = true;
    anime({
        targets: specSquareDivs,
        scale: {value: squareBlacked ? 1 : 0, easing: 'easeInOutQuad', duration: squareScalingDuration},
        delay: anime.stagger(squareScalingSpeed, 
            {grid: [specCols, specRows], 
            from: index}),
        begin: function(anim) {
        },
        complete: function(anim) {
            squareScaling = false;
            squareBlacked = !squareBlacked;
        }
    });
}

function squareScalingAnimation(index) {
    if (squareScaling) return;
    squareScaling = true;
    anime({
        targets: specSquareDivs,
        scale: [
            {value: squareBlacked ? 1 : 0, easing: 'easeInOutQuad', duration: squareScalingDuration},
            {value: oneZero(squareBlacked ? 1 : 0), easing: 'easeInOutQuad', duration: squareScalingDuration * 1.5}
        ],
        delay: anime.stagger(squareScalingSpeed, 
            {grid: [specCols, specRows], 
            from: index}),
        complete: function(anim) {
            squareScaling = false;
        }
    });
}

//let firstSquare = document.getElementById('first-square');
//firstSquare.style.backgroundColor = '#121113';
//firstSquare.style.backgroundImage = '-webkit-linear-gradient(315deg, #121113 50%, #fef9ef 50%)';
//firstSquare.style.border = "none";
//firstSquare.style.borderRight = "1px solid #121113";
//firstSquare.style.borderBottom = "1px solid #121113";

