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
            startUpdatingTarget();
            updateAboutTarget();
            startAboutInterval();
        }
        else {
            stopUpdatingTarget();
        }
    });
});

function updateRevealRange() {
    aboutRevealRange = [aboutBody.getBoundingClientRect().top + window.scrollY, 
                        aboutBodyWrapper.getBoundingClientRect().bottom + window.scrollY];
}

function startUpdatingTarget() {
    if (aboutIsUpdating) return;
    aboutIsUpdating = true;

    window.addEventListener('resize', updateRevealRange);
    window.addEventListener('scroll', updateRevealRange);

    window.addEventListener('scroll', updateAboutTarget);
    window.addEventListener('resize', updateAboutTarget);
}

function updateAboutTarget() {
    aboutTarget = clamp((window.scrollY + window.innerHeight - aboutRevealRange[0]) / (aboutRevealRange[1] - aboutRevealRange[0]), 0, 1);
    if (aboutCurrent != aboutTarget && aboutInterval == null) startAboutInterval();
}

function stopUpdatingTarget() {
    if (!aboutIsUpdating) return;
    aboutIsUpdating = false;

    window.removeEventListener('resize', updateRevealRange);
    window.removeEventListener('scroll', updateRevealRange);

    window.removeEventListener('scroll', updateAboutTarget);
    window.removeEventListener('resize', updateAboutTarget);
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
