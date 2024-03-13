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
    firstCircle = Bodies.circle(-radius, container.clientHeight/2, radius, JSON.parse(JSON.stringify(options)));

    options.label = "secondCircle";
    secondCircle = Bodies.circle(container.clientWidth + radius, container.clientHeight/2, radius, JSON.parse(JSON.stringify(options)));
    Composite.add(engine.world, [firstCircle, secondCircle]);
}

function StartLoadingCollision() {
    Body.setVelocity(firstCircle, Vector.create(circleCollisionCorrection * firstCircle.frictionAir * container.clientWidth/2, 0));
    Body.setVelocity(secondCircle, Vector.create(-circleCollisionCorrection * secondCircle.frictionAir * container.clientWidth/2, 0));
}

Events.on(engine, 'collisionStart', event => {
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
    Composite.add(engine.world, expansionBody);
    Body.setPosition(expansionBody, Vector.create((firstCircle.position.x + secondCircle.position.x)/2, 
                                                (firstCircle.position.y + secondCircle.position.y)/2));

    cloud.spawnParticles();
    cloud.setPositionOffset(expansionBody.position.x, expansionBody.position.y);
    cloud.isForcing = true;

    Composite.remove(engine.world, firstCircle);
    Composite.remove(engine.world, secondCircle)

    loadingElement.removeEventListener('mouseover', hoverLoading);
    loadingElement.removeEventListener('mouseout', unhoverLoading);
    document.querySelector('.loading').remove();

    var iter = 1000/engine.timing.lastDelta;
    var reachForce = particleConsistentForce * containerDiagonal;
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
    }, engine.timing.lastDelta);

    document.querySelector('#matter-container').style.zIndex = -1;

    document.body.style.backgroundColor = 'transparent';
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    DomainExpansion();
}

function DomainExpansion() {
    var cur = 1, prev = 1, incre = expansionSpeed * containerDiagonal;
    const expansionId = setInterval(() => {
        prev = cur;
        cur += incre;
        
        if (cur > containerDiagonal) {
            clearInterval(expansionId);
            cur = containerDiagonal;

            Composite.add(engine.world, mouseConstraint);
            container.style.backgroundColor = black;
            Composite.remove(engine.world, expansionBody);

        } else Body.scale(expansionBody, cur/prev, cur/prev);
    }, 1);
}