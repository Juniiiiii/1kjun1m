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

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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

function spanifyLetter(element) {
    let textContent = element.textContent.trim().split("");

    let newText = "";

    textContent.forEach(letter => {
        newText += (letter.trim() === "") ? "<span class='letter'>&nbsp;</span>" : "<span class='letter'>" + letter + "</span>";
    });

    element.innerHTML = newText;

    return element.querySelectorAll('.letter');
}

function spanifyWord(element) {
    let words = element.textContent.trim().split(/\s+/);

    let newContent = "";

    words.forEach(word => {
        newContent += "<span class='word'>" + word + "</span> ";
    });

    element.innerHTML = newContent.trim();

    return element.querySelectorAll('.word');
}

let mousePosition = { x: 0, y : 0};
window.addEventListener('mousemove', function(e) {
    mousePosition = { x: e.clientX, y: e.clientY };
});

let scrollDown = true;
var lastScrollTop = 0;

window.addEventListener("scroll", function(){
    var st = window.scrollY || document.documentElement.scrollTop;
    if (st > lastScrollTop) scrollDown = true;
    else if (st < lastScrollTop) scrollDown = false;
    lastScrollTop = st <= 0 ? 0 : st;
}, false);

function getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

function setAbsolute(element) {
    const rect = element.getBoundingClientRect();

    element.style.position = 'absolute';

    element.style.left = rect.left + window.scrollX + 'px';
    element.style.top = rect.top + window.scrollY + 'px';

    element.style.width = rect.width + 'px';
    element.style.height = rect.height + 'px';

    element.style.zIndex = 1000;

    return rect;
}

function extractDecmial(string) {
    return parseFloat(string.match(/[-+]?[0-9]*\.?[0-9]+/));
}

function oneZero(num) {
    if (num == 0) return 1;
    else return 0;
}