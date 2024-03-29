const introPage = document.querySelector('.intro-page');
const introText = document.querySelector('.intro-text-wrapper');
const catPath = document.querySelector('.intro-page .cat-path');
const catTextPath = document.querySelector('.intro-page .cat-path textPath');
const questions = document.querySelectorAll('.intro-text .paper div');

const oneLetters = spanifyLetter(questions[0]);
const twoLetters = spanifyLetter(questions[1]);
const threeLetters = spanifyLetter(questions[2]);

const oneWrapper = wrapLetter(questions[0]);
const twoWrapper = wrapLetter(questions[1]);
const threeWrapper = wrapLetter(questions[2]);

const colorOffset = randomInt(0, charColors.length);

document.addEventListener('DOMContentLoaded', () => {
    var catTextPS = new PercentScroll(
        introPage, 0.25, 0.7, (percentage) => {
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
    var colorfulPS = new PercentScroll(
        introPage, 0.3, 1, (percentage) => {
            colorfulLetters.forEach((letter, index) => {
                letter.style.color = charColors[(colorOffset + index + Math.floor(percentage * 20))%4];
            });
        }
    );

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) colorfulPS.start();
        else colorfulPS.stop();
    });
    
    var threePureLetters = pureGlyphs(threeLetters);
    var downLetters = findAndClassify(threeLetters, 'down');
    var moreLetters = findAndClassify(threeLetters, 'more');

    var oneQuestion = classifyQuestion(oneLetters);
    var twoQuestion = classifyQuestion(twoLetters);
    var threeQuestion = classifyQuestion(threeLetters);

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
        translateY: '80%',
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

    var introTextAS = new AnimeScroll(introPage, 0.25, 0.7, introTextAnime);
    introTextAnime.seek(0);

    document.addEventListener('introIntersection', () => {
        if (introIntersecting) introTextAS.start();
        else introTextAS.stop();
    });

    var introTextTS = new TriggerScroll(introText, 1, fixIntroText, releaseIntroText);

    document.addEventListener('introTextIntersection', () => {
        if (introTextIntersecting) introTextTS.start();
        else introTextTS.stop();
    });
});

function fixIntroText() {
    catPath.style.position = 'fixed';
    introText.style.position = 'fixed';
}

function releaseIntroText() {
    catPath.style.position = 'absolute';
    introText.style.position = 'absolute';
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