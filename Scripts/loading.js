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
    Composite.add(mengine.world, [firstCircle, secondCircle]);
}

function StartLoadingCollision() {
    Body.setVelocity(firstCircle, Vector.create(circleCollisionCorrection * firstCircle.frictionAir * container.clientWidth/2, 0));
    Body.setVelocity(secondCircle, Vector.create(-circleCollisionCorrection * secondCircle.frictionAir * container.clientWidth/2, 0));
}

Events.on(mengine, 'collisionStart', event => {
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
    Composite.add(mengine.world, expansionBody);
    Body.setPosition(expansionBody, Vector.create((firstCircle.position.x + secondCircle.position.x)/2, 
                                                (firstCircle.position.y + secondCircle.position.y)/2));

    cloud.spawnParticles();
    cloud.setPositionOffset(expansionBody.position.x, expansionBody.position.y);
    cloud.isForcing = true;

    Composite.remove(mengine.world, firstCircle);
    Composite.remove(mengine.world, secondCircle)

    loadingElement.removeEventListener('mouseover', hoverLoading);
    loadingElement.removeEventListener('mouseout', unhoverLoading);
    document.querySelector('.loading').remove();

    var iter = 1000/mengine.timing.lastDelta;
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
    }, mengine.timing.lastDelta);

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

            Composite.add(mengine.world, mouseConstraint);
            container.style.backgroundColor = black;
            Composite.remove(mengine.world, expansionBody);

        } else Body.scale(expansionBody, cur/prev, cur/prev);
    }, 1);
}