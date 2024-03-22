const aboutBody = document.querySelector('.about-page .body');
const aboutLines = document.querySelectorAll('.about-page .body > div');
const aboutBodyWrapper = document.querySelector('.about-page .body-wrapper');
let aboutWords = [], aboutRevealRange = [aboutBody.getBoundingClientRect().top, aboutBodyWrapper.getBoundingClientRect().bottom];
let aboutAnimation, aboutCurrent = 0, aboutTarget = 0, aboutMinSpeed = 0.0005,
aboutSpeed = 0.03, aboutTick = 10, aboutInterval = null, aboutIsUpdating = false;

document.addEventListener('DOMContentLoaded', () => {
    aboutLines.forEach(line => {
        spanifyWord(line).forEach(word => {
            aboutWords.push(word);
        })
    });

    aboutAnimation = anime({
        targets: aboutWords,
        translateY: ['50%', 0],
        opacity: [0, 1],
        easing: 'easeOutExpo',
        delay: anime.stagger(100, {start: 500, easing: 'linear'}),
        autoplay: false,
    });

    document.addEventListener('aboutIntersection', () => {
        if (aboutIntersecting) {
            startAboutUpdate();
            aboutUpdate();
            startAboutInterval();
        }
        else stopAboutUpdate();
    });
});

function updateAboutRange() {
    aboutRevealRange = [aboutBody.getBoundingClientRect().top + window.scrollY, 
                        aboutBodyWrapper.getBoundingClientRect().bottom + window.scrollY];
}

function startAboutUpdate() {
    if (aboutIsUpdating) return;
    aboutIsUpdating = true;

    window.addEventListener('resize', updateAboutRange);
    window.addEventListener('scroll', updateAboutRange);

    window.addEventListener('scroll', aboutUpdate);
    window.addEventListener('resize', aboutUpdate);
}

function aboutUpdate() {
    aboutTarget = clamp((window.scrollY + window.innerHeight - aboutRevealRange[0]) / (aboutRevealRange[1] - aboutRevealRange[0]), 0, 1);
    if (aboutCurrent != aboutTarget && aboutInterval == null) startAboutInterval();
}

function stopAboutUpdate() {
    if (!aboutIsUpdating) return;
    aboutIsUpdating = false;

    window.removeEventListener('resize', updateAboutRange);
    window.removeEventListener('scroll', updateAboutRange);

    window.removeEventListener('scroll', aboutUpdate);
    window.removeEventListener('resize', aboutUpdate);
}

function startAboutInterval() {
    aboutInterval = setInterval(() => {
        if (aboutCurrent < aboutTarget) {
            aboutCurrent += Math.max((aboutTarget - aboutCurrent) * aboutSpeed, aboutMinSpeed);
            if (aboutCurrent > aboutTarget) aboutCurrent = aboutTarget;
        } else if (aboutCurrent > aboutTarget) {
            aboutCurrent -= Math.max((aboutCurrent - aboutTarget) * aboutSpeed, aboutMinSpeed);
            if (aboutCurrent < aboutTarget) aboutCurrent = aboutTarget;
        }
        progressAboutWords(aboutCurrent);
        if (aboutCurrent == aboutTarget) {
            clearInterval(aboutInterval);
            aboutInterval = null;
        }
    }, aboutTick);
}

function progressAboutWords(percentage) {
    aboutAnimation.seek(aboutAnimation.duration * percentage);
}
