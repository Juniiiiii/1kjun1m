const cursor = document.querySelector('.cursor');
const titlePage = document.querySelector('.title-page-wrapper');
let pointingDown = false;

document.addEventListener("DOMContentLoaded", () => {
    //Start the loading sequence
    SpawnExpansionBody();
    SpawnCircles();
    
    window.addEventListener("resize", () => OnResize());
    
    window.addEventListener("scroll", () => {
        cloud.dance();
        containerRect = container.getBoundingClientRect();
    });
    
    Events.on(mengine, 'beforeUpdate', (event) => {
        if (cloud.isForcing) {
            if (isHovering(mousePosition, container)) {
                cloud.applyForce(Vector.create(mousePosition.x - containerRect.left, 
                                                mousePosition.y - containerRect.top));
            } else cloud.applyForce();
        }
    });

    window.addEventListener('mousemove', (e) => {
        moveCursor();
    });

    titlePage.onmouseover = () => {
        cursor.querySelector('#arrow-down').classList.add('show');
    };

    titlePage.onmouseleave = () => {
        cursor.querySelector('#arrow-down').classList.remove('show');
    };
});

function OnResize() {
    render.canvas.width = container.clientWidth;
    render.canvas.height = container.clientHeight;
    containerDiagonal = Math.sqrt(container.clientWidth * container.clientWidth + container.clientHeight * container.clientHeight);
    containerRect = container.getBoundingClientRect();

    if (!circleCollided) {
        Body.setVelocity(firstCircle, Vector.create(circleCollisionCorrection * firstCircle.frictionAir * container.clientWidth/2, 0));
        Body.setVelocity(secondCircle, Vector.create(-circleCollisionCorrection * secondCircle.frictionAir * container.clientWidth/2, 0));
    }

    cloud.adjustForces();
    cloud.repositionWalls();
}

function moveCursor() {
    cursor.style.left = mousePosition.x + 'px';
    cursor.style.top =  mousePosition.y + 'px';
}

function changeCursorIcon() {
    if (isHovering(mousePosition, container)) {
        if (!pointingDown) {
            cursor.querySelector('.cursor-down-arrow').classList.remove('hidden');
            pointingDown = true;
        }
    } else {
        cursor.querySelector('.cursor-down-arrow').classList.add('hidden');
        pointingDown = false;
    }
}

