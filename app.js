const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");
const timeDisplay = document.getElementById("time");

let timerInterval = null;
const TIME_LIMIT = 5; // 5 seconds per question

const quizQuestions = [
  {
    question: "Which anime features a character named Monkey D. Luffy?",
    answers: [
      { text: "Dragon Ball", isCorrect: false },
      { text: "Naruto", isCorrect: false },
      { text: "One Piece", isCorrect: true },
      { text: "Bleach", isCorrect: false },
    ],
  },
  {
    question: "What is the name of the main titan form of Eren Yeager?",
    answers: [
      { text: "Armored Titan", isCorrect: false },
      { text: "Beast Titan", isCorrect: false },
      { text: "Attack Titan", isCorrect: true },
      { text: "Colossal Titan", isCorrect: false },
    ],
  },
  {
    question: "Which anime is about alchemy and the Philosopher's Stone?",
    answers: [
      { text: "Naruto", isCorrect: false },
      { text: "Demon Slayer", isCorrect: false },
      { text: "Bleach", isCorrect: false },
      { text: "Fullmetal Alchemist", isCorrect: true },
    ],
  },
  {
    question: "Who is known as the 'Copy Ninja' in Naruto?",
    answers: [
      { text: "Itachi Uchiha", isCorrect: false },
      { text: "Minato Namikaze", isCorrect: false },
      { text: "Kakashi Hatake", isCorrect: true },
      { text: "Sasuke Uchiha", isCorrect: false },
    ],
  },
  {
    question: "Which anime features a notebook that can kill people?",
    answers: [
      { text: "One Punch Man", isCorrect: false },
      { text: "Tokyo Ghoul", isCorrect: false },
      { text: "Death Note", isCorrect: true },
      { text: "Attack on Titan", isCorrect: false },
    ],
  },
];

let currentQuestionIndex = 0;
let score = 0;
let answerDisable = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function startTimer() {
  clearTimer();
  let timeRemaining = TIME_LIMIT;
  timeDisplay.textContent = `${timeRemaining}`;

  timerInterval = setInterval(() => {
    timeRemaining--;
    timeDisplay.textContent = `${timeRemaining}`;

    if (timeRemaining <= 0) {
      clearTimer();
      answerDisable = true;
      setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
          showQuestion();
        } else {
          showResult();
        }
      }, 500);
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startQuiz() {
  clearTimer();
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion();
}

function showQuestion() {
  answerDisable = false;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";

  const shuffledAnswers = shuffleArray(currentQuestion.answers);

  shuffledAnswers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.textContent = answer.text;
    btn.classList.add("answer-btn");
    btn.dataset.correct = answer.isCorrect;
    btn.addEventListener("click", selectAnswer);
    answersContainer.appendChild(btn);
  });

  startTimer();
}

function selectAnswer(event) {
  if (answerDisable) return;

  clearTimer();
  answerDisable = true;
  const selectedbtn = event.target;
  const isCorrect = selectedbtn.dataset.correct === "true";

  Array.from(answersContainer.children).forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    } else if (btn === selectedbtn) {
      btn.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  clearTimer();
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;

  const percentage = (score / quizQuestions.length) * 100;

  if (percentage === 100) {
    resultMessage.textContent = "Perfect! You're a genius!";
  } else if (percentage >= 80) {
    resultMessage.textContent = "Great job! You know your stuff!";
  } else if (percentage >= 60) {
    resultMessage.textContent = "Good effort! Keep learning!";
  } else if (percentage >= 40) {
    resultMessage.textContent = "Not bad! Try again to improve!";
  } else {
    resultMessage.textContent = "Keep studying! You'll get better!";
  }
}

function restartQuiz() {
  resultScreen.classList.remove("active");

  startQuiz();
}
