const circleRadiusRem = 3;
const circleCollisionCorrection = 1.5;

const expansionSpeed = 0.03;

const loadingText = document.querySelector('.loading-text');

function hoverLoading(event) {
    loadingText.querySelectorAll('span').forEach(element => {
        element.style.width = element.scrollWidth + 'px';
    })
}

function unhoverLoading(event) {
    loadingText.querySelectorAll('span').forEach(element => {
        element.style.width = '0px';
    })
}

loadingText.addEventListener('mouseover', hoverLoading);
loadingText.addEventListener('mouseout', unhoverLoading);

const loadingPage = document.querySelector('.loading-page');
const firstCircle = document.getElementById('loading-circle-one');
const secondCircle = document.getElementById('loading-circle-two');
const expansionCircle = document.getElementById('expansion-circle');

firstCircle.style.left =  '-2.5em';
secondCircle.style.left = 'calc(100vw + 2.5em)';

function startCollision() {
    anime({
        targets: firstCircle,
        left: ['-2.5em', '50vw'],
        easing: 'easeOutExpo',
        duration: 500,
    });

    anime({
        targets: secondCircle,
        left: ['calc(100vw + 2.5em)', '50vw'],
        easing: 'easeOutExpo',
        duration: 500,
        complete: function(anim) {
            collisionComplete();
        }
    });
}

function collisionComplete() {
    expansionCircle.classList.remove('hidden');

    firstCircle.remove();
    secondCircle.remove();

    loadingText.removeEventListener('mouseover', hoverLoading);
    loadingText.removeEventListener('mouseout', unhoverLoading);

    const rect = loadingText.getBoundingClientRect();
    loadingText.remove();

    loadingPage.style.backgroundColor = 'transparent';

    cloud.spawnParticles();
    cloud.setPositionOffset(rect.left + rect.width/2, rect.top + rect.height/2);
    cloud.isForcing = true;
    setTimeout(() => {
        cloud.removeParticlesOutside();
    }, 1000);
    
    var iter = 1000/matterInstance.engine.timing.lastDelta;
    var reachForce = particleConsistentForce * cloud.diagonal;
    var incr = (reachForce - cloud.repulsionForce)/iter;
    cloud.alteringForce = true;
    const repulsionId = setInterval(() => {
        cloud.repulsionForce += incr;
        if (cloud.repulsionForce >= reachForce) {
            clearInterval(repulsionId);
            cloud.repulsionForce = reachForce;
            cloud.alteringForce = false;
            cloud.adjustForces();
        }
    }, matterInstance.engine.timing.lastDelta);

    anime({
        targets: expansionCircle,
        width: ['0', '80em'],
        height: ['0', '80em'],
        easing: 'easeOutExpo',
        duration: 500,
        complete: function(anim) {
            loadingPage.remove();
            expansionComplete();
        }
    });
}

function expansionComplete() {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto"; 

    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";

    enableNav();
}

//Navbar stuff

const navs = document.querySelectorAll('.nav .bar > div');
const navigations = [
    document.getElementById('matter-container'),
    document.getElementById('third-page'),
    document.getElementById('fourth-page'),
    document.getElementById('footer')
]

function enableNav() {
    navs.forEach((nav, i) => {
        nav.style.pointerEvents = 'all';
        nav.addEventListener('click', () => {
            navigations[i].scrollIntoView({behavior: 'smooth'});
        });
        new ButtonFollow(nav);
    });
}

class ButtonFollow {
    constructor(element){
        this.element = element;
        this.rect = this.element.getBoundingClientRect();

        window.addEventListener('resize', () => {
            this.rect = this.element.getBoundingClientRect();
        });

        this.element.addEventListener('mouseover', () => {
            this.element.addEventListener('mousemove', this.followMouse.bind(this));
        });

        this.element.addEventListener('mouseout', () => {
            this.element.removeEventListener('mousemove', this.followMouse.bind(this));

            this.anime = anime({
                targets: this.element,
                translateX: 0,
                translateY: 0,
                duration: 200,
                easing: 'linear',
            });
        });
    }

    followMouse(event) {
        this.anime = anime({
            targets: this.element,
            translateX: 0.2 * (event.clientX - this.rect.x - this.rect.width/2),
            translateY: 0.2 * (event.clientY - this.rect.y - this.rect.height/2),
            duration: 50,
            easing: 'linear',
        });
    }
}