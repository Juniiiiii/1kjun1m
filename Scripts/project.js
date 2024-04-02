const projectPage = document.querySelector('.project-page');  
const pixelGrid = projectPage.querySelector('.pixel-grid');
const projectBar = projectPage.querySelector('.bar');

const pixelRows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-rows'));
const pixelCols = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-cols'));

const cardTransition = 1000;

function pixelCoordToIndex(row, col) {
    return row * pixelCols + col;
}

let allIndexes = new Set(), allIndexesArr, allPixels = {};
let hoveredCard = null, clickedCard = null;

document.addEventListener('DOMContentLoaded', () => {
    for (var i = 0, newIndex ; i < minimumPixelCount; i++) {
        newIndex = Math.floor(Math.random() * pixelCols * pixelRows);
        while (allIndexes.has(newIndex)) newIndex = Math.floor(Math.random() * pixelCols * pixelRows);
        new Pixel(newIndex);
    }

    allIndexesArr = Array.from(allIndexes);

    new ProjectCard(
        'inside-the-mind-of',
        '/Media/insideTheMindOf.png',
        yellow, insideTheMindOfCoordinates
    );

    new ProjectCard(
        'our-voice',
        '/Media/ourVoice.png',
        red, ourVoiceCoordinates
    );

});

class Pixel {
    constructor(index) {
        this.index = index;
        this.row = Math.floor(index / pixelCols);
        this.col = index % pixelCols;

        this.element = document.createElement('div');

        pixelGrid.appendChild(this.element);

        this.element.style.gridArea = (this.row + 1) + ' / ' + (this.col + 1);

        allPixels[this.index] = this;
        /* pixelGrid[this.row][this.col] = this; */
        allIndexes.add(this.index);

        this.directions = {};
    }

    setDirection(name, coordinates) {
        this.directions[name] = coordinates;
    }

    moveTo(name) {
        if (this.anime) anime.remove(this.element);
        anime({
            targets: this.element,
            translateX: (this.directions[name][1] - this.col) * 100 + '%',
            translateY: (this.directions[name][0] - this.row) * 100 + '%',
            duration: cardTransition,
            easing: 'easeOutQuart',
            complete: () => {
                this.anime = null;
            }
        });
    }

    goBack() {
        if (this.anime) anime.remove(this.element);
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
    constructor(name, thumbnail, color, coordinates) {
        this.name = name;
        this.color = color;
        this.coordinates = coordinates;

        this.parser = new DOMParser();

        this.element = this.parser.parseFromString(`
            <div id="${name}" class="card">
                <div class="thumbnail">
                    <img src="${thumbnail}" alt="${name}">
                </div>
            </div>
        `, 'text/html').body.firstChild;

        this.element.style.setProperty('--card-color', color);

        projectBar.appendChild(this.element);

        this.element.addEventListener('click', this.clickHandler.bind(this));
        this.element.addEventListener('mouseover', this.hoverHandler.bind(this));
        this.element.addEventListener('mouseout', this.unhoverHandler.bind(this));

        this.pixels = [];
        shuffleArray(allIndexesArr);
        for(var i = 0 ; i < this.coordinates.length; i++) {
            allPixels[allIndexesArr[i]].setDirection(name, this.coordinates[i]);
            this.pixels.push(allPixels[allIndexesArr[i]]);
        }

        this.ignoreUnhover = false;
    }

    clickHandler() {
    }

    movePixels() {
        this.pixels.forEach(pixel => {
            pixel.moveTo(this.name);
        });
    }

    movePixelsBack() {
        this.pixels.forEach(pixel => {
            pixel.goBack();
        });
    }

    hoverHandler() {
        if (hoveredCard == this) return;

        if (hoveredCard) {
            hoveredCard.ignoreUnhover = false;
            hoveredCard.pixels.forEach(pixel => {
                pixel.element.style.setProperty('--pixel-color', ghost);
            });
            hoveredCard.movePixelsBack();
        }
        hoveredCard = this;

        hoveredCard.movePixels();

        this.pixels.forEach(pixel => {
            pixel.element.style.setProperty('--pixel-color', this.color);
        });
    }

    unhoverHandler() {
        /* if (this.ignoreUnhover) return;
        this.pixels.forEach(pixel => {
            pixel.element.style.setProperty('--pixel-color', ghost);
        }); */
    }
}