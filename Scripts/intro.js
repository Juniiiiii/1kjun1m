const introPage = document.querySelector('.intro-page');
const whoOverlay = document.querySelector('.who-overlay');
const whoPage = document.querySelector('.who-page');
const introText = document.querySelector('.intro-text-wrapper');
const catPath = document.querySelector('.intro-page .cat-path');
const catTextPath = document.querySelector('.intro-page .cat-path textPath');
const questions = document.querySelectorAll('.intro-text .paper div');
const introFold = document.querySelector('.intro-text .fold');

const oneLetters = spanifyLetter(questions[0]);
const twoLetters = spanifyLetter(questions[1]);
const threeLetters = spanifyLetter(questions[2]);

const oneWrapper = wrapLetter(questions[0]);
const twoWrapper = wrapLetter(questions[1]);
const threeWrapper = wrapLetter(questions[2]);

let whoWrapperCenter = null, wrapperCenterRect = null;
let introFixed = false;

document.addEventListener('DOMContentLoaded', () => {
    var catTextPS = new PercentScroll(
        introPage, 0.25, 0.5, (percentage) => {
            catTextPath.setAttribute('startOffset', (1-percentage) * 100 + '%');
        }
    );

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) catTextPS.start(); 
        else catTextPS.stop();
    });
    var oneWhyLetters = classifyWhyNots(oneLetters);
    var twoWhyLetters = classifyWhyNots(twoLetters);
    var threeWhyLetters = classifyWhyNots(threeLetters);
    var onePureLetters = pureGlyphs(oneLetters); //Need to include red
    
    var redLetters = findAndClassify(oneLetters, 'red');
    var redLetterClones = [];
    redLetters.forEach(letter => {
        redLetterClones.push(duplicateElement(letter));
    });
    redLetterClones.forEach(letter => {
        letter.classList.add('clone');
    });
        
    var typeLetters = findAndClassify(twoLetters, 'type');
    typeLetters.forEach((letter, index) => {
        letter.style.zIndex = index;
        letter.style.transform = `translateX(${-index * 5 - 1}px) translateY(-10%)`;
    });
    var twoPureLetters = pureGlyphs(twoLetters);
    var dragLetters = findAndClassify(twoLetters, 'drag');
    var colorfulLetters = findAndClassify(twoLetters, 'colorful');
    whoWrapperCenter = colorfulLetters[1]; // the second 'o' in colorful
    colorfulLetters.forEach((letter, index) => {
        letter.style.color = charColors[(3 + index)%4];
    });
    
    var threePureLetters = pureGlyphs(threeLetters);
    var downLetters = findAndClassify(threeLetters, 'down');
    //var moreLetters = findAndClassify(threeLetters, 'more');

    //var oneQuestion = classifyQuestion(oneLetters);
    //var twoQuestion = classifyQuestion(twoLetters);
    //var threeQuestion = classifyQuestion(threeLetters);

    var introTextAnime = anime.timeline({
        autoplay: false,
    });

    //'red' = 3, 'colorful' = 7, 'down' = 4, 'type' = 4, 'drag' = 4, 'more' = 4
    var onePureDuration = totalStaggerDuration(onePureLetters.length + 3, 1000, 50, 0);
    var twoPureDuration = totalStaggerDuration(twoPureLetters.length, 1000, 50, 0);
    var threePureDuration = totalStaggerDuration(threePureLetters.length, 1000, 50, 0);

    introTextAnime
    .add({ //First line
        targets: onePureLetters,
        translateY: ['100%', 0],
        opacity: [0, 1],
        rotate: function(el) {
            if (el.classList.contains('red')) return ['45deg', 0];
            else return [anime.random(-45, 45) + 'deg', 0];
        },
        delay: anime.stagger(50, {start: 0}),
        easing: 'linear',
    })
    .add({ //The red clones to match original
        targets: redLetterClones,
        translateY: ['100%', 0],
        opacity: [0, 1],
        rotate: ['45deg', 0],
        delay: anime.stagger(50, {start: 0}),
        easing: 'linear',
    }, "seewhatthat".length * 50)
    .add({ //Show red part of the letters
        targets: redLetterClones,
        clipPath: ['polygon(0 0, 100% 0, 100% 0%, 0 0%)', 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'],
        duration: 4000,
        easing: 'linear',
    }, "seewhatthattri".length * 50 + 1000)
    .add({ //Hide white part of the letters
        targets: redLetters,
        clipPath: ['polygon(0 0, 100% 0, 100% 100%, 0 100%)', 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)'],
        duration: 4000,
        easing: 'linear',
    }, "seewhatthattri".length * 50 + 1000)
    .add({ //Second line
        targets: twoPureLetters,
        translateY: ['100%', 0],
        opacity: [0, 1],
        rotate: function(el) {
            if (el.classList.contains('red')) return ['45deg', 0];
            else return [anime.random(-45, 45) + 'deg', 0];
        },
        delay: anime.stagger(50, {start: 0}),
        easing: 'linear',
    }, onePureDuration)
    .add({ //Third line
        targets: threePureLetters,
        translateY: ['100%', 0],
        opacity: [0, 1],
        rotate: function(el) {
            if (el.classList.contains('red')) return ['45deg', 0];
            else return [anime.random(-45, 45) + 'deg', 0];
        },
        delay: anime.stagger(50, {start: 0}),
        easing: 'linear',
    }, onePureDuration + twoPureDuration)
    .add({ //Typing letters
        targets: typeLetters,
        opacity: 1,
        duration: 1,
        delay: anime.stagger(350, {start: 0, easing: `steps(${typeLetters.length})`}),
    }, onePureDuration)
    .add({ //'d' in drag
        targets: dragLetters[0],
        translateX: '-60%',
        translateY: '-40%',
        duration: 500,
        easing: 'linear',
    }, onePureDuration + twoPureDuration)
    .add({ //'r' in drag
        targets: dragLetters[1],
        translateX: '-100%',
        translateY: '30%',
        duration: 400,
        easing: 'linear',
    }, onePureDuration + twoPureDuration + 400)
    .add({ //'a' in drag
        targets: dragLetters[2],
        translateY: '-50%',
        translateX: '-30%',
        duration: 400,
        easing: 'linear',
    }, onePureDuration + twoPureDuration + 400 * 2)
    .add({ // 'g' in drag
        targets: dragLetters[3],
        translateX: '-40%',
        translateY: '20%',
        duration: 400,
        easing: 'linear',
    }, onePureDuration + twoPureDuration + 400 * 3)
    .add({ // down letters
        targets: downLetters,
        translateY: '275%',
        duration: 600,
        delay: anime.stagger(100, {start: 0}),
        easing: 'linear',
    }, onePureDuration + twoPureDuration + 2000)
    .add({
        targets: twoWhyLetters,
        translateY: ['-90%', 0],
        duration: twoPureDuration,
        easing: 'linear',
    }, onePureDuration)
    .add({
        targets: threeWhyLetters,
        keyframes: [
            {translateY: ['-210%', '-110%'], duration: twoPureDuration, easing: 'linear'},
            {translateY: ['-110%', 0], duration: threePureDuration, easing: 'linear'},
        ],
        easing: 'linear',
    }, onePureDuration);

    followColorful();
    var introTextAS = new AnimeScroll(introPage, 0.25, 0.5, introTextAnime, () => {
        followColorful();
        introFold.style.pointerEvents = 'none';
        window.addEventListener('resize', followColorful);
    }, () => {
        introFold.style.pointerEvents = 'auto';
        window.removeEventListener('resize', followColorful);
    });
    introTextAnime.seek(0);

    var introWhoAnime = anime({
        targets: whoOverlay,
        clipPath:[
            'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
            'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
        ],
        easing: 'easeInExpo',
        autoplay: false,
    });
    introWhoAnime.seek(0);
    var introWhoAS = new AnimeScroll(introPage, 0.5, 0.7, introWhoAnime);

    var tunnels = document.querySelectorAll('.who-background .tunnel-wrapper');
    var toCopy = [];
    tunnels.forEach(tunnel => {
        if (tunnel.parentNode.classList.contains('transition')) return;
        toCopy.push(tunnel);
    })
    //There will be 2 tunnels. Copy twice to cover all background.
    copyTunnels(toCopy);
    copyTunnels(toCopy);

    const whoTransition = document.querySelectorAll('.who-background.transition .tunnel-wrapper');
    const whoTransitionAnime = anime({
        targets: whoTransition,
        clipPath: [
            'polygon(0 0, 0 0, 0 100%, 0% 100%)',
            'polygon(100% 0, 0 0, 0 100%, 100% 100%)'
        ],
        easing: 'easeOutQuart',
        duration: 400,
        delay: anime.stagger(100, {start: 0}),
        autoplay: false,
    });
    const whoTransitionAS = new AnimeScroll(introPage, 0.7, 1, whoTransitionAnime);

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) {
            introTextAS.start();
            introWhoAS.start();
            whoTransitionAS.start();
        } else {
            introTextAS.stop();
            introWhoAS.stop();
            whoTransitionAS.stop();
        }
    });

    var introTextTS = new TriggerScroll(introPage, 0, 1, () => {
        if (introFixed) { //At the top
            releaseIntroText();
            putIntroTextTop();
        } else fixIntroText();
        introFixed = !introFixed;
    }, () => {
        if (introFixed) { //At the bottom
            releaseIntroText();
            putIntroTextBot();
        } else {
            fixIntroText();
            followColorful();
        }
        introFixed = !introFixed;
    });
    var foldShowTS = new SimpleTriggerScroll(introPage, 0.25, () => {
        introFold.classList.add('show');
    }, () => {
        introFold.classList.remove('show');
    });

    document.addEventListener('introTextIntersection', () => {
        if (introTextIntersecting) {
            introTextTS.start();
            foldShowTS.start();
        } else {
            introTextTS.stop();
            foldShowTS.stop();
        }
    });
});

