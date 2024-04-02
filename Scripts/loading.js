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

//Activate navbar

const topNav = document.getElementById('top-button');
const aboutNav = document.getElementById('about-button');
const projectNav = document.getElementById('project-button');
const contactNav = document.getElementById('contact-button');

function enableNav() {
    topNav.addEventListener('click', () => {
        document.getElementById('matter-container').scrollIntoView({behavior: 'smooth'});
    });

    aboutNav.addEventListener('click', () => {
        document.getElementById('third-page').scrollIntoView({behavior: 'smooth'});
    });

    projectNav.addEventListener('click', () => {
        document.getElementById('fourth-page').scrollIntoView({behavior: 'smooth'});
    });

    contactNav.addEventListener('click', () => {
        document.getElementById('footer').scrollIntoView({behavior: 'smooth'});
    });
}

function myAutoScroll() {
      //with scrollTop we check if the page has been scrolled
      //if == 0, it hasnt
    document.getElementById('matter-container').scrollIntoView({behavior: "smooth"});
}
