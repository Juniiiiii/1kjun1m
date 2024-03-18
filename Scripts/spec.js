const specPageWrapper = document.querySelector('.spec-page-wrapper');
const specPageWrapperRect = specPageWrapper.getBoundingClientRect();
const specTsunami = document.querySelector('.spec-tsunami');
const specSquares = document.querySelectorAll('.spec-grid span');
const specSquareDivs = document.querySelectorAll('.spec-grid span div');
let specPageWithinView = false;
let tsunamiRange = [specPageWrapperRect.y + specPageWrapperRect.height * (1/3) + window.scrollY,
                    specPageWrapperRect.y + specPageWrapperRect.height + window.scrollY]

const specRows = getComputedStyle(document.documentElement).getPropertyValue('--spec-rows');
const specCols = getComputedStyle(document.documentElement).getPropertyValue('--spec-cols');

const specDimensions = [specRows, specCols];

function indexToRowCol(index) {
    return [Math.floor(index / specCols), index % specCols];
}

let squareScalingDuration = 100;
let squareScalingSpeed = 40;
let squareScaleId = null;
let squareScaling = false;
let squareScalingTarget = 0;
let squareDoubleClicked = false;

specSquares.forEach(square => {
    square.addEventListener('click', () => {
        squareScalingAnimation(square.getAttribute('index'));
    });
});

function squareScalingAnimation(index) {
    if (squareDoubleClicked) return;
    else if (!squareDoubleClicked && squareScaleId != null) {
        clearTimeout(squareScaleId);
        squareScaleId = null;
        squareDoubleClicked = true;

        anime({
            targets: specSquareDivs,
            scale: {value: squareScalingTarget, easing: 'easeInOutQuad', duration: squareScalingDuration},
            delay: anime.stagger(squareScalingSpeed, 
                {grid: [specCols, specRows], 
                from: index}),
            complete: function(anim) {
                squareScaling = false;
                squareScaleId = null;
                squareDoubleClicked = false;
            }
        });

        squareScalingTarget = oneZero(squareScalingTarget);
        return;
    } else if (squareScaling) return;
    squareScaling = true;

    squareScaleId = setTimeout(() => {
        squareScaleId = null;
        anime({
            targets: specSquareDivs,
            scale: [
                {value: squareScalingTarget, easing: 'easeInOutQuad', duration: squareScalingDuration},
                {value: oneZero(squareScalingTarget), easing: 'easeInOutQuad', duration: squareScalingDuration * 1.5}
            ],
            delay: anime.stagger(squareScalingSpeed, 
                {grid: [specCols, specRows], 
                from: index}),
            complete: function(anim) {
                squareScaling = false;
            }
        });
    }, 200);
}



document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', function() {
        if (specPageWithinView) moveTsunamiIntoPage(
            (window.scrollY + window.innerHeight - tsunamiRange[0]) * 100 / (tsunamiRange[1] - tsunamiRange[0]) + (-100)
        );
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