function copyTunnels(tunnels) {
    tunnels.forEach(tunnel => {
        tunnel.parentNode.appendChild(tunnel.cloneNode(true));
    });
}

function followColorful() {
    wrapperCenterRect = whoWrapperCenter.getBoundingClientRect();
    setWhoWrapperPosition(wrapperCenterRect.left + wrapperCenterRect.width / 2, 
                        wrapperCenterRect.top + wrapperCenterRect.height / 2);
}

function setWhoWrapperPosition(x, y) {
    whoOverlay.style.left = x - whoOverlay.clientWidth/2 + 'px';
    whoOverlay.style.top = y - whoOverlay.clientHeight/2 + 'px';
}

function fixIntroText() {
    catPath.style.top = 0;
    introText.style.top = 0;
    whoPage.style.top = 0;
    catPath.style.position = 'fixed';
    introText.style.position = 'fixed';
    whoOverlay.style.position = 'fixed';
    whoPage.style.position = 'fixed';
    window.removeEventListener('resize', fixToBot);
}

function releaseIntroText() {
    catPath.style.position = 'absolute';
    introText.style.position = 'absolute';
    whoOverlay.style.position = 'absolute';
    whoPage.style.position = 'absolute';
}

function putIntroTextTop() {
    catPath.style.top = 0;
    introText.style.top = 0;
    whoOverlay.style.top = 0;
    whoPage.style.top = 0;
}

