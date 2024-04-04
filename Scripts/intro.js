const thirdPage = document.querySelector('.third-page');
const introPage = document.querySelector('.intro-page');
const texts = document.querySelectorAll('.intro-page .text');
const whyNotPath = document.getElementById('why-not-path');
const scrollPath = document.getElementById('scroll-path');
const halfLine = document.querySelector('.intro-page .halfline div');
const whoOverlay = document.querySelector('.intro-page .who-overlay');
const catBackground = document.querySelector('.intro-page .cat-background');
const catTunnels = document.querySelectorAll('.intro-page .cat-background .tunnel-wrapper');
const whoTunnels = document.querySelectorAll('.intro-page .who-background .tunnel-wrapper');
const transitionTunnels = document.querySelectorAll('.intro-page .transition-background .tunnel-wrapper');
const textContainer = document.querySelector('.intro-page .text-container');

let introFixed = false;
let textLetters = [], allLetters = [], allOriginals = [], textOriginals = [];
let whyNotPoints = [], whyBox = whyNotPath.getBBox(), whyWidth = whyBox.width, whyHeight = whyBox.height;
let scrollPoints = [], scrollBox = scrollPath.getBBox(), scrollWidth = scrollBox.width, scrollHeight = scrollBox.height;

textContainer.style.aspectRatio = `${whyWidth}/${whyHeight}`;

document.addEventListener('DOMContentLoaded', () => {
    fixIntroPage();
    spanifyAllText();
    generateRandomPoints();
    setScrollPositions();
    duplicateTunnels();

    letterInitialOpacity();
    textMagic();

    setOpacityZero();
});

function duplicateTunnels() {
    catTunnels.forEach(tunnel => {
        tunnel.parentNode.appendChild(tunnel.cloneNode(true));
    });
    catTunnels.forEach(tunnel => {
        tunnel.parentNode.appendChild(tunnel.cloneNode(true));
    });

    whoTunnels.forEach(tunnel => {
        tunnel.parentNode.appendChild(tunnel.cloneNode(true));
    });
    whoTunnels.forEach(tunnel => {
        tunnel.parentNode.appendChild(tunnel.cloneNode(true));
    });
}

function generateRandomPoints() {
    while (whyNotPoints.length < allLetters.length) {
        x = Math.random() * whyWidth;
        y = Math.random() * whyHeight;

        if (whyNotPath.isPointInFill(new DOMPoint(x, y))) {
            whyNotPoints.push([x/whyWidth*100, y/whyHeight*100]);
        }
    }

    while (scrollPoints.length < allLetters.length) {
        x = Math.random() * scrollWidth;
        y = Math.random() * scrollHeight;

        if (scrollPath.isPointInFill(new DOMPoint(x, y))) {
            scrollPoints.push([x/scrollWidth*100, y/scrollHeight*100]);
        }
    }
}

function letterInitialOpacity() {
    var opacityAS = new AnimeScroll(thirdPage, 0, 0.1, anime({
        targets: allLetters,
        opacity: [0, 0.15],
        easing: 'linear',
        delay: function(el) {
            return Math.random() * 500;
        },
        autoplay: false,
    }));

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) opacityAS.start();
        else opacityAS.stop();
    });
}

function textMagic() {
    var textsTimeline = anime.timeline({
        autoplay: false,
    });

    textLetters.forEach((text, index) => {
        textsTimeline.add({
            targets: text,
            top: function(el, i) {
                return textOriginals[index][i][1] + 'vw';
            },
            left: function(el, i) {
                return textOriginals[index][i][0] + 'vw';
            },
            opacity: [0.15, 1],
            easing: 'linear',
            duration: 1000,
            delay: anime.stagger(20, {start: 0}),
        }, '+=400');
    });

    var colorA = randomElement(charColorsRGB);
    var colorB = randomElement(charColorsRGB);
    while (colorA == colorB) colorB = randomElement(charColorsRGB);
    catBackground.style.background = `linear-gradient(to right, ${rgbToHex(colorA)}, ${rgbToHex(colorB)})`;

    var aspect = whyHeight/whyWidth;

    textsTimeline
    .add({
        targets: allLetters,
        top: function(el, i) {
            return whyNotPoints[i][1] * aspect + 'vw';
        },
        left: function(el, i) {
            return whyNotPoints[i][0] + 'vw';
        },
        duration: 5000,
        color: function(el, i) {
            return [white, interpolateColor(colorA, colorB, whyNotPoints[i][0]/100)];
        },
        easing: 'linear',
    }, '+=1500')
    .add({
        targets: halfLine,
        translateX: ['-100%', 0],
        easing: 'linear',
        duration: 4000,
    }, '+=1000')
    .add({
        targets: whoOverlay,
        keyframes: [
            {clipPath: 'polygon(0 50%, 100% 50%, 100% 50%, 0 50%)'},
            {clipPath: 'polygon(0.01% 0.01%, 99.99% 0.01%, 99.99% 99.99%, 0.01% 99.99%)'},
        ],
        easing: 'linear',
        duration: 4000,
    })
    .add({
        targets: transitionTunnels,
        keyframes: [
            {clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0% 100%)'},
            {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'},
        ],
        easing: 'linear',
        duration: 6000,
        delay: anime.stagger(1500, {start: 0})
    }, '+=1000')

    var textsAS = new AnimeScroll(thirdPage, 0.2, 0.95, textsTimeline);

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) textsAS.start();
        else textsAS.stop();
    });
}

function spanifyAllText() {
    var introRect = introPage.getBoundingClientRect();
    var textRect = textContainer.getBoundingClientRect();

    texts.forEach((text, index) => {
        var letters = spanifyLetter(text);
        textLetters.push(letters);
        letters.forEach(letter => {
            allLetters.push(letter);
        });

        var originals = [];

        letters.forEach(letter => {
            var rect = letter.getBoundingClientRect();
            originals.push([rect.left/textRect.width * 100, (rect.top - textRect.top)/textRect.width * 100]);
        });

        originals.forEach(original => {
            allOriginals.push(original);
        });

        textOriginals.push(originals);
    });
}

function setScrollPositions() {
    var aspect = scrollHeight/scrollWidth;

    allLetters.forEach((letter, index) => {
        letter.style.position = 'absolute';
        letter.style.top = scrollPoints[index][1] * aspect + 'vw';
        letter.style.left = scrollPoints[index][0] + 'vw';
    });
}

function setOpacityZero() {
    allLetters.forEach(letter => {
        letter.style.opacity = 0;
    });
}

function fixIntroPage() {
    var introPageTS = new TriggerScroll(thirdPage, 0, 1, () => {
        if (introFixed) {
            introPage.style.position = 'absolute';
        } else {
            introPage.style.position = 'fixed';
        }
        introFixed = !introFixed;
    }, () => {
        if (introFixed) {
            introPage.style.position = 'absolute';
            introPage.style.top = '700vh';
        } else {
            introPage.style.position = 'fixed';
            introPage.style.top = '0';
        }
        introFixed = !introFixed;
    });

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) introPageTS.start();
        else introPageTS.stop();
    });
}