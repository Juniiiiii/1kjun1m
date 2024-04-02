const ideaLine = document.querySelector('.idea-page .line');

const ideaInside = document.querySelector('.idea-page .inside span');
const ideaWhere = document.querySelector('.idea-page .where span');
const ideaReality = document.querySelector('.idea-page .reality');
const ideaInput = document.querySelector('.idea-page .reality input');
const ideaOutput = document.querySelector('.idea-page .reality .output');

const placeholderText = "type your idea...";
let ideaLineRect = ideaLine.getBoundingClientRect();
let allowMaterialise = false;

window.addEventListener('scroll', () => {
    ideaLineRect = ideaLine.getBoundingClientRect();
});

window.addEventListener('resize', () => {
    ideaLineRect = ideaLine.getBoundingClientRect();
});

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('ideaEndIntersection', slide);    
});

function slide() {
    if (!ideaEndIntersecting) return;
    ideaInside.classList.add('slide-up');

    setTimeout(() => {
        ideaWhere.classList.add('slide-down');
    }, 600);

    setTimeout(() => {
        ideaReality.classList.add('slide-down-reality');
    }, 1200);

    setTimeout(() => {
        ideaReality.style.transform = 'translateY(-30%)';
        ideaReality.classList.remove('slide-down-reality');
        ideaInput.style.pointerEvents = 'all';
        allowMaterialise = true;
        ideaInputAnimation();
        realityToMatter();
    }, 2400);

    document.removeEventListener('ideaEndIntersection', slide);
}

function ideaInputAnimation() {
    var i = 0;
    var ideaInputAnimationId = setInterval(() => {
        if (i == placeholderText.length) {
            clearInterval(ideaInputAnimationId);
        } else ideaInput.placeholder = ideaInput.placeholder + placeholderText[i++];
    }, 100);
}

ideaInput.addEventListener('keydown', function(event) {
    const maxWidth = ideaInput.offsetWidth * 0.9;
    const contentWidth = getTextWidth(ideaInput.value, getComputedStyle(ideaInput).font);
    const keyCode = event.keyCode || event.which;
    if (keyCode === 8) return;
    if (keyCode === 13 && ideaInput.value.length > 0) {
        event.preventDefault();
        realityToMatter();
    }
    if (contentWidth >= maxWidth || ideaInput.value.length >= 30) event.preventDefault();
});

function realityToMatter() {
    if (ideaInput.textContent.trim() != "" || !allowMaterialise) return;
    allowMaterialise = false;
    ideaOutput.textContent = ideaInput.value.trim();
    ideaInput.value = "";

    var wordElement = spanifyWord(ideaOutput);
    var ideaWords = [];
    wordElement.forEach(word => {
        ideaWords.push(new IdeaWord(word));
    });

    anime({
        targets: ideaOutput.querySelectorAll('.word'),
        keyframes: [
            {translateY: '50%', easing: 'easeOutQuart', duration: 500},
            {translateY: '-100%', easing: 'easeOutQuart', duration: 400}
        ],
        delay: ideaWords.length == 1 ? 50 : anime.stagger(80, {easing: 'easeInQuad'}),
        update: function(anim) {
            ideaWords.forEach(word => {
                if (anim.progress > 0.4 && !word.spawned) word.checkIntersectionOnce();
            })
        },
        complete: function(anim) {
            ideaWords.forEach(word => {
                word.delete();
            });
            allowMaterialise = true;
        },
    });
}

class IdeaWord {
    constructor(element) {
        this.word = element;
        this.intersectionId = null;
        this.rect = this.word.getBoundingClientRect();
        this.spawned = false;
    }

    checkIntersectionOnce() {
        this.rect = this.word.getBoundingClientRect();
        if (this.rect.bottom - this.rect.height/2 < ideaLineRect.top) {
            this.word.style.color = 'transparent';
            printer.print({
                text: this.word.textContent,
                size: 0.018,
                x: this.rect.left,
                y: ideaLineRect.top + window.scrollY,
                relPosition: false,
                relSize: true,
                color: charColors,
                category: charCategory,
                mask: charCategory,
            }).forEach(letter => {
                Body.setVelocity(letter, Vector.create(0, -0.004 * (matterInstance.container.clientHeight/2)));
            });
            this.spawned = true;
        }
    }

    checkIntersection() {
        this.intersectionId = setInterval(() => {
            this.rect = this.word.getBoundingClientRect();
            if (this.rect.bottom - this.rect.height/2 + window.scrollY < ideaLineRect.top) {
                clearInterval(this.intersectionId);
                this.intersectionId = null;
                this.word.style.color = 'transparent';
                printer.print({
                    text: this.word.textContent,
                    size: 0.018,
                    x: this.rect.left,
                    y: ideaLineRect.top,
                    relPosition: false,
                    relSize: true,
                    color: [blue, green, yellow, red],
                    category: charCategory,
                    mask: charCategory,
                }).forEach(letter => {
                    Body.setVelocity(letter, Vector.create(0, -0.004 * (matterInstance.container.clientHeight/2)));
                })
            }
        }, 10);
    }

    delete() {
        this.word.remove();
    }
}