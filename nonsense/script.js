let allQuestions = [];
let sessionQuestions = [];
let currentIdx = 0;
let score = 0;
let currentSelectedOption = null;
let isAnswerChecked = false;

// DOM Elements
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const progressText = document.getElementById('progress-text');
const questionText = document.getElementById('question-text');
const hintArea = document.getElementById('hint-area');
const hintText = document.getElementById('hint-text');
const optionsContainer = document.getElementById('options-container');
const feedbackArea = document.getElementById('feedback-area');

const hintBtn = document.getElementById('hint-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

async function fetchQuestions() {
  try {
    const response = await fetch('nonsense.json');
    allQuestions = await response.json();
    initQuiz();
  } catch (error) {
    console.error("데이터 로드 실패", error);
    progressText.innerText = "데이터 로드 실패 😢";
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initQuiz() {
  // 50개 중 5문제 랜덤 추출
  const shuffled = shuffleArray([...allQuestions]);
  sessionQuestions = shuffled.slice(0, 5);
  
  currentIdx = 0;
  score = 0;
  
  quizScreen.classList.remove('hidden');
  resultScreen.classList.add('hidden');
  
  renderQuestion();
}

function renderQuestion() {
  const q = sessionQuestions[currentIdx];
  currentSelectedOption = null;
  isAnswerChecked = false;
  
  progressText.innerText = `Q. ${currentIdx + 1} / 5`;
  questionText.innerText = q.question;
  
  // UI 초기화
  hintArea.classList.add('hidden');
  feedbackArea.classList.add('hidden');
  hintBtn.classList.remove('hidden');
  submitBtn.classList.remove('hidden');
  nextBtn.classList.add('hidden');
  submitBtn.disabled = true;
  
  optionsContainer.innerHTML = '';
  q.options.forEach((opt, index) => {
    const label = document.createElement('label');
    label.className = 'option-label';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'option';
    radio.value = index;
    
    label.addEventListener('click', () => {
      if (isAnswerChecked) return; // 정답 확인 후 선택 불가
      
      // 모든 라디오 버튼 선택 해제 스타일
      document.querySelectorAll('.option-label').forEach(el => el.classList.remove('selected'));
      label.classList.add('selected');
      
      radio.checked = true;
      currentSelectedOption = index;
      submitBtn.disabled = false;
    });
    
    label.appendChild(radio);
    label.appendChild(document.createTextNode(opt));
    optionsContainer.appendChild(label);
  });
}

// 힌트 보기 이벤트
hintBtn.addEventListener('click', () => {
  const q = sessionQuestions[currentIdx];
  hintText.innerText = q.hint;
  hintArea.classList.remove('hidden');
  hintBtn.classList.add('hidden'); // 한 번 보면 버튼 숨김
});

// 정답 확인 이벤트
submitBtn.addEventListener('click', () => {
  if (currentSelectedOption === null) return;
  
  isAnswerChecked = true;
  const q = sessionQuestions[currentIdx];
  const isCorrect = currentSelectedOption === q.answer;
  
  if (isCorrect) score += 1;
  
  // 선택지 스타일 업데이트
  const labels = document.querySelectorAll('.option-label');
  labels.forEach((label, index) => {
    label.classList.add('disabled');
    if (index === q.answer) {
      label.classList.add('correct');
    } else if (index === currentSelectedOption && !isCorrect) {
      label.classList.add('incorrect');
    }
  });
  
  // 피드백 표시
  feedbackArea.classList.remove('hidden');
  if (isCorrect) {
    feedbackArea.innerText = "🎉 딩동댕! 정답입니다! 🎉";
    feedbackArea.className = "success";
  } else {
    feedbackArea.innerText = `땡! 틀렸습니다! (정답: ${q.options[q.answer]})`;
    feedbackArea.className = "error";
  }
  
  // 버튼 전환
  submitBtn.classList.add('hidden');
  hintBtn.classList.add('hidden');
  nextBtn.classList.remove('hidden');
  
  // 마지막 문제면 버튼 텍스트 변경
  if (currentIdx === sessionQuestions.length - 1) {
    nextBtn.innerText = "결과 보기 🏆";
  } else {
    nextBtn.innerText = "다음 문제 ❯";
  }
});

// 다음 문제 또는 결과 화면 이동
nextBtn.addEventListener('click', () => {
  if (currentIdx < sessionQuestions.length - 1) {
    currentIdx++;
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  
  document.getElementById('score-display').innerText = `${score} / 5`;
  
  const msgEl = document.getElementById('result-message');
  if (score === 5) msgEl.innerText = "당신은 진정한 넌센스 마스터! 🤩";
  else if (score >= 3) msgEl.innerText = "센스가 꽤 훌륭하시네요! 😎";
  else msgEl.innerText = "조금 더 유연한 사고가 필요해요! 🤣";
}

restartBtn.addEventListener('click', () => {
  initQuiz();
});

// 시작
fetchQuestions();