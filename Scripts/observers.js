let firstIntersecting = false;
let landingIntersecting = false;
let ideaIntersecting = false;
let ideaHalfIntersecting = false;
let aboutIntersecting = false;
let languageIntersecting = false;
let strengthsIntersecting = false;
let hobbiesIntersecting = false

const firstIntersection = new Event('firstIntersection');
const landingIntersection = new Event('landingIntersection');
const ideaIntersection = new Event('ideaIntersection');
const ideaHalfIntersection = new Event('ideaHalfIntersection');
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

let ideaHalfObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        ideaHalfIntersecting = entry.isIntersecting;
        document.dispatchEvent(ideaHalfIntersection);
    });
}, {
    threshold: 0.5
});
ideaHalfObserver.observe(document.querySelector('.idea-page'));

let aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        aboutIntersecting = entry.isIntersecting;
        document.dispatchEvent(aboutIntersection);
    });
});
aboutObserver.observe(document.querySelector('.about-page'));

let languageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        languageIntersecting = entry.isIntersecting;
        document.dispatchEvent(languageIntersection);
    });
});
languageObserver.observe(document.querySelector('.language-wrapper'));

let strengthsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        strengthsIntersecting = entry.isIntersecting;
        document.dispatchEvent(strengthsIntersection);
    });
});
strengthsObserver.observe(document.querySelector('.strengths-wrapper'));

let hobbiesObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        hobbiesIntersecting = entry.isIntersecting;
        document.dispatchEvent(hobbiesIntersection);
    });
});
hobbiesObserver.observe(document.querySelector('.hobbies-wrapper'));
