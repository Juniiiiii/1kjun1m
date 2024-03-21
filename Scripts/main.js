const firstPage = document.querySelector('.first-page');
let firstPageRect = firstPage.getBoundingClientRect();

window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

document.addEventListener("DOMContentLoaded", async () => {
    await Foundry.load();

    startCollision();

    window.addEventListener("resize", () => OnResize());
    OnResize();

    window.addEventListener("scroll", () => {
        if (landingIntersecting) cloud.dance();
        if (firstIntersecting) matterInstanceRect = matterInstance.container.getBoundingClientRect();
    });

    Events.on(matterInstance.engine, 'beforeUpdate', (event) => {
        if (firstIntersecting && cloud.isForcing) {
            if (isHovering(mousePosition, cloud.container)) {
                cloud.applyForce(Vector.create(mousePosition.x - matterInstanceRect.left, 
                                                mousePosition.y - matterInstanceRect.top));
            } else cloud.applyForce();
        }
    });
});

function OnResize() {
    firstPageRect = firstPage.getBoundingClientRect();
    matterInstance.resize(firstPageRect.width, firstPageRect.height);

    cloud.updateDiagonal();
    cloud.adjustForces();
    cloud.repositionWalls();

    printer.updateWrap();
}

/* 
 const cursor = document.querySelector('.cursor');
const titlePage = document.querySelector('.title-page-wrapper');
const realityPage = document.querySelector('.reality-page-wrapper');
let titlePageIsShowing, matterInstanceRect = matterInstance.container.getBoundingClientRect();
let realityPageIsShowing, realityInstanceRect = realityInstance.container.getBoundingClientRect();

window.addEventListener('mousemove', (e) => {
    moveCursor();
});

document.addEventListener("DOMContentLoaded", async () => {
    titlePage.onmouseover = () => {
        cursor.querySelector('#arrow-down').classList.add('show');
    };

    titlePage.onmouseleave = () => {
        cursor.querySelector('#arrow-down').classList.remove('show');
    };

    realityPage.onmouseover = () => {
        cursor.style.backgroundColor = 'transparent';
        cursor.style.mixBlendMode = 'normal';
        cursor.querySelector('#pointer').classList.add('show');
    };

    realityPage.onmouseleave = () => {
        cursor.style.backgroundColor = 'white';
        cursor.style.mixBlendMode = 'difference';
        cursor.querySelector('#pointer').classList.remove('show');
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

*/