const thirdPage = document.querySelector('.third-page'); //700vh
const introPage = document.querySelector('.intro-page'); //100vh
const catTextPath = document.querySelector('.intro-page .cat-path textPath');
const texts = document.querySelectorAll('.intro-page .text');
const whyNotSvg = document.querySelector('.intro-page .why-not svg');
const whyNotPath = document.getElementById('why-not-path');
const halfLine = document.querySelector('.intro-page .halfline div');
const whoOverlay = document.querySelector('.intro-page .who-overlay');
const catBackground = document.querySelector('.intro-page .cat-background');
const catTunnels = document.querySelectorAll('.intro-page .cat-background .tunnel-wrapper');
const whoTunnels = document.querySelectorAll('.intro-page .who-background .tunnel-wrapper');
const transitionTunnels = document.querySelectorAll('.intro-page .transition-background .tunnel-wrapper');

let introFixed = false;
let textLetters = [], allLetters = [], whyNotPoints = [], whyNotPointsBounding = {};

document.addEventListener('DOMContentLoaded', () => {
    fixIntroPage();
    spanifyAllText();
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
    var box = whyNotSvg.getBBox();
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    while (whyNotPoints.length < allLetters.length) {
        var x = Math.random() * box.width + box.x;
        var y = Math.random() * box.height + box.y;

        if (whyNotPath.isPointInFill(new DOMPoint(x, y))) {
            whyNotPoints.push([x * 1.5, y * 1.5]);

            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            /* var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = '5px';
            div.style.height = '5px';
            div.style.backgroundColor = 'red';
            div.style.left = x * 1.5 + 'px';
            div.style.top = y * 1.5 + 'px';
            document.body.appendChild(div); */
        }
    }

    whyNotPointsBounding = {
        minX: minX * 1.5 / window.innerWidth * 100,
        minY: minY * 1.5 / window.innerHeight * 100,
        maxX: maxX * 1.5 / window.innerWidth * 100,
        maxY: maxY * 1.5 / window.innerHeight * 100,
    };
}

function letterInitialOpacity() {
    var opacityAS = new AnimeScroll(thirdPage, 0, 0.15, anime({
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

    textLetters.forEach(text => {
        textsTimeline.add({
            targets: text,
            translateX: 0,
            translateY: 0,
            opacity: [0.15, 1],
            easing: 'linear',
            duration: 1000,
            delay: anime.stagger(20, {start: 0}),
        }, '+=400');
    });

    generateRandomPoints();

    var xOffset = whyNotPointsBounding.minX + (whyNotPointsBounding.maxX - whyNotPointsBounding.minX)/2;
    var yOffset = whyNotPointsBounding.minY + (whyNotPointsBounding.maxY - whyNotPointsBounding.minY)/2
                + (whyNotPath.getBoundingClientRect().top + introPage.getBoundingClientRect().top) / window.innerHeight * 100;
    var colorA = randomElement(charColorsRGB);
    var colorB = randomElement(charColorsRGB);
    while (colorA == colorB) colorB = randomElement(charColorsRGB);
    catBackground.style.background = `linear-gradient(to right, ${rgbToHex(colorA)}, ${rgbToHex(colorB)})`;

    textsTimeline
    .add({
        targets: allLetters,
        translateX: function(el, i) {
            return 100 * (whyNotPoints[i][0] - el.offsetLeft + xOffset)/window.innerWidth + 'vw';
        },
        translateY: function(el, i) {
            return 100 * (whyNotPoints[i][1] - el.offsetTop + yOffset)/window.innerHeight + 'vh';
        },
        duration: 5000,
        color: function(el, i) {
            return interpolateColor(colorA, colorB, whyNotPoints[i][0]/window.innerWidth);
        },
        easing: 'linear',
    }, '+=1000')
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

    var textsAS = new AnimeScroll(thirdPage, 0.15, 0.95, textsTimeline);

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) textsAS.start();
        else textsAS.stop();
    });
}

function spanifyAllText() {
    texts.forEach(text => {
        var letters = spanifyLetter(text);
        textLetters.push(letters);
        letters.forEach(letter => {
            allLetters.push(letter);
        });
    });

    allLetters.forEach(letter => {
        var randX = Math.random() * 98;
        var randY = Math.random() * 90 + 5;

        letter.style.transform = `
            translateX(${randX - 100 * letter.offsetLeft/window.innerWidth}vw)
            translateY(${randY - 100 * letter.offsetTop/window.innerHeight}vh)
        `;
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

function traceCathPath() {
    var catTextPS = new PercentScroll(
        thirdPage, 0.25, 0.5, (percentage) => {
            catTextPath.setAttribute('startOffset', (1 - percentage) * 100 + '%');
        }
    );
    
    document.addEventListener('introIntersection', () => {
        if (introIntersecting) catTextPS.start(); 
        else catTextPS.stop();
    });
}
