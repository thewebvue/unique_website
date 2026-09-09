/* =========================================================
   THE MAN BEHIND THE NAME — Manikandan
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    runOpeningSequence();
    duplicateFilmstrip();
    initQuiz();
    initPuzzle();
    initTimelineReveal();
    initTypewriter();
    initNavToggle();
});

/* ---------- MOBILE NAV TOGGLE ---------- */
function initNavToggle() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    const closeMenu = () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
    };

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ---------- OPENING SEQUENCE ---------- */
function runOpeningSequence() {
    const intro = document.getElementById('openingIntro');
    const countEl = document.getElementById('introCount');
    const flash = document.getElementById('clapFlash');
    if (!intro || !countEl) return;

    document.body.style.overflow = 'hidden';

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        intro.classList.add('hide');
        document.body.style.overflow = '';
        setTimeout(() => intro.remove(), 300);
        return;
    }

    let count = 5;
    const tick = setInterval(() => {
        count--;
        if (count > 0) {
            countEl.textContent = count;
        } else {
            clearInterval(tick);
            countEl.textContent = '';
            intro.classList.add('clap');
            flash.classList.add('flash');
            setTimeout(() => {
                intro.classList.add('hide');
                document.body.style.overflow = '';
                setTimeout(() => intro.remove(), 650);
            }, 420);
        }
    }, 380);
}

/* ---------- FILM STRIP: duplicate items for seamless loop ---------- */
function duplicateFilmstrip() {
    const track = document.getElementById('filmstripTrack');
    if (!track) return;
    track.innerHTML += track.innerHTML;
}

/* ---------- AUDIO ---------- */
function playAudio() {
    const audio = document.getElementById('specialAudio');
    if (audio.getAttribute('src') === 'path_to_audio_file.mp3') {
        alert("Upload the ringtone/voice file and link it in the HTML audio tag to play!");
    } else {
        audio.play();
    }
}

/* ---------- PUZZLE: slide the tiles to rebuild the picture ---------- */
const PUZZLE_DIM = 3;
let puzzleState = [];
let puzzleGridEl, puzzleStatusEl;

function initPuzzle() {
    puzzleGridEl = document.getElementById('puzzleGrid');
    puzzleStatusEl = document.getElementById('puzzleStatus');
    const shuffleBtn = document.getElementById('puzzleShuffle');
    if (!puzzleGridEl) return;

    puzzleState = Array.from({ length: PUZZLE_DIM * PUZZLE_DIM }, (_, i) => i);
    shufflePuzzle();
    renderPuzzle();

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            puzzleState = Array.from({ length: PUZZLE_DIM * PUZZLE_DIM }, (_, i) => i);
            shufflePuzzle();
            renderPuzzle();
            puzzleStatusEl.textContent = '';
            puzzleGridEl.classList.remove('solved');
        });
    }
}

function shufflePuzzle() {
    // perform random legal slides from the solved state so it always stays solvable
    const blankValue = PUZZLE_DIM * PUZZLE_DIM - 1;
    for (let m = 0; m < 150; m++) {
        const blankIndex = puzzleState.indexOf(blankValue);
        const neighbors = getNeighborIndices(blankIndex);
        const swapWith = neighbors[Math.floor(Math.random() * neighbors.length)];
        [puzzleState[blankIndex], puzzleState[swapWith]] = [puzzleState[swapWith], puzzleState[blankIndex]];
    }
}

function getNeighborIndices(index) {
    const row = Math.floor(index / PUZZLE_DIM);
    const col = index % PUZZLE_DIM;
    const neighbors = [];
    if (row > 0) neighbors.push(index - PUZZLE_DIM);
    if (row < PUZZLE_DIM - 1) neighbors.push(index + PUZZLE_DIM);
    if (col > 0) neighbors.push(index - 1);
    if (col < PUZZLE_DIM - 1) neighbors.push(index + 1);
    return neighbors;
}

function renderPuzzle() {
    const blankValue = PUZZLE_DIM * PUZZLE_DIM - 1;
    puzzleGridEl.innerHTML = '';

    puzzleState.forEach((value, index) => {
        const tile = document.createElement('button');
        tile.classList.add('puzzle-tile');

        if (value === blankValue) {
            tile.classList.add('blank');
        } else {
            const col = value % PUZZLE_DIM;
            const row = Math.floor(value / PUZZLE_DIM);
            const step = 100 / (PUZZLE_DIM - 1);
            tile.style.backgroundPosition = `${col * step}% ${row * step}%`;
            tile.setAttribute('aria-label', 'Puzzle tile');
            tile.addEventListener('click', () => handleTileClick(index));
        }
        puzzleGridEl.appendChild(tile);
    });
}

function handleTileClick(index) {
    const blankValue = PUZZLE_DIM * PUZZLE_DIM - 1;
    const blankIndex = puzzleState.indexOf(blankValue);
    const neighbors = getNeighborIndices(blankIndex);

    if (!neighbors.includes(index)) return;

    [puzzleState[blankIndex], puzzleState[index]] = [puzzleState[index], puzzleState[blankIndex]];
    renderPuzzle();

    if (isPuzzleSolved()) {
        puzzleGridEl.classList.add('solved');
        puzzleStatusEl.textContent = "Picture's clear now. Just like this scene. ❤️";
    }
}

function isPuzzleSolved() {
    return puzzleState.every((value, index) => value === index);
}

