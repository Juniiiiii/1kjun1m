const firstPage = document.querySelector('.first-page');
let firstPageRect = firstPage.getBoundingClientRect();
let matterHovering = false;

window.onload = function() {
    window.scrollTo(0, 0);
    history.scrollRestoration = "manual";
};

(async () => {
    await Foundry.load();

    startCollision();

    window.addEventListener("resize", OnResize);
    OnResize();

    Events.on(matterInstance.engine, 'beforeUpdate', (event) => {
        if (firstIntersecting && cloud.isForcing) {
            if (matterHovering) cloud.applyForce(mousePosition);
            else cloud.applyForce();
        }
    });

    firstPage.addEventListener('mouseover', () => {
        matterHovering = true;
    });

    firstPage.addEventListener('mouseout', () => {
        matterHovering = false;
    });
})();

function OnResize() {
    firstPageRect = firstPage.getBoundingClientRect();
    matterInstance.resize(firstPageRect.width, firstPageRect.height);

    cloud.updateDiagonal();
    cloud.adjustForces();
    cloud.repositionWalls();

    printer.updateWrap();
}