const projectPage = document.querySelector('.project-page');  
const pixelGrid = projectPage.querySelector('.pixel-grid');
const projectBar = projectPage.querySelector('.bar');
const pictureContainer = projectPage.querySelector('.project-container .picture-container');
const paperContainer = projectPage.querySelector('.project-container .paper-container');

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
        '/Media/insideTheMindOf.webp', "inside the mind of", white,
        yellow, insideTheMindOfCoordinates,
        insideTheMindOfText[0], insideTheMindOfText[1]
    );

    new ProjectCard(
        'our-voice',
        '/Media/ourVoice.webp', "OurVoice", black,
        red, ourVoiceCoordinates,
        ourVoiceText[0], ourVoiceText[1]
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
    constructor(name, thumbnail, caption, captionColor, color, coordinates, outerText, innerText) {
        this.name = name;
        this.color = color;
        this.captionColor = captionColor;
        this.coordinates = coordinates;
        this.moved = false;

        this.parser = new DOMParser();

        this.element = this.parser.parseFromString(`
            <div id="${name}" class="card">
                <div class="thumbnail">
                    <img src="${thumbnail}" alt="${name}">
                </div>
                <div class="caption">
                    ${caption}
                </div>
                <div class="close">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#fef9ef" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></g></svg>
                </div>
            </div>
        `, 'text/html').body.firstChild;

        this.element.style.setProperty('--card-color', color);
        this.element.style.setProperty('--default-caption', captionColor);
        this.thumbnail = this.element.querySelector('.thumbnail');

        this.close = this.element.querySelector('.close');
        this.close.style.backgroundColor = rgbaString(hexToRgb(color), 0.2);

        this.caption = this.element.querySelector('.caption');

        projectBar.appendChild(this.element);

        this.thumbnail.addEventListener('click', this.clickHandler.bind(this));
        this.thumbnail.addEventListener('mouseover', this.hoverHandler.bind(this));
        this.thumbnail.addEventListener('mouseout', this.unhoverHandler.bind(this));

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

        this.paper = this.parser.parseFromString(`
            <div class="paper">
                <div class="outer">
                    <span>${outerText}</span>
                </div>
                <div class="inner">
                    <span>${innerText}</span>
                </div>
            </div>
        `, 'text/html').body.firstChild;

        paperContainer.appendChild(this.paper);

        this.inner = this.paper.querySelector('.inner');
        this.inner.addEventListener('click', this.innerHoverEffect.bind(this));

        this.inner.style.backgroundColor = color;
    }

    innerHoverEffect() {
        if (this.inner.classList.contains('hover-effect')) {
            this.inner.classList.remove('hover-effect');
        } else {
            this.inner.classList.add('hover-effect');
        }
    }

    closingSequence() {
        this.close.removeEventListener('click', this.closeHandler.bind(this));

        this.element.classList.remove('clicked');

        this.close.classList.remove('show');

        this.picture.classList.remove('show');
        this.picture.classList.remove('bot');

        this.paper.classList.remove('show');
        this.paper.classList.remove('bot');

        this.picture.style.setProperty('--gravity-rotation', `${Math.random() * 80 - 40}deg`);
        this.picture.style.setProperty('--gravity-y', `-${Math.random() * 10 + 20}vh`);
        this.picture.style.setProperty('--gravity-x', `${Math.random() * 40 - 20}vw`);
        this.picture.classList.add('fall');

        this.paper.style.setProperty('--gravity-rotation', `${Math.random() * 80 - 40}deg`);
        this.paper.style.setProperty('--gravity-y', `-${Math.random() * 10 + 20}vh`);
        this.paper.style.setProperty('--gravity-x', `${Math.random() * 40 - 20}vw`);
        this.paper.classList.add('fall');

        if (this.moved) {
            this.movePixelsBack();
            this.pixels.forEach(pixel => {
                pixel.element.style.setProperty('--pixel-color', ghost);
            });
        }
    }

    openingSequence() {
        this.close.addEventListener('click', this.closeHandler.bind(this));

        this.element.classList.add('clicked');

        this.close.classList.add('show');

        this.picture.classList.add('bot');
        this.picture.classList.remove('fall');
        this.picture.classList.add('show');

        this.paper.classList.add('bot');
        this.paper.classList.remove('fall');
        this.paper.classList.add('show');

        if (!this.moved) {
            this.movePixels();
            this.pixels.forEach(pixel => {
                pixel.element.style.setProperty('--pixel-color', this.color);
            });
        }
    }

    closeHandler() {
        this.closingSequence();
        clickedCard = null;
    }

    clickHandler() {
        if (clickedCard == this) return;

        if (clickedCard) clickedCard.closingSequence();
        this.openingSequence();

        clickedCard = this;
    }

    movePixels() {
        this.pixels.forEach(pixel => {
            pixel.moveTo(this.name);
        });
        this.moved = true;
    }

    movePixelsBack() {
        this.pixels.forEach(pixel => {
            pixel.goBack();
        });
        this.moved = false;
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

        this.movePixels();

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