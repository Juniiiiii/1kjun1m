const ideaLine = document.querySelector('.idea-page .idea-line')
const ideaLines = document.querySelectorAll('.idea-page .main-title span');
const ideaSubtitle = document.querySelector('.idea-page .sub-title .text');
const ideaInput = document.querySelector('.idea-page .sub-title .reality input');
const ideaOutput = document.querySelector('.idea-page .sub-title .reality .output');
let ideaMaterialized = false, materializeId = null, ideaRealitySlideId = null, allowMaterialize = false;
let ideaInputAnimationComplete = false, ideaInputAnimationId = null;
const placeholderText = "type your idea...";
let ideaLineRect = ideaLine.getBoundingClientRect();
let currentIdeaLine = ideaLines.length - 1, targetIdeaLine = 0, ideaLineId, ideaDirection,
    ideaHide = Array(ideaLines.length).fill(null), ideaShow = new Set([]);
let ideaSubtitleVisible = false;

window.addEventListener('scroll', () => {
    ideaLineRect = ideaLine.getBoundingClientRect();
});

window.addEventListener('resize', () => {
    ideaLineRect = ideaLine.getBoundingClientRect();
});

document.addEventListener('DOMContentLoaded', function () {
    ideaLineRect = ideaLine.getBoundingClientRect();
    for (var i = 0; i < ideaLines.length; i++) {
        ideaLines[i].style.transform = 'translateY(' + (-22.1 * i + 10) + '%)';
    }

    document.addEventListener('ideaHalfIntersection', function () {
        moveIdeaLine(ideaHalfIntersecting);
    });
});

function fadeIdeaLineOut(index) {
    ideaHide[index] = setTimeout(() => {
        ideaLines[index].classList.remove('show');
        ideaHide[index] = null;
    }, 400);
}

function moveIdeaLine(down) {
    if (ideaDirection == down) return;
    ideaDirection = down;

    if (ideaDirection) targetIdeaLine = 0;
    else targetIdeaLine = ideaLines.length - 1;

    if (ideaLineId == null) {
        ideaLineId = setInterval(() => {
            if (currentIdeaLine == targetIdeaLine) {
                clearInterval(ideaLineId);
                ideaLineId = null;
                if (targetIdeaLine == 0) {
                    ideaSubtitle.classList.add('slide-in');
                    if (!ideaMaterialized) {
                        ideaRealitySlideId = setTimeout(() => {
                            ideaInput.classList.add('slide-in-reality');
                            materializeId = setTimeout(() => {
                                ideaMaterialized = true;
                                allowMaterialize = true;
                                ideaInput.classList.remove('slide-in');
                                ideaInput.style.transform = 'translateY(-5%)';
                                ideaInput.style.pointerEvents = 'all';
                                materializeId = null;
                                if (!ideaInputAnimationComplete) ideaInputAnimation();
                                realityToMatter();
                            }, 1100);
                        }, 120);
                    }
                    ideaSubtitleVisible = true;
                }
                return;
            } else {
                if (ideaSubtitleVisible) {
                    ideaSubtitle.classList.remove('slide-in');
                    if (!ideaMaterialized) {
                        if (ideaRealitySlideId != null) clearTimeout(ideaRealitySlideId);
                        ideaInput.classList.remove('slide-in-reality');
                        ideaRealitySlideId = null;
                        if (materializeId != null) {
                            clearTimeout(materializeId);
                            materializeId = null;
                        }
                    }
                    ideaSubtitleVisible = false;
                }
                fadeIdeaLineOut(currentIdeaLine);
                currentIdeaLine += (ideaDirection) ? -1 : 1;
                ideaLines[currentIdeaLine].classList.add('show');
                if (ideaHide[currentIdeaLine]) {
                    clearTimeout(ideaHide[currentIdeaLine]);
                    ideaHide[currentIdeaLine] = null;
                }
            }
        }, 40);
    }
}

ideaInput.addEventListener('keydown', function(event) {
    if (!ideaInputAnimationComplete) {
        clearInterval(ideaInputAnimationId);
        ideaInput.placeholder = placeholderText;
    }
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

function ideaInputAnimation() {
    ideaInputAnimationComplete = true;
    var i = 0;
    ideaInputAnimationId = setInterval(() => {
        if (i == placeholderText.length) {
            clearInterval(ideaInputAnimationId);
            ideaInputAnimationId = null;
        } else ideaInput.placeholder = ideaInput.placeholder + placeholderText[i++];
    }, 100);
}

function realityToMatter() {
    if (ideaInput.textContent.trim() != "" || !allowMaterialize) return;
    allowMaterialize = false;
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
        delay: ideaWords.length == 1 ? 50 : anime.stagger(50, {easing: 'easeInQuad'}),
        update: function(anim) {
            ideaWords.forEach(word => {
                if (anim.progress > 0.4 && !word.spawned) word.checkIntersectionOnce();
            })
        },
        complete: function(anim) {
            ideaWords.forEach(word => {
                word.delete();
            });
            allowMaterialize = true;
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
                color: [blue, green, yellow, red],
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