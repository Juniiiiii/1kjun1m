const realityPageWrapper = document.querySelector('.reality-page-wrapper')
const ideaPageWrapper = document.querySelector('.idea-page-wrapper');
const ideaInputWrapper = document.querySelector('.idea-input-wrapper')
const ideaInput = document.querySelector('.idea-input');
const ideaInputField = document.querySelector('.idea-input input');
const ideaInputButton = document.querySelector('.idea-input button');
const materializer = document.querySelector('.idea-materialize');
let allowMaterialize = true;
let materializeTrigger = ideaPageWrapper.getBoundingClientRect().y;
let spawningHeight = realityPageWrapper.getBoundingClientRect().height;

ideaInput.addEventListener('keydown', function(event) {
    const maxWidth = ideaInputField.offsetWidth * 0.9;
    const contentWidth = getTextWidth(ideaInput.value, getComputedStyle(ideaInputField).font);
    const keyCode = event.keyCode || event.which;
    if (keyCode === 8) return;
    if (keyCode === 13 && ideaInputField.value.length > 0) {
        event.preventDefault();
        textToMatter();
    }
    if (contentWidth >= maxWidth || ideaInputField.value.length >= 100) event.preventDefault();
});

ideaInputButton.addEventListener('click', function() {
    textToMatter();
})

function textToMatter() {
    if (!allowMaterialize) return;
    allowMaterialize = false;
    materializer.textContent = ideaInputField.value;

    ideaInputField.value = "";

    const wordElement = spanifyWord(materializer);
    let words = [];
    wordElement.forEach(word => {
        words.push(new IdeaWord(word));
    });
    
    for (var i = words.length - 1; i >= 0; i--) setAbsolute(words[i].word);
    
    anime({
        targets: '.idea-materialize .word',
        translateY: -ideaPageWrapper.clientHeight,
        easing: 'easeInBack',
        duration: 800,
        delay: words.length == 1 ? 100 : anime.stagger(100, {easing: 'easeInQuad'}),
        complete: function(anim) {
            allowMaterialize = true;
            words.forEach(word => {
                word.delete();
            });
        },
    });
    words.forEach(word => {
        word.startAnimation();
    });
}

class IdeaWord {
    constructor(element) {
        this.word = element;
        this.intersectionId = null;
        this.rect = null;
    }

    startAnimation() {
        this.intersectionId = setInterval(() => {
            this.rect = this.word.getBoundingClientRect();
            if (this.rect.y < ideaPageWrapper.getBoundingClientRect().y) {
                clearInterval(this.intersectionId);
                this.intersectionId = null;
                this.word.style.color = 'transparent';
                rprinter.print({
                    text: this.word.textContent,
                    size: 0.01,
                    x: this.rect.x,
                    y: spawningHeight,
                    relPosition: false,
                    relSize: true,
                    color: [blue, green, yellow, white, red],
                    category: charCategory,
                    mask: charCategory,
                }).forEach(letter => {
                    Body.setVelocity(letter, Vector.create(0, -0.005 * (realityInstance.container.clientHeight/2)));
                });
            }
        }, 10);
    }

    delete() {
        this.word.remove();
    }
}
