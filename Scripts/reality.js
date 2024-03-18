const realityText = document.querySelector('.reality-text');
const realityTextWrapper = document.querySelector('#reality-text-wrapper');
let realityLetters = [];
let realityTextWithinView = false;

document.addEventListener('DOMContentLoaded', () => {
    realityText.querySelectorAll('div').forEach((div, index) => {
        spanifyLetter(div).forEach(letter => {
            realityLetters.push(letter);
        });
        div.setAttribute('reality-text-number', index);
    });

    for (var i = 0 ; i < realityLetters.length; i++) {
        var word = [];
        while (i < realityLetters.length && realityLetters[i].textContent.trim() !== "") {
            word.push(realityLetters[i]);
            i++;
        }
        realityWordManager.words.push(new RealityWord(word));
    }

    window.addEventListener('scroll', function() {
        if (realityTextWithinView) realityWordManager.setOpacities(window.scrollY + window.innerHeight);
    });

    var realityTextObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            realityTextWithinView = entry.isIntersecting;
            if (realityTextWithinView) realityWordManager.startAnimation();
            else realityWordManager.stopAnimation();
        });
    });

    realityTextObserver.observe(realityText);
});

class RealityWordManager {
    constructor(triggerMin, triggerMax) {
        this.words = [];

        this.min = triggerMin;
        this.max = triggerMax;

        this.target = 0;
        this.current = 0;

        this.animationId = null;
    }

    setOpacities(scrollY) {
        this.target = Math.floor((scrollY - this.min) / (this.max - this.min) * (this.words.length + 1));
    }
    
    startAnimation() {
        if (this.animationId != null) clearInterval(this.animationId);
        this.animationId = setInterval(() => {
            if (this.current != this.target) {
                if (this.current < this.target) {
                    this.words[this.current].show();
                    this.current = Math.min(this.current + 1, this.words.length - 1);
                }
                else {
                    this.words[this.current].hide();
                    this.current = Math.max(this.current - 1, 0);
                }
            }
        }, 25);
    }

    stopAnimation() {
        clearInterval(this.animationId);
        this.animationId = setInterval(() => {
            if (this.current != this.target) {
                if (this.current < this.target) {
                    this.words[this.current].show();
                    this.current = Math.min(this.current + 1, this.words.length - 1);
                }
                else {
                    this.words[this.current].hide();
                    this.current = Math.max(this.current - 1, 0);
                }
            } else {
                clearInterval(this.animationId);
                this.animationId = null;
            }
        }, 50);
    }
}
let realityWordManager = new RealityWordManager(realityText.getBoundingClientRect().top * 1.05 + window.scrollY, 
                                                realityTextWrapper.getBoundingClientRect().bottom + window.scrollY);

class RealityWord {
    constructor(letters) {
        this.letters = letters;
    }

    show() {
        this.letters.forEach(letter => {
            letter.classList.add('show');
        });
    }

    hide() {
        this.letters.forEach(letter => {
            letter.classList.remove('show');
        });
    }
}

class RealityOpacityEffect {
    constructor(element, letters) {
        this.element = element;
        this.letters = letters;
        this.delay = 20;

        this.cur = 0;
        this.max = this.letters.length;

        this.interval = null;
    }

    progress() {
        if (this.interval != null) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.interval = setInterval(() => {
            if (this.cur < this.max) {
                this.letters[this.cur].classList.add('show');
                this.cur++;
            } else {
                clearInterval(this.interval);
                this.interval = null;
            }
        }, this.delay);
    }

    reverse() {
        if (this.interval != null) {
            clearInterval(this.interval);
            this.interval = null;
        }

        this.interval = setInterval(() => {
            if (this.cur > 0) {
                this.cur--;
                this.letters[this.cur].classList.remove('show');
            } else {
                clearInterval(this.interval);
                this.interval = null;
            }
        }, this.delay);
    }
}



