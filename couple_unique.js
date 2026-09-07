// --- AUDIO FUNCTION ---
function playAudio() {
    const audio = document.getElementById('specialAudio');
    if (audio.getAttribute('src') === 'path_to_audio_file.mp3') {
        alert("Upload the ringtone/voice file and link it in the HTML audio tag to play!");
    } else {
        audio.play();
    }
}

// --- QUIZ LOGIC ---
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

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const quizContent = document.getElementById("quiz-content");
const quizResult = document.getElementById("quiz-result");

function loadQuestion() {
    const currentQ = questions[currentQuestionIndex];
    questionText.innerText = currentQ.question;
    optionsContainer.innerHTML = "";

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.classList.add("option-btn");
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex) {
    if (selectedIndex === questions[currentQuestionIndex].answer) {
        score++;
    }
    
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    quizContent.style.display = "none";
    quizResult.style.display = "block";
    
    if (score > 2) {
        quizResult.innerHTML = "Okay… you actually know Manikandan. ❤️<br><span style='font-size:1rem; color:white;'>Score: " + score + "/" + questions.length + "</span>";
    } else {
        quizResult.innerHTML = "Bro… you clearly need to spend more time with him. 😂<br><span style='font-size:1rem; color:white;'>Score: " + score + "/" + questions.length + "</span>";
    }
}

// Initialize quiz
loadQuestion();

// --- MODAL / LIGHTBOX LOGIC FOR POLAROIDS ---
function openModal(imageSrc, captionText) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const caption = document.getElementById("modalCaption");

    modal.style.display = "block";
    modalImg.src = imageSrc;
    caption.innerHTML = captionText;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Automatically close the image pop-up if they click anywhere on the dark background
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}