function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

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
    mousePosition = { x: e.offsetX, y: e.offsetY };
});

function getTextWidth(text, font) {
    const context = document.createElement('canvas').getContext('2d');
    context.font = font;
    return metrics = context.measureText(text).width;
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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

        this.topTriggered = false;
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

        if ((!this.topTriggered && 0 > this.lower) || (this.topTriggered && 0 <= this.lower)) {
            this.topTriggered = !this.topTriggered;
            this.fromTopCallback();
        } else if ((!this.botTriggered && window.innerHeight > this.upper) || (this.botTriggered && window.innerHeight <= this.upper)) {
            this.botTriggered = !this.botTriggered;
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

        window.addEventListener('scroll', this.update);
        window.addEventListener('resize', this.update);
    }

    update() {
        this.rect = this.element.getBoundingClientRect();

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;

        this.callBack(Common.clamp((window.innerHeight - this.lower) / (this.upper - this.lower), 0, 1));
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;

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

        window.addEventListener('scroll', this.update.bind(this));
        window.addEventListener('resize', this.update.bind(this));
    }

    updateRange() {
        this.rect = this.element.getBoundingClientRect();

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;
    }

    update() {
        this.rect = this.element.getBoundingClientRect();

        this.lower = this.rect.top + this.rect.height * this.from;
        this.upper = this.rect.bottom - this.rect.height * this.to;

        this.prev = this.target;
        this.target = Common.clamp((window.innerHeight - this.lower) / (this.upper - this.lower), 0, 1);

        this.anime.seek(this.target * this.anime.duration);

        if (this.target == 1 && this.prev != 1 && this.complete) this.complete();
        else if (this.prev == 1 && this.target != 1 && this.uncomplete) this.uncomplete();
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;

        window.removeEventListener('scroll', this.update);
        window.removeEventListener('resize', this.update);

        this.anime.seek(0);
    }
}
