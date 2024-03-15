const cursor = document.querySelector('.cursor');
const titlePage = document.querySelector('.title-page-wrapper');
const realityPage = document.querySelector('.reality-page-wrapper');
let titlePageIsShowing, matterInstanceRect = matterInstance.container.getBoundingClientRect();
let realityPageIsShowing, realityInstanceRect = realityInstance.container.getBoundingClientRect();

document.addEventListener("DOMContentLoaded", async () => {
    await Foundry.load();

    //Start the loading sequence
    SpawnExpansionBody();
    SpawnCircles();

    Body.setVelocity(firstCircle, Vector.create(circleCollisionCorrection * firstCircle.frictionAir * matterInstance.container.clientWidth/2, 0));
    Body.setVelocity(secondCircle, Vector.create(-circleCollisionCorrection * secondCircle.frictionAir * matterInstance.container.clientWidth/2, 0));    

    window.addEventListener("resize", () => OnResize());
    
    window.addEventListener("scroll", () => {
        if (titlePageIsShowing) {
            mcloud.dance();
            matterInstanceRect = matterInstance.container.getBoundingClientRect();
        }
        if (realityPageIsShowing) {
            rcloud.dance();
            realityInstanceRect = realityInstance.container.getBoundingClientRect();
        }
    });
    
    
    Events.on(matterInstance.engine, 'beforeUpdate', (event) => {
        if (titlePageIsShowing && mcloud.isForcing) {
            if (isHovering(mousePosition, mcloud.container)) {
                mcloud.applyForce(Vector.create(mousePosition.x - matterInstanceRect.left, 
                                                mousePosition.y - matterInstanceRect.top));
            } else mcloud.applyForce();
        }
    });

    Events.on(realityInstance.engine, 'beforeUpdate', (event) => {
        if (realityPageIsShowing && rcloud.isForcing) {
            if (isHovering(mousePosition, rcloud.container)) {
                rcloud.applyForce(Vector.create(mousePosition.x - realityInstanceRect.left, 
                                                mousePosition.y - realityInstanceRect.top));
            } else rcloud.applyForce();
        }
    })

    window.addEventListener('mousemove', (e) => {
        moveCursor();
    });

    titlePage.onmouseover = () => {
        cursor.querySelector('#arrow-down').classList.add('show');
    };

    titlePage.onmouseleave = () => {
        cursor.querySelector('#arrow-down').classList.remove('show');
    };

    var titlePageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            titlePageIsShowing = entry.isIntersecting;
        });
    });

    titlePageObserver.observe(titlePage);

    var realityPageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            realityPageIsShowing = entry.isIntersecting;
        });
    });

    realityPageObserver.observe(realityPage);
});

function OnResize() {
    matterInstance.resize();
    realityInstance.resize();

    mcloud.updateDiagonal();
    mcloud.adjustForces();
    mcloud.repositionWalls();

    rcloud.updateDiagonal();
    rcloud.adjustForces();
    rcloud.repositionWalls();
}

function moveCursor() {
    cursor.style.left = mousePosition.x + 'px';
    cursor.style.top =  mousePosition.y + 'px';
}
