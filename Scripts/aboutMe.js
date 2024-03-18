let aboutTexts, aboutLetters = [], aboutLetterCount = 0, prevLetter = 0, newLetter = 0, 
aboutLetterStart = true, aboutLetterEnd = false, aboutLetterShow = [], aboutLetterHide = [];
let aboutTitleMovements = {}, aboutTitleObserver;
let realityLine, realityLineWrapper;

document.addEventListener('DOMContentLoaded', function() {
    aboutTexts = document.querySelectorAll('.about-me .about-text');

    aboutTexts.forEach(aboutMeText => {
        let textContent = aboutMeText.textContent.trim().split("");

        let newText = "";
        textContent.forEach(letter => {
            newText += (letter.trim() === "") ? "<span class='about-me-letter no-select'>&nbsp;</span>" : "<span class='about-me-letter'>" + letter + "</span>";
            aboutLetterCount++;
        });

        aboutMeText.innerHTML = newText;
    });

    aboutTexts.forEach(aboutMeText => {
        aboutMeText.querySelectorAll('.about-me-letter').forEach(letter => {
            aboutLetters.push(letter);
        });
    });

    aboutLetters.forEach(() => {
        aboutLetterShow.push(null);
        aboutLetterHide.push(null);
    })

    window.addEventListener('scroll', function() {
        //showAboutLetters(window.scrollY);
    });

    var aboutTitleTexts = document.querySelectorAll('.about-title-text-wrapper .about-title-text');
    realityLineWrapper = document.querySelector('.reality-line-wrapper');
    realityLine = document.querySelector('.reality-line-wrapper .no-select');

    aboutTitleMovements[aboutTitleTexts[0].getAttribute('about-title-move')] = new AboutTitleMovement(aboutTitleTexts[0], 10, 1000);
    aboutTitleMovements[aboutTitleTexts[1].getAttribute('about-title-move')] = new AboutTitleMovement(aboutTitleTexts[1], 21, 1250);
    aboutTitleMovements[realityLine.getAttribute('about-title-move')] = new AboutTitleMovement(realityLine, 20, 1500, true);

    aboutTitleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) aboutTitleMovements[entry.target.getAttribute('about-title-move')].translateMax();
            else aboutTitleMovements[entry.target.getAttribute('about-title-move')].translateZero();
        });
    }, {
        threshold: 0.5
    });

    aboutTitleTexts.forEach(aboutTitleText => {
        aboutTitleObserver.observe(aboutTitleText);
    });
    aboutTitleObserver.observe(realityLine);
});

function aboutLettersShowUpTo(index) {
    if (index > prevLetter) {
        for (var i = prevLetter; i <= index; i++) {
            aboutLetters[i].classList.add('show');
        }
    } else {
        for (var i = Math.max(prevLetter, aboutLetterEnd ? -1 : aboutLetterCount - 1); i >= index; i--) {
            aboutLetters[i].classList.remove('show');
        }
    }
}

function showAboutLetters(currentY) {
    if (currentY <= 0) aboutLettersShowUpTo(0);
    else if (currentY >= titleWrapper.offsetHeight) {
        aboutLetterEnd = true;
        aboutLettersShowUpTo(aboutLetterCount - 1);
    }
    else {
        aboutLetterEnd = false;
        newLetter = Math.floor(currentY * (aboutLetterCount - 1) / (titleWrapper.offsetHeight));
        if (newLetter < 0) return;
        if (newLetter !== prevLetter) {
            aboutLettersShowUpTo(newLetter);
            prevLetter = newLetter;
        }
    }
}

function moveAboutTitleTexts(currentY) {
    let percentage = currentY / (titleWrapper.offsetHeight * 0.6);
    percentage = Math.min(1, percentage);
    aboutTitleMovements.forEach(movement => {
        movement.move(percentage);
    });
}

class AboutTitleMovement {
    constructor(element, maxMovement, duration, bounce) {
        this.element = element;
        this.maxMovement = maxMovement;
        this.duration = duration;
        this.animation = null;
        this.triggered = false;
        this.bounce = bounce;
    }

    translateMax() {
        if (this.triggered) return;
        this.triggered = true;
        if (this.animation != null && !this.animation.completed) this.animation.pause();
        if (!this.bounce) {
            this.animation = anime({
                targets: this.element,
                translateX: this.maxMovement + 'vw',
                duration: this.duration,
            });
        } else {
            this.animation = anime({
                targets: this.element,
                translateX: this.maxMovement + 'vw',
                duration: this.duration/2,
                complete: () => {
                    delete aboutTitleMovements[this.element.getAttribute('about-title-move')];
                    aboutTitleObserver.unobserve(this.element);
                    this.bouncingSequence();
                }
            });
        }
    }

    translateZero() {
        if (!this.triggered) return;
        this.triggered = false;
        if (this.animation != null && !this.animation.completed) this.animation.pause();
        this.animation = anime({
            targets: this.element,
            translateX: 0,
            duration: this.duration,
        });
    }

    bouncingSequence() {
        anime.timeline().add({
            targets: this.element,
            translateY: -document.querySelector('.about-title-text-wrapper').offsetHeight * 1 + 'px',
            duration: this.duration/2,
            easing: 'easeOutExpo',
            complete: () => {
                this.element.style.mixBlendMode = 'normal';
                this.element.style.color = black;
            }
       })
       .add({
            targets: this.element,
            translateY: this.element.offsetHeight + 'px',
            duration: this.duration/2,
            easing: 'easeOutExpo',
            begin: () => {
                const checkIntersectionId = setInterval(() => {
                    if (isIntersecting(this.element, realityLineWrapper)) {
                        clearInterval(checkIntersectionId);
                        const rect = this.element.getBoundingClientRect();
                        this.element.classList.add('hidden');
                        aboutToReality(rect.x, rect.y + rect.height);
                    }
                }, 50);
            },
       });
    }
}

function aboutToReality(posX, posY) {
    Composite.add(realityInstance.engine.world, realityInstance.mouseConstraint);

    rcloud.spawnParticles();
    rcloud.setPositionOffset(posX, 0);
    setTimeout(() => {
        rcloud.removeParticlesOutside();
    }, 1000);
    rcloud.isForcing = true;

    var iter = 1000/realityInstance.engine.timing.lastDelta;
    var reachForce = particleConsistentForce * rcloud.diagonal;
    var incr = (reachForce - rcloud.repulsionForce)/iter;
    rcloud.alteringForce = true;
    const repulsionId = setInterval(() => {
        rcloud.repulsionForce += incr;
        if (rcloud.repulsionForce >= reachForce) {
            clearInterval(repulsionId);
            rcloud.repulsionForce = reachForce;
            rcloud.alteringForce = false;
            rcloud.adjustForces();
        }
    }, realityInstance.engine.timing.lastDelta);

    rprinter.print({
        text: "reality",
        size: 0.01,
        x: posX,
        y: 0,
        relPosition: false,
        relSize: true,
        color: [white],
        category: charCategory,
        mask: charCategory,
    }).forEach(letter => {
        Body.setVelocity(letter, Vector.create(0, 0.005 * (realityInstance.container.clientHeight/2)));
    });
}



