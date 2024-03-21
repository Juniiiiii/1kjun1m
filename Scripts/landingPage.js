const landingLines = document.querySelectorAll('.main-title span');

document.addEventListener('DOMContentLoaded', function() {
    rotateWord(document.querySelectorAll('#made-in-words p'), 
                document.getElementById('made-in-words'));
    rotateWord(document.querySelectorAll('#designed-in-words p'),
                document.getElementById('designed-in-words'));
});

function rotateWord(words, wordWrapper) {
    words.forEach(word => {
        var letters = word.textContent.split('');
        word.innerHTML = '';
        letters.forEach(letter => {
            var span = document.createElement('span');
            span.textContent = letter;
            span.className = 'letter';
            word.appendChild(span);
        });
    });

    var curWord = 0;
    words[curWord].style.opacity = 1;

    var applyRotation = function() {
        var currentWord = words[curWord];
        var nextWord = words[(curWord + 1) % words.length];

        Array.from(currentWord.children).forEach((letter, i) => {
            setTimeout(() => {
                letter.className = "letter out";
            }, i * 80);
        });

        nextWord.style.opacity = 1;
        Array.from(nextWord.children).forEach((letter, i) => {
            letter.className = "letter behind";
            setTimeout(() => {
                letter.className = "letter in";
            }, 340 + i * 80);
        });
        curWord = (curWord + 1) % words.length;
    }

    var maxWidth = 0;
    words.forEach(word => {
        var wordWidth = word.offsetWidth;
        if (wordWidth > maxWidth) {
            maxWidth = wordWidth;
        }
    });

    wordWrapper.style.width = maxWidth + 'px';

    applyRotation();
    setInterval(applyRotation, 5000);
}

window.addEventListener("resize", () => {
    var maxWidth = 0;
    var words = document.querySelectorAll('#made-in-words p');
    words.forEach(word => {
        var wordWidth = word.offsetWidth;
        if (wordWidth > maxWidth) {
            maxWidth = wordWidth;
        }
    });
    
    document.getElementById('made-in-words').style.width = maxWidth + 'px';
});
