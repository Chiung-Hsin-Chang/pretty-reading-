const vocabulary = [
    { word: 'a', meaning: '一(個)', options: ['一(個)', '兩個', '三個', '四個'] },
    { word: 'A.M.', meaning: '上午', options: ['上午', '下午', '晚上', '凌晨'] },
    { word: 'ability', meaning: '能力、才能', options: ['能力、才能', '困難', '美麗', '智慧'] },
    { word: 'able', meaning: '能夠的、有才能的', options: ['能夠的、有才能的', '虛弱的', '笨拙的', '遲鈍的'] },
    { word: 'about', meaning: '大約、關於', options: ['大約、關於', '之下', '之內', '之外'] },
    { word: 'above', meaning: '在…上面、超過、大於', options: ['在…上面、超過、大於', '在下面', '在旁邊', '在裡面'] },
    { word: 'abroad', meaning: '在國外、到國外', options: ['在國外、到國外', '在國內', '在家裡', '在學校'] },
    { word: 'absent', meaning: '缺席的、不在場的', options: ['缺席的、不在場的', '出席的', '專心的', '認真的'] }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let answers = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const questions = shuffleArray([...vocabulary]).slice(0, 10);

function startQuiz() {
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= 10) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('word').textContent = question.word;
    document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    shuffleArray([...question.options]).forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });

    document.getElementById('message').textContent = '';
    startTimer();
}

function startTimer() {
    let timeLeft = 15;
    document.getElementById('timer').textContent = `剩餘時間: ${timeLeft}秒`;
    
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `剩餘時間: ${timeLeft}秒`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    const question = questions[currentQuestionIndex];
    answers.push({
        word: question.word,
        correct: false,
        userAnswer: '未作答',
        correctAnswer: question.meaning
    });
    
    document.getElementById('message').textContent = '時間到！';
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function checkAnswer(selectedOption) {
    clearInterval(timer);
    const question = questions[currentQuestionIndex];
    const isCorrect = selectedOption === question.meaning;
    
    answers.push({
        word: question.word,
        correct: isCorrect,
        userAnswer: selectedOption,
        correctAnswer: question.meaning
    });

    if (isCorrect) {
        score += 10;
    }

    document.getElementById('message').textContent = isCorrect ? '答對了！' : '答錯了！';
    
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('results-container').style.display = 'block';
    
    document.getElementById('score').textContent = `總分: ${score}分`;
    
    const answerList = document.getElementById('answer-list');
    answerList.innerHTML = answers.map((answer, index) => `
        <div class="answer-item">
            <div>第 ${index + 1} 題: ${answer.word}</div>
            <div class="${answer.correct ? 'correct' : 'incorrect'}">
                ${answer.correct ? '✓ 正確' : '✗ 錯誤'}
            </div>
            <div>你的答案: ${answer.userAnswer}</div>
            <div>正確答案: ${answer.correctAnswer}</div>
        </div>
    `).join('');
}

document.getElementById('speak-btn').addEventListener('click', () => {
    const word = document.getElementById('word').textContent;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
});

startQuiz();
