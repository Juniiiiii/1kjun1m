//Loading text animation
let loadingElement = document.querySelector('.loading-text');

function hoverLoading(event) {
    loadingElement.querySelectorAll('span').forEach(element => {
        element.style.width = element.scrollWidth + 'px';
    })
}

function unhoverLoading(event) {
    loadingElement.querySelectorAll('span').forEach(element => {
        element.style.width = '0px';
    })
}

loadingElement.addEventListener('mouseover', hoverLoading);
loadingElement.addEventListener('mouseout', unhoverLoading);
//Initial collision
let expansionBody, firstCircle, secondCircle, circleCollided = false;

function SpawnExpansionBody() {
    expansionBody = Bodies.circle(-1, -1, 1, {
        render: {
            fillStyle: black,
            strokeStyle: black,
            lineWidth: 1,
        },
        collisionFilter: {
            category: invisibleCategory,
        },
        label: "expansion",
    });
}

function SpawnCircles() {
    var radius = remToPx(circleRadiusRem);
    var options = {
        render: {
            visible: true,
            fillStyle: black,
            strokeStyle: black,
            lineWidth: 1,
        },
        collisionFilter: {
            category: defaultCategory,
        },
    }
    options.label = "firstCircle";
    firstCircle = Bodies.circle(-radius, matterInstance.container.clientHeight/2, radius, JSON.parse(JSON.stringify(options)));

    options.label = "secondCircle";
    secondCircle = Bodies.circle(matterInstance.container.clientWidth + radius, matterInstance.container.clientHeight/2, radius, JSON.parse(JSON.stringify(options)));
    Composite.add(matterInstance.engine.world, [firstCircle, secondCircle]);
}

function StartLoadingCollision() {
    Body.setVelocity(firstCircle, Vector.create(circleCollisionCorrection * firstCircle.frictionAir * matterInstance.container.clientWidth/2, 0));
    Body.setVelocity(secondCircle, Vector.create(-circleCollisionCorrection * secondCircle.frictionAir * matterInstance.container.clientWidth/2, 0));
}

Events.on(matterInstance.engine, 'collisionStart', event => {
    if (!circleCollided) {
        var pairs = event.pairs;
        for (var i = 0 ; i < pairs.length; i++) {
            var pair = pairs[i];
            if (pair.bodyA.id === firstCircle.id || pair.bodyB.id === firstCircle.id) {
                circleCollided = true;
                AfterCirclesCollision();
                break;
            }
        }
    }
})

function AfterCirclesCollision() {
    Composite.add(matterInstance.engine.world, expansionBody);
    Body.setPosition(expansionBody, Vector.create((firstCircle.position.x + secondCircle.position.x)/2, 
                                                (firstCircle.position.y + secondCircle.position.y)/2));

    mcloud.spawnParticles();
    mcloud.setPositionOffset(expansionBody.position.x, expansionBody.position.y);
    setTimeout(() => {
        mcloud.removeParticlesOutside();
    }, 1000);
    mcloud.isForcing = true;

    Composite.remove(matterInstance.engine.world, firstCircle);
    Composite.remove(matterInstance.engine.world, secondCircle)

    loadingElement.removeEventListener('mouseover', hoverLoading);
    loadingElement.removeEventListener('mouseout', unhoverLoading);
    document.querySelector('.loading').remove();

    var iter = 1000/matterInstance.engine.timing.lastDelta;
    var reachForce = particleConsistentForce * mcloud.diagonal;
    var incr = (reachForce - mcloud.repulsionForce)/iter;
    mcloud.alteringForce = true;
    const repulsionId = setInterval(() => {
        mcloud.repulsionForce += incr;
        if (mcloud.repulsionForce >= reachForce) {
            clearInterval(repulsionId);
            mcloud.repulsionForce = reachForce;
            mcloud.alteringForce = false;
            mcloud.adjustForces();
        }
    }, matterInstance.engine.timing.lastDelta);

    document.querySelector('#matter-container').style.zIndex = -1;

    document.body.style.backgroundColor = 'transparent';
    
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = "auto";

    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "auto";

    document.querySelector('.cursor').classList.remove('hidden');

    document.querySelectorAll('.title-line-wrapper .no-select')[0].classList.remove('hidden');

    DomainExpansion();
}

function DomainExpansion() {
    var cur = 1, prev = 1, incre = expansionSpeed * mcloud.diagonal;
    const expansionId = setInterval(() => {
        prev = cur;
        cur += incre;
        
        if (cur > mcloud.diagonal) {
            clearInterval(expansionId);
            cur = mcloud.diagonal;

            mcloud.container.style.backgroundColor = black;
            Composite.remove(matterInstance.engine.world, expansionBody);

        } else Body.scale(expansionBody, cur/prev, cur/prev);
    }, 1);
}