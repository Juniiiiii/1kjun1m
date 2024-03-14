function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomElement(array) {
    return array[randomInt(0, array.length - 1)];
}

function remToPx(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function isHovering(position, element) {
    var rect = element.getBoundingClientRect();
    return (
        rect.top <= position.y &&
        rect.bottom >= position.y &&
        rect.left <= position.x &&
        rect.right >= position.x
    );
}
