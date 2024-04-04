let firstIntersecting = false;
let ideaEndIntersecting = false;
let introIntersecting = false;

const firstIntersection = new Event('firstIntersection');
const ideaEndIntersection = new Event('ideaEndIntersection');
const introIntersection = new Event('introIntersection');

let firstObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        firstIntersecting = entry.isIntersecting;
        document.dispatchEvent(firstIntersection);
    });
});
firstObserver.observe(document.querySelector('.first-page'));

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