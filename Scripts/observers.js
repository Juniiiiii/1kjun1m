let firstIntersecting = false;
let landingIntersecting = false;
let ideaIntersecting = false;
let ideaEndIntersecting = false;
let aboutIntersecting = false;
let languageIntersecting = false;
let strengthsIntersecting = false;
let hobbiesIntersecting = false

const firstIntersection = new Event('firstIntersection');
const landingIntersection = new Event('landingIntersection');
const ideaIntersection = new Event('ideaIntersection');
const ideaEndIntersection = new Event('ideaEndIntersection');
const aboutIntersection = new Event('aboutIntersection');
const languageIntersection = new Event('languageIntersection');
const strengthsIntersection = new Event('strengthsIntersection');
const hobbiesIntersection = new Event('hobbiesIntersection');

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
    threshold: 0.95
});
ideaEndObserver.observe(document.querySelector('.idea-page'));

let aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        aboutIntersecting = entry.isIntersecting;
        document.dispatchEvent(aboutIntersection);
    });
}, {
    threshold: 0.2
});
aboutObserver.observe(document.querySelector('.about-page'));