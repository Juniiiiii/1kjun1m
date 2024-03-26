const projectGrid = document.querySelector('.project-grid');
const projectBar = document.querySelector('.project-bar');
const projectPage = document.querySelector('.project-page');
const projectPaperWrapper = document.querySelector('.project-page .paper-wrapper');

const projectRows = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--project-rows')) - 1;
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
    for (var i = 0; i < minimumPixelCount; i++) {
        newIndex = Math.floor(Math.random() * projectCols * projectRows);
        while (allIndexes.has(newIndex)) newIndex = Math.floor(Math.random() * projectCols * projectRows);
        new Pixel(newIndex);
    }

    allIndexesArr = Array.from(allIndexes);

    allProjectCards.push(
        new ProjectCard(
            'ourVoice', 
            '/Media/ourVoice.png', 
            'OurVoice', 
            ourVoiceCoordinates,
            red,
            'red-border',
            ourVoicePictures,
            ourVoiceCaptions,
            ourVoiceOuterTexts,
            ourVoiceInnerTexts
    ));
    allProjectCards.push(
        new ProjectCard(
            'insideTheMindOf', 
            '/Media/insideTheMindOf.png', 
            'inside the mind of', 
            insideTheMindOfCoordinates, 
            yellow,
            'yellow-border',
            insideTheMindOfPictures,
            insideTheMindOfCaptions,
            insideTheMindOfOuterTexts,
            insideTheMindOfInnerTexts
    ));

    allProjectCards[0].paper.element.classList.remove('hidden');

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
    constructor(name, thumbnail, thumbnailText, coordinates, color, border, pictures, captions, outerTexts, innerTexts) {
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

        this.paper = new ProjectPaper(name + "-paper", color, border, pictures, captions, outerTexts, innerTexts);
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
        }
        selectedCard = this;
        this.pixels.forEach(pixel => {
            pixel.clearClass();
            pixel.addClass(this.border);
        });

        this.ignoreUnhover = true;
        this.movePixels();
        this.paper.show(this.thumbnail);
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

class ProjectPaper {
    constructor(name, color, border, pictures, captions, outerTexts, innerTexts) {
        this.color = color;
        this.border = border;

        this.parser = new DOMParser();

        let pictureString = "";

        for (var i = 0 ; i < pictures.length; i++) {
            pictureString += `
            <div class="image-wrapper">
                <div class="image">
                    <img src="${pictures[i]}" alt="${name}-picture-${i}">
                    <span>${captions[i]}</span>
                </div>
            </div>
            `;
        }

        let textString = "";

        for (var i = 0 ; i < outerTexts.length; i++) {
            if (innerTexts[i]) {
                textString += `
                    <div class="paragraph">
                        <span class="outer">${outerTexts[i]}</span>
                        <span class="inner">${innerTexts[i]}</span>
                    </div>
                `;
            } else {
                textString += `
                    <div class="paragraph">
                        <span class="outer">${outerTexts[i]}</span>
                    </div>
                `;
            }
        }

        this.element = this.parser.parseFromString(`
            <div id="${name}" class="paper hidden">
                <div class="paper-images">
                    ${pictureString}
                </div>
                <div class="paper-texts">
                    ${textString}
                </div>
            </div>
        `, 'text/html').body.firstChild;

        this.element.querySelectorAll('.paragraph .outer').forEach(outer => {
            firstWordSpan(outer);
        });

        this.element.querySelectorAll('.paragraph .inner').forEach(inner => {
            /* firstWordSpan(inner); */
            inner.style.backgroundColor = color;
        });

        projectPaperWrapper.appendChild(this.element);
    }
}