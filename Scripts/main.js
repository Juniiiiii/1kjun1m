//Start the loading sequence
SpawnExpansionBody();
SpawnCircles();

window.addEventListener("resize", () => OnResize());

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

