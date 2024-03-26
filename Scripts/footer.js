const clock = document.querySelector('.clock');

const clockOffset = 7.5;
const numberRadius = 7;
const wordRadius = 7;

const dozen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const dozenWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const placements = [null, "full-name", "website", "github", null, null, null, "social", "linkedin", "email", null, null];

const clockNumbers = {};

const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');

const hourTransform = "translateX(50%) translateY(150%) rotate(";
const minuteTransform = "translateX(20%) translateY(350%) rotate(";
const secondTransform = "translateY(350%) rotate(";
let date;

const burstDistance = 60;
class LetterBurst {
    constructor(element) {
        if (!element) return;
        this.letters =  spanifyLetter(element);
        this.once = false;
    }

    burst() {
        anime({
            targets: this.letters,
            translateX: () => (Math.random() - 0.5) * burstDistance + "%",
            translateY: () => (Math.random() - 0.5) * burstDistance + "%",
            rotate: () => (Math.random() - 0.5) * 30,
            duration: 300,
            easing: 'easeOutExpo',
        });
    }

    unburst() {
        anime({
            targets: this.letters,
            translateX: 0,
            translateY: 0,
            rotate: 0,
            duration: 300,
            easing: 'easeOutExpo',
        });
    }
}

for (var i = 0; i < 12; i++) {
    clockNumbers[dozen[i]] = {
        element: document.getElementById(dozenWords[i]),
        hoverElement: document.getElementById(dozenWords[i]).querySelector('span'),
        placement: placements[i] ? document.getElementById(placements[i]) : null,
        burst: placements[i] ? new LetterBurst(document.getElementById(placements[i])) : null,
    };
}

document.addEventListener('DOMContentLoaded', () => {
    dozen.forEach(number => {
        clockNumbers[number].element.style.transform = `
            translateX(${Math.sin(number * Math.PI / 6) * numberRadius}em)
            translateY(${-Math.cos(number * Math.PI / 6) * numberRadius}em)`;
        
        if (clockNumbers[number].placement) {
            if (number < 6) {
                clockNumbers[number].placement.style.transform = `
                    translateX(calc(${Math.sin(number * Math.PI / 6) * wordRadius}em + ${clockOffset}em))
                    translateY(${-Math.cos(number * Math.PI / 6) * wordRadius}em)`;
            } else {
                clockNumbers[number].placement.style.transform = `
                    translateX(calc(${Math.sin(number * Math.PI / 6) * wordRadius}em - ${clockOffset}em))
                    translateY(${-Math.cos(number * Math.PI / 6) * wordRadius}em)`;
            }
        }

        if (clockNumbers[number].burst) {
            clockNumbers[number].hoverElement.addEventListener('mouseover', () => {
                clockNumbers[number].burst.burst();
            });

            clockNumbers[number].hoverElement.addEventListener('mouseout', () => {
                clockNumbers[number].burst.unburst();
            });
        }
    });

    new AdjustingInterval(() => {
        date = new Date();

        hourHand.style.transform = hourTransform + ((date.getHours() % 12) * 30 + 90) + 'deg)';
        minuteHand.style.transform = minuteTransform + (date.getMinutes() * 6 + 90) + 'deg)';
        secondHand.style.transform = secondTransform + (date.getSeconds() * 6 + 90) + 'deg)';
    }, 250, null).start();
});