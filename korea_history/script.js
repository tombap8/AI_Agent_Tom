let allQuestions = [];
let sessionQuestions = [];
let currentIdx = 0;
let userAnswers = [];

// DOM Elements
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const progressText = document.getElementById('progress-text');
const categoryBadge = document.getElementById('category-badge');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');

// JSON 데이터 로드
async function fetchQuestions() {
  try {
    const response = await fetch('questions.json');
    allQuestions = await response.json();
    initQuiz();
  } catch (error) {
    console.error("데이터를 불러오지 못했습니다.", error);
    progressText.innerText = "데이터 로드 실패";
  }
}

// 무작위 섞기 함수
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 퀴즈 초기화 및 10문제 추출 (분야별 2개)
function initQuiz() {
  const categories = ['신라', '고려', '조선', '근대사', '현대사'];
  sessionQuestions = [];
  
  categories.forEach(cat => {
    const filtered = allQuestions.filter(q => q.category === cat);
    const shuffled = shuffleArray([...filtered]);
    sessionQuestions.push(...shuffled.slice(0, 2));
  });

  // 전체 10문제 순서 섞기
  shuffleArray(sessionQuestions);
  
  userAnswers = new Array(10).fill(null);
  currentIdx = 0;
  
  quizScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');
  
  renderQuestion();
}

// 문제 렌더링
function renderQuestion() {
  const q = sessionQuestions[currentIdx];
  progressText.innerText = `문제 ${currentIdx + 1} / 10`;
  categoryBadge.innerText = q.category;
  questionText.innerText = q.question;
  
  optionsContainer.innerHTML = '';
  q.options.forEach((opt, index) => {
    const label = document.createElement('label');
    label.className = 'option-label';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'option';
    radio.value = index;
    if (userAnswers[currentIdx] === index) {
      radio.checked = true;
    }
    
    radio.addEventListener('change', () => {
      userAnswers[currentIdx] = index;
      updateButtons();
    });
    
    label.appendChild(radio);
    label.appendChild(document.createTextNode(opt));
    optionsContainer.appendChild(label);
  });
  
  updateButtons();
}

// 하단 버튼 상태 업데이트
function updateButtons() {
  prevBtn.disabled = currentIdx === 0;
  
  // 정답을 선택하지 않으면 다음으로 넘어갈 수 없음
  const hasAnswered = userAnswers[currentIdx] !== null;
  
  if (currentIdx === sessionQuestions.length - 1) {
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
    submitBtn.disabled = !hasAnswered;
  } else {
    nextBtn.classList.remove('hidden');
    submitBtn.classList.add('hidden');
    nextBtn.disabled = !hasAnswered;
  }
}

// 결과 화면 렌더링
function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  progressText.innerText = "퀴즈 종료";
  
  let score = 0;
  const resultDetails = document.getElementById('result-details');
  resultDetails.innerHTML = '';
  
  sessionQuestions.forEach((q, index) => {
    const isCorrect = userAnswers[index] === q.answer;
    if (isCorrect) score += 10;
    
    const div = document.createElement('div');
    div.className = `result-item ${isCorrect ? 'correct' : 'incorrect'}`;
    
    const userAnswerText = q.options[userAnswers[index]];
    const correctAnswerText = q.options[q.answer];
    
    div.innerHTML = `
      <h4>${index + 1}번. ${isCorrect ? '정답' : '오답'} [${q.category}]</h4>
      <p>${q.question}</p>
      <p><small>내가 고른 답: ${userAnswerText}</small></p>
      ${!isCorrect ? `<p><small><b>정답: ${correctAnswerText}</b></small></p>` : ''}
    `;
    resultDetails.appendChild(div);
  });
  
  document.getElementById('score-display').innerText = `${score} / 100 점`;
}

// 이벤트 리스너
prevBtn.addEventListener('click', () => {
  if (currentIdx > 0) {
    currentIdx--;
    renderQuestion();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIdx < sessionQuestions.length - 1 && userAnswers[currentIdx] !== null) {
    currentIdx++;
    renderQuestion();
  }
});

submitBtn.addEventListener('click', () => {
  showResults();
});

restartBtn.addEventListener('click', () => {
  initQuiz();
});

// 시작
fetchQuestions();