let landingIntersecting = false;
let ideaIntersecting = false;
let ideaHalfIntersecting = false;
let aboutIntersecting = false;

const landingIntersection = new Event('landingIntersection');
const ideaIntersection = new Event('ideaIntersection');
const ideaHalfIntersection = new Event('ideaHalfIntersection');
const aboutIntersection = new Event('aboutIntersection');

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

/* let aboutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        aboutIntersecting = entry.isIntersecting;
        document.dispatchEvent(aboutIntersection);
    });
});
aboutObserver.observe(document.querySelector('.about-page')); */