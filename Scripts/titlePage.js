let titleLines, titleWrapper, prevLine, newLine, maxLineScroll = (5/12), titlePageIsIntersecting = false,
titleLineRadius = 1, titleLineShowing = new Set([]), titleLineHide = {};

document.addEventListener('DOMContentLoaded', function() {
    rotateWord(document.querySelectorAll('#made-in-words p'), 
                document.getElementById('made-in-words'));
    rotateWord(document.querySelectorAll('#designed-in-words p'),
                document.getElementById('designed-in-words'));

    titleWrapper = document.querySelector('.title-line-wrapper');
    titleLines = document.querySelectorAll('.title-line-wrapper .no-select');

    for (let i = 0 ;i < titleLines.length; i++) {
        titleLines[i].style.transform = 'translateY(-' + (0.8 + 0.5 * i) + 'em)';
        titleLineHide[i] = null;
    }
    titleLineShowing.add(0);

    window.addEventListener('scroll', function() {
        if (titlePageIsIntersecting) {
            showTitleLines(window.scrollY);
        }
    });

    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            titlePageIsIntersecting = entry.isIntersecting;
        });
    });
    observer.observe(titleWrapper);
});

function hideTitleLines(except) {
    titleLineShowing.forEach(line => {
        if (titleLineHide[line]) {
            clearTimeout(titleLineHide[line]);
        }
        titleLineHide[line] = setTimeout(() => {
            titleLines[line].classList.remove('show');
            titleLineHide[line] = null;
        }, 300);
    });
    titleLineShowing.clear();

    if (titleLineHide[except]) {
        clearTimeout(titleLineHide[except]);
        titleLineHide[except] = null;
    }
    for (let i = Math.min(except, prevLine); i <= Math.max(except, prevLine); i++) {
        titleLineShowing.add(i);
        titleLines[i].classList.add('show');
    }

    prevLine = except;
}

function showTitleLines(currentY) {
    if (currentY <= 0) hideTitleLines(0); 
    else if (currentY >= titleWrapper.offsetHeight * maxLineScroll) hideTitleLines(titleLines.length - 1);
    else {
        newLine = Math.floor(currentY / (titleWrapper.offsetHeight * maxLineScroll) * (titleLines.length - 1));
        if (!titleLineShowing.has(newLine)) hideTitleLines(newLine);
    }
}

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
