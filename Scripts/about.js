const eyePath = anime.path('.about-page .painting path');
/* const curiosityDesginer = document.querySelector('.about-page .curiosity-designer'); */

document.addEventListener('DOMContentLoaded', () => {
    var eyeScroll = new PercentScroll(
        document.querySelector('.about-page'),
        0.3, 1, (percentage) => {
            leftEye.progress(percentage);
            rightEye.progress(percentage);
        }
    );

    document.addEventListener('aboutIntersection', () => {
        if (aboutIntersecting) eyeScroll.start();
        else eyeScroll.stop();
    });
});

class Eye {
    constructor(start, startString, upper, upperString, lower, lowerString, end, endString) {
        this.start = start;
        this.startString = startString;
        this.upper = upper;
        this.upperString = upperString;
        this.lower = lower;
        this.lowerString = lowerString;
        this.end = end;
        this.endString = endString;

        this.totalLength = startString.length + upperString.length + lowerString.length + endString.length;
    }

    progress(percentage) {
        this.current = clamp(Math.floor(percentage * this.totalLength), 0, this.totalLength);

        if (this.current < this.startString.length) {
            this.start.textContent = this.startString.substring(0, this.current);
            this.upper.textContent = '';
            this.lower.textContent = '';
            this.end.textContent = '';
        } else if (this.current < this.startString.length + this.upperString.length) {
            this.start.textContent = this.startString;
            this.upper.textContent = this.upperString.substring(0, this.current - this.startString.length);
            this.lower.textContent = '';
            this.end.textContent = '';
        } else if (this.current < this.startString.length + this.upperString.length + this.lowerString.length) {
            this.start.textContent = this.startString;
            this.upper.textContent = this.upperString;
            this.lower.textContent = this.lowerString.substring(0, this.current - this.startString.length - this.upperString.length);
            this.end.textContent = '';
        } else {
            this.start.textContent = this.startString;
            this.upper.textContent = this.upperString;
            this.lower.textContent = this.lowerString;
            this.end.textContent = this.endString.substring(0, this.current - this.startString.length - this.upperString.length - this.lowerString.length);
        }
    }
}

const leftEye = new Eye(
    document.querySelector('.about-page .left.eye .start'), 'C',
    document.querySelector('.about-page .left.eye .upper-path textPath'), 'urios',
    document.querySelector('.about-page .left.eye .lower-path textPath'), 'reativ',
    document.querySelector('.about-page .left.eye .end'), 'ity'
);

const rightEye = new Eye(
    document.querySelector('.about-page .right.eye .start'), 'D',
    document.querySelector('.about-page .right.eye .upper-path textPath'), 'evelop',
    document.querySelector('.about-page .right.eye .lower-path textPath'), 'esign',
    document.querySelector('.about-page .right.eye .end'), 'er'
);