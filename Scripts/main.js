//Start the loading sequence
SpawnExpansionBody();
SpawnCircles();
setTimeout(() => {
    StartLoadingCollision();
}, 1000);
render.canvas.width = container.clientWidth;
render.canvas.height = container.clientHeight;
containerDiagonal = Math.sqrt(container.clientWidth * container.clientWidth + container.clientHeight * container.clientHeight);

window.addEventListener("resize", () => OnResize());

function OnResize() {
    render.canvas.width = container.clientWidth;
    render.canvas.height = container.clientHeight;
    containerDiagonal = Math.sqrt(container.clientWidth * container.clientWidth + container.clientHeight * container.clientHeight);

    if (!circleCollided) {
        Body.setVelocity(firstCircle, Vector.create(circleCollisionCorrection * firstCircle.frictionAir * container.clientWidth/2, 0));
        Body.setVelocity(secondCircle, Vector.create(-circleCollisionCorrection * secondCircle.frictionAir * container.clientWidth/2, 0));
    }

    cloud.adjustForces();
    cloud.repositionWalls();
}

Events.on(engine, 'beforeUpdate', event => {
    if (cloud.isForcing) cloud.applyForce(mousePosition);
});

