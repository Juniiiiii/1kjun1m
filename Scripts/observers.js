let firstIntersecting = false;
let landingIntersecting = false;
let ideaIntersecting = false;
let ideaEndIntersecting = false;
let introIntersecting = false;
let languageIntersecting = false;
let strengthsIntersecting = false;
let hobbiesIntersecting = false;
let introTextIntersecting = false;

const firstIntersection = new Event('firstIntersection');
const landingIntersection = new Event('landingIntersection');
const ideaIntersection = new Event('ideaIntersection');
const ideaEndIntersection = new Event('ideaEndIntersection');
const introIntersection = new Event('introIntersection');
const languageIntersection = new Event('languageIntersection');
const strengthsIntersection = new Event('strengthsIntersection');
const hobbiesIntersection = new Event('hobbiesIntersection');
const introTextIntersection = new Event('introTextIntersection');

let firstObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        firstIntersecting = entry.isIntersecting;
        document.dispatchEvent(firstIntersection);
    });
});
firstObserver.observe(document.querySelector('.first-page'));
let landingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        landingIntersecting = entry.isIntersecting;
        document.dispatchEvent(landingIntersection);
    });
});
landingObserver.observe(document.querySelector('.landing-page'));

let ideaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        ideaIntersecting = entry.isIntersecting;
        document.dispatchEvent(ideaIntersection);
    });
});
ideaObserver.observe(document.querySelector('.idea-page'));

let ideaEndObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        ideaEndIntersecting = entry.isIntersecting;
        document.dispatchEvent(ideaEndIntersection);
    });
}, {
    threshold: 0.7
});
ideaEndObserver.observe(document.querySelector('.idea-page'));

let introObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        introIntersecting = entry.isIntersecting;
        document.dispatchEvent(introIntersection);
    });
}, {
    threshold: 0.1
});
introObserver.observe(document.querySelector('.intro-page'));