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

function isIntersecting(element1, element2) {
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    // Check for intersection
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

//Returns the aspect ratio of a polygon using its bounding box
function aspectRatio(vertices) {
    var minX = Infinity;
    var minY = Infinity;
    var maxX = -Infinity;
    var maxY = -Infinity;

    vertices.forEach(vertex => {
        minX = Math.min(minX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxX = Math.max(maxX, vertex.x);
        maxY = Math.max(maxY, vertex.y);
    });

    return (maxX - minX)/(maxY - minY);
}

function isDigit(char) {
    return /^\d$/.test(char);
}

function isUpper(char) {
    return /^[A-Z]$/.test(char);
}

function isLower(char) {
    return /^[a-z]$/.test(char);
}

function isLetter(char) {
    return isUpper(char) || isLower(char);
}