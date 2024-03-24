const projectGrid = document.querySelector('.project-grid');
const projectBar = document.querySelector('.project-bar');

const projectRows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--project-rows'));
const projectCols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--project-cols'));

function pixelCoordToIndex(row, col) {
    return row * projectCols + col;
}

let pixelGrid = [], allPixels = {}, allIndexes = new Set(), allIndexesArr;
for (var i = 0; i < projectRows; i++) {
    pixelGrid.push([]);
    for (var j = 0; j < projectCols; j++) pixelGrid[i].push(null);
}
let pixelObserver, curPixelRow, pixelRowShowing = new Set();

let allProjectCards = [];
let selectedCard = null;

document.addEventListener('DOMContentLoaded', () => {
    /* for (var i = 0, newIndex; i < minimumPixelCount; i++) {
        newIndex = Math.floor(Math.random() * projectCols * projectRows);
        while (allIndexes.has(newIndex)) newIndex = Math.floor(Math.random() * projectCols * projectRows);
        new Pixel(newIndex, i);
    }

    console.log(allIndexes.size, minimumPixelCount); */

    for (var i = 0; i < minimumPixelCount; i++) {
        newIndex = Math.floor(Math.random() * projectCols * projectRows);
        while (allIndexes.has(newIndex)) newIndex = Math.floor(Math.random() * projectCols * projectRows);
        new Pixel(newIndex);
    }

    allIndexesArr = Array.from(allIndexes);

    allProjectCards.push(new ProjectCard('ourVoice', '/Media/ourVoice.png', 'OurVoice', ourVoiceCoordinates, 'red-border'));
    allProjectCards.push(new ProjectCard('insideTheMindOf', '/Media/insideTheMindOf.png', 'inside the mind of', insideTheMindOfCoordinates, 'yellow-border'));

    /* pixelObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            curPixelRow = entry.target.getAttribute('row-num');
            if (curPixelRow) {
                if (entry.isIntersecting  && !pixelRowShowing.has(curPixelRow)) {
                    pixelGrid[curPixelRow].forEach(pixel => {
                        if (pixel) pixel.showBorder();
                    });
                    pixelRowShowing.add(curPixelRow);
                } else {
                    pixelGrid[curPixelRow].forEach(pixel => {
                        if (pixel) pixel.hideBorder();
                    });
                    pixelRowShowing.delete(curPixelRow);
                }
            }
        });
    });

    pixelGrid.forEach(row => {
        for (var i = 0 ; i < row.length; i++) {
            if (row[i]) {
                pixelObserver.observe(row[i].element);
                row[i].element.setAttribute('row-num', row[i].row);
                return;
            }
        }
    }); */
});

const cardTransition = 1000;

class Pixel {
    constructor(index) {
        this.index = index;
        this.row = Math.floor(index / projectCols);
        this.col = index % projectCols;

        this.element = document.createElement('span');

        projectGrid.appendChild(this.element);

        this.element.style.gridArea = (this.row + 1) + ' / ' + (this.col + 1);

        allPixels[this.index] = this;
        pixelGrid[this.row][this.col] = this;
        allIndexes.add(this.index);
    }

    addClass(border) {
        this.element.classList.add(border);
    }

    removeClass(border) {
        this.element.classList.remove(border);
    }

    clearClass() {
        this.element.className = '';
    }

    moveTo(coordinate) {
        if (this.anime) this.anime.pause();
        anime({
            targets: this.element,
            translateX: (coordinate[1] - this.col) * 100 + '%',
            translateY: (coordinate[0] - this.row) * 100 + '%',
            duration: cardTransition,
            easing: 'easeOutQuart',
            complete: () => {
                this.anime = null;
            }
        })
    }

    goBack() {
        if (this.anime) this.anime.pause();
        anime({
            targets: this.element,
            translateX: 0,
            translateY: 0,
            duration: cardTransition,
            easing: 'easeOutQuart',
            complete: () => {
                this.anime = null;
            }
        });
    }
}

class ProjectCard {
    constructor(name, thumbnail, thumbnailText, coordinates, border) {
        this.name = name;
        this.thumbnail = thumbnail;
        this.border = border;
        this.coordinates = coordinates;

        this.parser = new DOMParser();

        this.element = this.parser.parseFromString(`
            <div id="${name}" class="project-card-container">
                <div class="project-card">
                    <div class="project-thumbnail-text no-select">
                        <span>${thumbnailText}</span>
                    </div>
                    <div class="project-thumbnail">
                        <img src="${thumbnail}" alt="${name}">
                    </div>
                </div>
            </div>
        `, 'text/html').body.firstChild;

        projectBar.appendChild(this.element);
        this.thumbnail = this.element.querySelector('.project-thumbnail');

        this.element.addEventListener('click', this.clickHandler.bind(this));
        this.element.addEventListener('mouseover', this.hoverHandler.bind(this));
        this.element.addEventListener('mouseout', this.unhoverHandler.bind(this));

        this.pixels = [];
        this.ignoreUnhover = false;

        shuffleArray(allIndexesArr);
        for(var i = 0 ; i < this.coordinates.length; i++) this.pixels.push(allPixels[allIndexesArr[i]]);

        this.initialX = null;
        this.initialY = null;
    }

    clickHandler() {
        if (selectedCard == this) return;

        this.element.classList.add('selected');

        if (selectedCard) {
            selectedCard.element.classList.remove('selected');
            selectedCard.ignoreUnhover = false;
            selectedCard.pixels.forEach(pixel => {
                pixel.clearClass();
            });
            selectedCard.movePixelsBack();
            selectedCard.moveBackOrigin();
        }
        selectedCard = this;
        this.pixels.forEach(pixel => {
            pixel.clearClass();
            pixel.addClass(this.border);
        });

        this.ignoreUnhover = true;
        this.movePixels();
        this.moveToCenter();
    }

    moveToCenter() {
        if (this.initialX == null) {
            const rect = this.thumbnail.getBoundingClientRect();
            const mainRect = projectGrid.getBoundingClientRect();

            this.initialX = ((mainRect.width/2 - rect.x - rect.width/2)/rect.width) * 100 + '%';
            this.initialY = ((mainRect.height/2 - rect.y - rect.height/2)/rect.height) * 100 + '%';
        }

        anime({
            targets: this.thumbnail,
            translateX: this.initialX,
            translateY: this.initialY,
            opacity: 1,
            /* scale: 2.2, */
            easing: 'easeOutQuart',
            duration: cardTransition/2,
        });
    }

    moveBackOrigin() {
        anime({
            targets: this.thumbnail,
            translateX: 0,
            translateY: 0,
            opacity: 0.2,
            /* scale: 1, */
            easing: 'easeOutQuart',
            duration: cardTransition/2,
        })
    }

    movePixels() {
        for(var i = 0; i < this.coordinates.length; i++) {
            this.pixels[i].moveTo(this.coordinates[i]);
        }
    }

    movePixelsBack() {
        for(var i = 0; i < this.coordinates.length; i++) {
            this.pixels[i].goBack();
        }
    }

    hoverHandler() {
        this.pixels.forEach(pixel => {
            pixel.clearClass();
            pixel.addClass(this.border);
        })
    }

    unhoverHandler() {
        if (this.ignoreUnhover) return;
        this.pixels.forEach(pixel => {
            pixel.clearClass();
        });

        if (selectedCard == null) return;
        selectedCard.pixels.forEach(pixel => {
            pixel.addClass(selectedCard.border);
        });
    }
}