/* ---------- QUIZ / SCREEN TEST ---------- */
const questions = [
    {
        question: "What happens to his phone battery most often?",
        options: ["Always 100% 🔋", "Never below 50%", "0% — as usual 💀", "Power bank king"],
        answer: 2
    },
    {
        question: "His emergency hunger solution?",
        options: ["Idli Sambar", "VADA PAV 🌶️", "Maggie", "Dosa"],
        answer: 1
    },
    {
        question: "Which soundtrack owns him?",
        options: ["A.R. Rahman", "Anirudh", "Ilaiyaraaja 🎵", "Yuvan"],
        answer: 2
    },
    {
        question: "What's his second big dream?",
        options: ["Start a business", "Direct a movie 🎬", "Travel the world", "Become a chef"],
        answer: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;
let quizLocked = false;

let questionText, optionsContainer, quizContent, quizResult, reelProgress;

function initQuiz() {
    questionText = document.getElementById("question-text");
    optionsContainer = document.getElementById("options-container");
    quizContent = document.getElementById("quiz-content");
    quizResult = document.getElementById("quiz-result");
    reelProgress = document.getElementById("reelProgress");
    if (!questionText) return;

    buildReelDots();
    loadQuestion();
}

function buildReelDots() {
    reelProgress.innerHTML = "";
    questions.forEach(() => {
        const dot = document.createElement("span");
        dot.classList.add("reel-dot");
        reelProgress.appendChild(dot);
    });
}

function updateReelDots() {
    const dots = reelProgress.querySelectorAll(".reel-dot");
    dots.forEach((dot, i) => {
        dot.classList.toggle("done", i < currentQuestionIndex);
    });
}

function loadQuestion() {
    quizLocked = false;
    updateReelDots();
    const currentQ = questions[currentQuestionIndex];
    questionText.innerText = currentQ.question;
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btn) {
    if (quizLocked) return;
    quizLocked = true;

    const correctIndex = questions[currentQuestionIndex].answer;
    const allBtns = optionsContainer.querySelectorAll(".option-btn");

    if (selectedIndex === correctIndex) {
        score++;
        btn.classList.add("correct-flash");
    } else {
        btn.classList.add("wrong-flash");
        allBtns[correctIndex].classList.add("correct-flash");
    }

    allBtns.forEach(b => b.disabled = true);

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            updateReelDots();
            showResult();
        }
    }, 650);
}

function showResult() {
    quizContent.style.display = "none";
    quizResult.style.display = "block";

    const scoreLine = `<span class="score-line">Score: ${score}/${questions.length}</span>`;

    if (score > 2) {
        quizResult.innerHTML = "Okay… you actually know Manikandan. ❤️" + scoreLine;
    } else {
        quizResult.innerHTML = "Bro… you clearly need to spend more time with him. 😂" + scoreLine;
    }
}

/* ---------- MODAL / LIGHTBOX (images + video reveals) ---------- */
function openModal(src, captionText, type = 'image') {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const modalVideo = document.getElementById("modalVideo");
    const caption = document.getElementById("modalCaption");

    modal.style.display = "block";
    caption.innerHTML = captionText;

    if (type === 'video') {
        modalImg.style.display = "none";
        modalImg.src = "";
        modalVideo.style.display = "block";
        modalVideo.src = src;
        modalVideo.currentTime = 0;
        modalVideo.play().catch(() => { /* autoplay may be blocked; user can press play */ });
    } else {
        modalVideo.pause();
        modalVideo.style.display = "none";
        modalVideo.src = "";
        modalImg.style.display = "block";
        modalImg.src = src;
    }
}

function closeModal() {
    const modalVideo = document.getElementById("modalVideo");
    modalVideo.pause();
    document.getElementById("imageModal").style.display = "none";
}

window.onclick = function (event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ---------- TIMELINE: reveal frames + scroll-linked gold fill ---------- */
function initTimelineReveal() {
    const track = document.getElementById('timelineTrack');
    if (!track) return;
    const frames = track.querySelectorAll('.timeline-frame');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
    }, { threshold: 0.4 });
    frames.forEach(f => observer.observe(f));

    const onScroll = () => {
        const rect = track.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const total = rect.height;
        let visible = viewportH * 0.75 - rect.top;
        visible = Math.max(0, Math.min(visible, total));
        const pct = total > 0 ? (visible / total) * 100 : 0;
        track.style.setProperty('--fill', pct + '%');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ---------- FINALE: typewriter dedication ---------- */
function initTypewriter() {
    const el = document.getElementById('typewriterText');
    const wish = document.getElementById('bigWish');
    if (!el) return;

    const lines = [
        "Keep chasing the things that make you feel alive.",
        "Keep the people you love close.",
        "Keep listening to your music.",
        "Keep dreaming about that first film.",
        "",
        "And someday… we'll all be waiting for",
        "\u201cA Film by CA Manikandan.\u201d 🎬"
    ];
    const fullText = lines.join('\n');
    let started = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                typeText(el, fullText, wish);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(el);
}

function typeText(el, text, wish) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        el.innerHTML = text.replace(/\n/g, '<br>');
        if (wish) wish.classList.add('show');
        return;
    }

    let i = 0;
    const cursor = '<span class="tw-cursor"></span>';
    const speed = 28;

    function step() {
        if (i <= text.length) {
            const shown = text.substring(0, i).replace(/\n/g, '<br>');
            el.innerHTML = shown + cursor;
            i++;
            setTimeout(step, speed);
        } else {
            el.innerHTML = text.replace(/\n/g, '<br>');
            if (wish) setTimeout(() => wish.classList.add('show'), 300);
        }
    }
    step();
}
