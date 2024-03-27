const languageWrapper = document.querySelector('.second-page .language-wrapper');
const languageBackground = languageWrapper.querySelector('.background');
const languageList = document.querySelector('.second-page .language-wrapper .list-wrapper .list');
const languageListItems = languageList.querySelectorAll('p');
const languageOverlay = document.querySelector('.second-page .language-wrapper .overlay');
let languageScroll;

const strengthsWrapper = document.querySelector('.second-page .strengths-wrapper');
const strengths = strengthsWrapper.querySelectorAll('.strengths');
const strengthsList = document.querySelector('.second-page .strengths-wrapper .list-wrapper .list');
const strengthsListItems = strengthsList.querySelectorAll('p');
const strengthsOverlay = document.querySelector('.second-page .strengths-wrapper .overlay');
let strengthsScroll;

const hobbiesWrapper = document.querySelector('.second-page .hobbies-wrapper');
const hobbiesBackground = hobbiesWrapper.querySelector('.background');
const hobbiesList = document.querySelector('.second-page .hobbies-wrapper .list-wrapper .list');
const hobbiesListItems = hobbiesList.querySelectorAll('p');
const hobbiesOverlay = document.querySelector('.second-page .hobbies-wrapper .overlay');
let hobbiesScroll;

document.addEventListener('DOMContentLoaded', () => {
    languageAnime();
    strengthsAnime();
    hobbiesAnime();
});

function hobbiesAnime() {
    var hobbiesTimeline = anime.timeline({
        autoplay: false,
    });

    hobbiesTimeline.add({
        targets: hobbiesBackground,
        width: ['0%', '100%'],
        easing: 'linear',
        duration: 1000,
    }).add({
        targets: hobbiesList,
        keyframes: [
            {clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            {clipPath: 'polygon(100% -10000%, 0 -10000%, 0 10000%, 100% 10000%)' },
        ],
        easing: 'linear',
        duration: 1000,
    });

    hobbiesScroll = new AnimeScroll(
        hobbiesTimeline, hobbiesWrapper, 0, 0.3,
        () => {
            hobbiesOverlay.classList.add('show-fold');
        },
        () => {
            hobbiesOverlay.classList.remove('show-fold');
        }
    );

    var overlayAnime = anime.timeline({autoplay: false});

    overlayAnime.add({
        targets: hobbiesListItems,
        translateY: function(el, index) {
            return index%2 == 0 ? '-200%' : '200%';
        },
        scale: 2,
        delay: anime.stagger(50, {start: 0, easing: 'linear'}),
    }, 0).add({
        targets: hobbiesList,
        backgroundColor: blue,
        easing: 'easeOutQuad',
        duration: 1000,
    }, 0)

    overlayAnime.reverse();

    hobbiesOverlay.addEventListener('mouseover', () => {
        hobbiesList.style.clipPath = 'none';
        overlayAnime.reverse();
        overlayAnime.play();
    });

    hobbiesOverlay.addEventListener('mouseout', () => {
        hobbiesList.style.clipPath = 'polygon(100% -10000%, 0 -10000%, 0 10000%, 100% 10000%)';
        overlayAnime.reverse();
        overlayAnime.play();
    });

    document.addEventListener('hobbiesIntersection', () => {
        if (hobbiesIntersecting) hobbiesScroll.start();
        else hobbiesScroll.stop();
    });
}

function strengthsAnime() {
    var strengthsTimeline = anime.timeline({
        autoplay: false,
    });

    strengthsTimeline.add({
        targets: strengths,
        keyframes: [
            {clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'},
            {clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'},
        ],
        easing: 'linear',
        duration: 1000,
    }).add({
        targets: strengthsList,
        keyframes: [
            {clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'},
            {clipPath: 'polygon(100% -10000%, 0 -10000%, 0 10000%, 100% 10000%)'},
        ],
        easing: 'linear',
        duration: 1000,
    });

    strengthsScroll = new AnimeScroll(
        strengthsTimeline, strengthsWrapper, 0, 0.3,
        () => {
            strengthsOverlay.classList.add('show-fold');
        },
        () => {
            strengthsOverlay.classList.remove('show-fold');
        }
    );

    var overlayAnime = anime.timeline({autoplay: false});

    overlayAnime.add({
        targets: strengthsListItems,
        translateY: function(el, index) {
            return index%2 == 0 ? '-200%' : '200%';
        },
        scale: 2.1,
        delay: anime.stagger(50, {start: 0, easing: 'linear'}),
    }, 0).add({
        targets: strengthsList,
        backgroundColor: yellow,
        easing: 'easeOutQuad',
        duration: 1000,
    }, 0)

    overlayAnime.reverse();

    strengthsOverlay.addEventListener('mouseover', () => {
        strengthsList.style.clipPath = 'none';
        overlayAnime.reverse();
        overlayAnime.play();
    });

    strengthsOverlay.addEventListener('mouseout', () => {
        strengthsList.style.clipPath = 'polygon(100% -10000%, 0 -10000%, 0 10000%, 100% 10000%)';
        overlayAnime.reverse();
        overlayAnime.play();
    });

    document.addEventListener('strengthsIntersection', () => {
        if (strengthsIntersecting) strengthsScroll.start();
        else strengthsScroll.stop();
    });
}

function languageAnime() {
    var languageTimeline = anime.timeline({
        autoplay: false,
    });

    languageTimeline.add({
        targets: languageBackground,
        width: ['0%', '100%'],
        easing: 'linear',
        duration: 1000,
    }).add({
        targets: languageList,
        keyframes: [
            {clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
            {clipPath: 'polygon(100% -10000%, 0 -10000%, 0 10000%, 100% 10000%)' },
        ],
        easing: 'linear',
        duration: 1000,
    });

    languageScroll = new AnimeScroll(
        languageTimeline, languageWrapper, 0, 0.3, 
        () => {
            languageOverlay.classList.add('show-fold');
        },
        () => {
            languageOverlay.classList.remove('show-fold');
        }
    );

    var overlayAnime = anime.timeline({autoplay: false});

    overlayAnime.add({
        targets: languageListItems,
        translateY: function(el, index) {
            return index%2 == 0 ? '-200%' : '200%';
        },
        scale: 2.5,
        delay: anime.stagger(50, {start: 0, easing: 'linear'}),
    }, 0).add({
        targets: languageList,
        backgroundColor: red,
        easing: 'easeOutQuad',
        duration: 1000,
    }, 0)

    overlayAnime.reverse();

    languageOverlay.addEventListener('mouseover', () => {
        languageList.style.clipPath = 'none';
        overlayAnime.reverse();
        overlayAnime.play();
    });

    languageOverlay.addEventListener('mouseout', () => {
        languageList.style.clipPath = 'polygon(100% -10000%, 0 -10000%, 0 10000%, 100% 10000%)';
        overlayAnime.reverse();
        overlayAnime.play();
    });

    document.addEventListener('languageIntersection', () => {
        if (languageIntersecting) languageScroll.start();
        else languageScroll.stop();
    });
}
