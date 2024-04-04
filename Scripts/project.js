const projectPage = document.querySelector('.project-page');  
const pixelGrid = projectPage.querySelector('.pixel-grid');
const projectBar = projectPage.querySelector('.bar');
const pictureContainer = projectPage.querySelector('.paper-container .picture-container');
const paperContainer = projectPage.querySelector('.paper-container .text-container');

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
        '/Media/ourVoice.png',
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

        this.picture = this.parser.parseFromString(`
            <div class="picture">
                <img src="${thumbnail}" alt="${name}">
            </div>
        `, 'text/html').body.firstChild;

        pictureContainer.appendChild(this.picture);
    }

    clickHandler() {
        if (clickedCard == this) return;

        if (clickedCard) {
            clickedCard.element.classList.remove('clicked');
            clickedCard.picture.classList.remove('show');
            clickedCard.picture.classList.remove('bot');
            clickedCard.picture.style.setProperty('--gravity-rotation', `${Math.random() * 80 - 40}deg`);
            clickedCard.picture.style.setProperty('--gravity-y', `-${Math.random() * 10 + 20}vh`);
            clickedCard.picture.style.setProperty('--gravity-x', `${Math.random() * 40 - 20}vw`);
            clickedCard.picture.classList.add('fall');
        }

        this.element.classList.add('clicked');
        this.picture.classList.add('bot');
        this.picture.classList.remove('fall');
        this.picture.classList.add('show');

        clickedCard = this;
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
        if (hoveredCard == this || clickedCard == this) return;

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
        if (clickedCard && clickedCard != this) {
            this.pixels.forEach(pixel => {
                pixel.element.style.setProperty('--pixel-color', ghost);
            });
            this.movePixelsBack();

            clickedCard.pixels.forEach(pixel => {
                pixel.element.style.setProperty('--pixel-color', clickedCard.color);
            });
            clickedCard.movePixels();
            
            hoveredCard = clickedCard;
        }
    }
}