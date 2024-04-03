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

function scrolledPast(element) {
    var rect = element.getBoundingClientRect();
    return rect.top < 0;
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

function wrapLetter(element) {
    var results = [];
    element.querySelectorAll('.letter').forEach(letter => {
        const div = document.createElement('div');
        div.classList.add('letter-wrapper');
        div.appendChild(letter);
        element.appendChild(div);
    });
    return results;
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

function findWord(letters, word) {
    var i = 0, j = 0, z = 0;
    var results = [];
    while (j < letters.length) {
        while (i < letters.length && letters[i].textContent != word[0]) i++;
        if (i >= letters.length) break;
        j = i + 1;
        z = 1;
        while (j < letters.length && z < word.length && letters[j].textContent == word[z]) {
            j++;
            z++;
        }
        if (z < word.length) {
            i++;
            continue;
        }
        ans = [];
        for (var k = i; k < j; k++) {
            ans.push(letters[k]);
        }
        results.push(ans);
        i++;
    }
    return results;
}

function classifyLetters(letters, className) {
    letters.forEach(letter => {
        letter.classList.add(className);
    });

    return letters;
}

function pureLetters(letters) {
    var results = [];
    letters.forEach(letter => {
        if (letter.classList.length == 1) results.push(letter);
    });
    return results;
}

function pureGlyphs(letters) {
    var results = [];
    letters.forEach(letter => {
        if (letter.classList.length == 1 && letter.textContent.trim() != "") results.push(letter);
    });
    return results;
}

function printLetters(letters) {
    var printString = "";
    letters.forEach(letter => {
        printString += letter.textContent;
    })
    console.log(printString);
}

function duplicateElement(element) {
    var clone = element.cloneNode(true);
    element.parentNode.insertBefore(clone, element);
    return clone;
}

let mousePosition = { x: 0, y : 0};
window.addEventListener('mousemove', function(e) {
    mousePosition = { x: e.offsetX, y: e.offsetY };
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

    //element.style.left = rect.left + 'px';
    //element.style.top = rect.top + 'px';

    element.style.zIndex = 100;

    return rect;
}

function extractDecmial(string) {
    return parseFloat(string.match(/[-+]?[0-9]*\.?[0-9]+/));
}

function oneZero(num) {
    if (num == 0) return 1;
    else return 0;
}

function gaussianRandom(mean=0, stdev=1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    return z * stdev + mean;
}

function boundingBoxOfPoints(arr) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    arr.forEach(point => {
        minX = Math.min(minX, point[0]);
        minY = Math.min(minY, point[1]);
        maxX = Math.max(maxX, point[0]);
        maxY = Math.max(maxY, point[1]);
    });

    return { 
        minX: minX, 
        minY: minY, 
        maxX: maxX, 
        maxY: maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}
  
function rgbToHex(rgb) {
    return "#" + ((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1).toUpperCase();
}

function interpolateColor(rgbA, rgbB, percent) {
    return rgbToHex({
        r: Math.round(rgbA.r * (1 - percent) + rgbB.r * percent),
        g: Math.round(rgbA.g * (1 - percent) + rgbB.g * percent),
        b: Math.round(rgbA.b * (1 - percent) + rgbB.b * percent),
    });
  }

function offsetPoints(arr, row, col) {
    return arr.map(point => [point[0] + row, point[1] + col]);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function firstWordSpan(span) {
    let text = span.textContent.trim().split(/\s+/);
    let newText = "<span class='first-word'>" + text[0] + "</span>";

    span.innerHTML = newText + " " + text.slice(1).join(" ");
    return span.querySelector('.first-word');
}

function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
        var drift = Date.now() - expected;
        if (drift > that.interval) {
            if (errorFunc) errorFunc();
        }
        workFunc();
        expected += that.interval;
        timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

function totalStaggerDuration(targets, duration, delay, start) {
    if (typeof targets === 'number' && Number.isInteger(targets)) return (targets - 1) * delay + start + duration;
    else if (typeof targets === 'object' && targets.length) return (targets.length - 1) * delay + start + duration;
}

class SimpleTriggerScroll {
    constructor(element, trigger, triggedCallback, untriggeredCallback) {
        this.element = element;
        this.rect = element.getBoundingClientRect();

        this.trigger = trigger;
        this.triggerPoint = this.rect.top + this.rect.height * this.trigger + window.scrollY;
        this.triggered = false;

        this.triggedCallback = triggedCallback;
        this.untriggeredCallback = untriggeredCallback;
    }

    start() {
        window.addEventListener('scroll', this.update.bind(this));
        window.addEventListener('resize', this.updateTrigger.bind(this));
    }

    updateTrigger() {
        this.rect = this.element.getBoundingClientRect();
        this.triggerPoint = this.rect.top + this.rect.height * this.trigger + window.scrollY;

        this.update();
    }

    update() {
        if (this.triggerPoint < window.scrollY + window.innerHeight && !this.triggered) {
            this.triggered = true;
            this.triggedCallback();
        } else if (this.triggerPoint >= window.scrollY + window.innerHeight && this.triggered) {
            this.triggered = false;
            this.untriggeredCallback();
        }
    }

    stop() {
        window.removeEventListener('scroll', this.update.bind(this));
        window.removeEventListener('resize', this.update.bind(this));
    }
}

class TriggerScroll {
    constructor(element, from, to, fromTopCallback, toBotCallback) {
        this.element = element;
        this.rect = element.getBoundingClientRect();

        this.from = from;
        this.to = 1 - to;

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;

        this.fromTopCallback = fromTopCallback;
        this.toBotCallback = toBotCallback;

        this.topTriggerd = false;
        this.botTriggered = false;

        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        window.addEventListener('scroll', this.update.bind(this));
        window.addEventListener('resize', this.update.bind(this));
    }

    update() {
        this.rect = this.element.getBoundingClientRect();

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;

        if (!this.topTriggerd && 0 > this.lower) {
            this.topTriggerd = true;
            this.fromTopCallback();
        } else if (this.topTriggerd && 0 <= this.lower) {
            this.topTriggerd = false;
            this.fromTopCallback();
        } else if (!this.botTriggered && window.innerHeight > this.upper) {
            this.botTriggered = true;
            this.toBotCallback();
        } else if (this.botTriggered && window.innerHeight <= this.upper) {
            this.botTriggered = false;
            this.toBotCallback();
        }
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;

        window.removeEventListener('scroll', this.update.bind(this));
        window.removeEventListener('resize', this.update.bind(this));
    }
}

class PercentScroll {
    constructor(element, from, to, callBack) {
        this.element = element;
        this.rect = element.getBoundingClientRect();
        this.callBack = callBack;

        this.from = from;
        this.to = 1 - to;

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;

        this.isRunning = false;

        this.updateRange = this.updateRange.bind(this);
        this.update = this.update.bind(this);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        window.addEventListener('scroll', this.updateRange);
        window.addEventListener('resize', this.updateRange);
        window.addEventListener('scroll', this.update);
        window.addEventListener('resize', this.update);
    }

    updateRange() {
        this.rect = this.element.getBoundingClientRect();

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;
    }

    update() {
        this.callBack(clamp((window.innerHeight - this.lower) / (this.upper - this.lower), 0, 1));
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;

        window.removeEventListener('scroll', this.updateRange);
        window.removeEventListener('resize', this.updateRange);
        window.removeEventListener('scroll', this.update);
        window.removeEventListener('resize', this.update);
    }
}

class AnimeScroll {
    constructor(element, from, to, anime, complete = null, uncomplete = null) {
        this.anime = anime;
        this.element = element;
        this.rect = element.getBoundingClientRect();
        
        this.from = from;
        this.to = 1 - to;
        
        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;

        this.isRunning = false;
        this.target = null;
        this.prev = null;

        this.complete = complete;
        this.uncomplete = uncomplete;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;

        window.addEventListener('scroll', this.updateRange.bind(this));
        window.addEventListener('resize', this.updateRange.bind(this));

        window.addEventListener('scroll', this.update.bind(this));
        window.addEventListener('resize', this.update.bind(this));
    }

    updateRange() {
        this.rect = this.element.getBoundingClientRect();

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;
    }

    update() {
        this.prev = this.target;
        this.target = clamp((window.innerHeight - this.lower) / (this.upper - this.lower), 0, 1);
        this.anime.seek(this.target * this.anime.duration);
        if (this.target == 1 && this.prev != 1 && this.complete) this.complete();
        else if (this.prev == 1 && this.target != 1 && this.uncomplete) this.uncomplete();
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;

        window.removeEventListener('scroll', this.updateRange);
        window.removeEventListener('resize', this.updateRange);

        window.removeEventListener('scroll', this.update);
        window.removeEventListener('resize', this.update);

        this.anime.seek(0);
    }
}
