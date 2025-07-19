let questions = []
let currentQuestionIndex = 0
let score = 0
let timer
let timeLeft = 15
let selectedCategory = ''
let numberOfQuestions = 5

function startQuiz() {
  selectedCategory = document.getElementById('category').value
  numberOfQuestions = parseInt(document.getElementById('question-count').value)
  fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${selectedCategory}&type=multiple`)
    .then(res => res.json())
    .then(data => {
      questions = data.results.map(q => {
        const options = [...q.incorrect_answers]
        const randomIndex = Math.floor(Math.random() * 4)
        options.splice(randomIndex, 0, q.correct_answer)
        return {
          q: decodeHTML(q.question),
          options: options.map(decodeHTML),
          answer: decodeHTML(q.correct_answer)
        }
      })
      score = 0
      currentQuestionIndex = 0
      document.getElementById('config-container').classList.add('hide')
      document.getElementById('quiz-container').classList.remove('hide')
      loadQuestion()
    })
}

function loadQuestion() {
  if (currentQuestionIndex >= questions.length) return showResults()
  timeLeft = 15
  document.getElementById('timer').textContent = timeLeft
  startTimer()
  const q = questions[currentQuestionIndex]
  document.getElementById('question-text').textContent = q.q
  const container = document.getElementById('options-container')
  container.innerHTML = ''
  q.options.forEach(option => {
    const btn = document.createElement('button')
    btn.textContent = option
    btn.onclick = () => checkAnswer(option, q.answer, btn)
    container.appendChild(btn)
  })
  document.getElementById('question-status').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`
}

function checkAnswer(selected, correct, button) {
  clearInterval(timer)
  const buttons = document.querySelectorAll('#options-container button')
  buttons.forEach(btn => {
    btn.disabled = true
    if (btn.textContent === correct) btn.classList.add('correct')
    else if (btn.textContent === selected) btn.classList.add('incorrect')
  })
  if (selected === correct) {
    score++
  }
  setTimeout(() => {
    currentQuestionIndex++
    loadQuestion()
  }, 1200)
}

function showResults() {
  document.getElementById('quiz-container').classList.add('hide')
  document.getElementById('result-container').classList.remove('hide')
  document.getElementById('score').textContent = `You scored ${score} out of ${questions.length}`
  const high = localStorage.getItem('highScore') || 0
  if (score > high) localStorage.setItem('highScore', score)
  document.getElementById('high-score').textContent = localStorage.getItem('highScore')
}

function restartQuiz() {
  document.getElementById('result-container').classList.add('hide')
  document.getElementById('config-container').classList.remove('hide')
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--
    document.getElementById('timer').textContent = timeLeft
    if (timeLeft <= 0) {
      clearInterval(timer)
      checkAnswer('', questions[currentQuestionIndex].answer)
    }
  }, 1000)
}

function decodeHTML(html) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('high-score').textContent = localStorage.getItem('highScore') || 0
})