function putIntroTextBot() {
    //third-page is 500vh
    //Every elemenit is 100vh tall
    catPath.style.top = '400vh';
    introText.style.top = '400vh';
    //whoOverlay is fixed to the colorful 'o', followColorful() will handle it
    /* whoOverlay.style.top = '700vh'; */
    //whoPage is relative to whoOverlay
    fixToBot();
    window.addEventListener('resize', fixToBot);
}

function fixToBot() {
    whoOverlay.style.top = 0;
    whoOverlay.style.left = 0;
    whoPage.style.top = '400vh';
}

function classifyWhyNots(letters) {
    var whyWords = findWord(letters, 'Why');
    var notWords = findWord(letters, 'not');
    var results = [];
    whyWords.forEach(word => {
        classifyLetters(word, 'why-not').forEach(letter => {
            results.push(letter);
            letter.parentNode.classList.add('why-not');
        });
    });
    notWords.forEach(word => {
        classifyLetters(word, 'why-not').forEach(letter => {
            results.push(letter);
            letter.parentNode.classList.add('why-not');
        });
    });
    return results;
}

function classifyQuestion(letters) {
    var questionWords = findWord(letters, '?');
    var results = [];
    questionWords.forEach(word => {
        classifyLetters(word, 'question').forEach(letter => {
            results.push(letter);
            letter.parentNode.classList.add('question');
        });
    });
    return results;
}

function findAndClassify(letters, className) {
    var words = findWord(letters, className);
    var results = []
    words.forEach(word => {
        classifyLetters(word, className).forEach(letter => {
            results.push(letter);
            letter.parentNode.classList.add(className);
        });
    });
    return results;
}