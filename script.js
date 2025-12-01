// Game state
let currentMode = 'multiplication';
let currentTheme = 'panda';
let currentQuestion = null;
let queuedQuestion = null;
let correctCount = 0;
let totalCount = 0;
let lastMilestone = 0; // Track last milestone reached
let fastMode = false;

// Detect if device is touch-enabled (mobile/tablet)
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// DOM elements
const pandaBtn = document.getElementById('pandaBtn');
const squirtleBtn = document.getElementById('squirtleBtn');
const multiplicationBtn = document.getElementById('multiplicationBtn');
const divisionBtn = document.getElementById('divisionBtn');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const feedbackElement = document.getElementById('feedback');
const keypadButtons = document.querySelectorAll('.keypad-btn[data-value]');
const clearBtn = document.getElementById('clearBtn');
const keypadSubmitBtn = document.getElementById('keypadSubmitBtn');
const correctCountElement = document.getElementById('correctCount');
const totalCountElement = document.getElementById('totalCount');
const achievementsList = document.getElementById('achievementsList');
const mainTitle = document.getElementById('mainTitle');
const fastModeToggle = document.getElementById('fastModeToggle');
const queuedQuestionElement = document.getElementById('queuedQuestion');

// Initialize
loadAchievements();
initializeMilestone();
initializeEventListeners();
applyTheme('panda');
generateNewQuestion();

// Event listeners
function initializeEventListeners() {
    // Character/Theme switching
    pandaBtn.addEventListener('click', () => switchTheme('panda'));
    squirtleBtn.addEventListener('click', () => switchTheme('squirtle'));
    
    // Mode switching
    multiplicationBtn.addEventListener('click', () => switchMode('multiplication'));
    divisionBtn.addEventListener('click', () => switchMode('division'));

    // Submit buttons
    submitBtn.addEventListener('click', checkAnswer);
    keypadSubmitBtn.addEventListener('click', checkAnswer);

    // Keyboard input (for desktop)
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });

    // Prevent keyboard from appearing on touch devices only
    if (isTouchDevice) {
        answerInput.setAttribute('readonly', 'readonly');
        answerInput.setAttribute('inputmode', 'none');
        
        answerInput.addEventListener('touchstart', (e) => {
            e.preventDefault();
            answerInput.blur();
        });
        
        answerInput.addEventListener('focus', (e) => {
            e.preventDefault();
            answerInput.blur();
        });
        
        answerInput.addEventListener('click', (e) => {
            e.preventDefault();
            answerInput.blur();
        });
    }

    // Keypad buttons
    keypadButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const value = btn.getAttribute('data-value');
            answerInput.value += value;
            // Only blur on touch devices to prevent keyboard
            if (isTouchDevice) {
                answerInput.blur();
            }
        });
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        answerInput.value = '';
        // Only blur on touch devices to prevent keyboard
        if (isTouchDevice) {
            answerInput.blur();
        }
    });

    // Fast mode toggle
    fastModeToggle.addEventListener('change', (e) => {
        fastMode = e.target.checked;
        if (fastMode) {
            generateQueuedQuestion();
        } else {
            queuedQuestionElement.classList.remove('visible');
            queuedQuestion = null;
        }
    });

    // Focus input on load only for desktop (not touch devices)
    if (!isTouchDevice) {
        answerInput.focus();
    }
}

// Switch theme (Panda or Squirtle)
function switchTheme(theme) {
    currentTheme = theme;
    applyTheme(theme);
    
    if (theme === 'panda') {
        pandaBtn.classList.add('active');
        squirtleBtn.classList.remove('active');
        mainTitle.textContent = '🐼 Panda Math Practice';
    } else {
        squirtleBtn.classList.add('active');
        pandaBtn.classList.remove('active');
        mainTitle.textContent = '🐢 Squirtle Math Practice';
    }
}

// Apply theme to body
function applyTheme(theme) {
    document.body.className = `theme-${theme}`;
}

// Switch between multiplication and division modes
function switchMode(mode) {
    currentMode = mode;
    
    if (mode === 'multiplication') {
        multiplicationBtn.classList.add('active');
        divisionBtn.classList.remove('active');
    } else {
        divisionBtn.classList.add('active');
        multiplicationBtn.classList.remove('active');
    }
    
    generateNewQuestion();
    if (fastMode) {
        generateQueuedQuestion();
    }
}

// Generate a new question based on current mode
function generateNewQuestion() {
    // If fast mode and we have a queued question, use it
    if (fastMode && queuedQuestion) {
        currentQuestion = queuedQuestion;
        questionElement.textContent = queuedQuestion.questionText;
        // Generate next queued question
        generateQueuedQuestion();
    } else {
        // Normal mode - generate new question
        if (currentMode === 'multiplication') {
            generateMultiplicationQuestion();
        } else {
            generateDivisionQuestion();
        }
    }
    
    answerInput.value = '';
    // Only blur on touch devices to prevent keyboard
    if (isTouchDevice) {
        answerInput.blur();
    } else {
        // On desktop, focus the input for keyboard entry
        answerInput.focus();
    }
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback empty';
}

// Generate queued question for fast mode
function generateQueuedQuestion() {
    if (!fastMode) return;
    
    let num1, num2, answer, questionText;
    
    if (currentMode === 'multiplication') {
        num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
        num2 = Math.floor(Math.random() * 12) + 1; // 1 to 12
        answer = num1 * num2;
        questionText = `${num1} × ${num2} = ?`;
    } else {
        num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
        num2 = Math.floor(Math.random() * 12) + 1; // 1 to 12
        const product = num1 * num2;
        const divisor = Math.random() < 0.5 ? num1 : num2;
        answer = product / divisor;
        questionText = `${product} ÷ ${divisor} = ?`;
    }
    
    queuedQuestion = {
        question: questionText,
        questionText: questionText,
        answer: answer
    };
    
    queuedQuestionElement.textContent = questionText;
    queuedQuestionElement.classList.add('visible');
}

// Generate multiplication question (2-12 times tables)
function generateMultiplicationQuestion() {
    const num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const num2 = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const answer = num1 * num2;
    const questionText = `${num1} × ${num2} = ?`;
    
    currentQuestion = {
        question: `${num1} × ${num2}`,
        questionText: questionText,
        answer: answer
    };
    
    questionElement.textContent = questionText;
}

// Generate division question (up to 144/12)
function generateDivisionQuestion() {
    // Generate a multiplication fact first, then reverse it
    const num1 = Math.floor(Math.random() * 11) + 2; // 2 to 12
    const num2 = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const product = num1 * num2;
    
    // Randomly choose which number to divide by
    const divisor = Math.random() < 0.5 ? num1 : num2;
    const quotient = product / divisor;
    const questionText = `${product} ÷ ${divisor} = ?`;
    
    currentQuestion = {
        question: `${product} ÷ ${divisor}`,
        questionText: questionText,
        answer: quotient
    };
    
    questionElement.textContent = questionText;
}

// Play success sound
function playSuccessSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 523.25; // C5 note
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Load achievements from localStorage
function loadAchievements() {
    const achievements = JSON.parse(localStorage.getItem('mathAchievements') || '[]');
    displayAchievements(achievements);
}

// Save achievement to localStorage
function saveAchievement(mode, theme, milestone) {
    const achievements = JSON.parse(localStorage.getItem('mathAchievements') || '[]');
    const achievement = {
        date: new Date().toLocaleDateString(),
        mode: mode,
        theme: theme,
        milestone: milestone,
        timestamp: Date.now()
    };
    achievements.push(achievement);
    localStorage.setItem('mathAchievements', JSON.stringify(achievements));
    displayAchievements(achievements);
}

// Display achievements
function displayAchievements(achievements) {
    if (achievements.length === 0) {
        achievementsList.innerHTML = '<p class="no-achievements">No achievements yet. Get 50 correct answers to earn one!</p>';
        return;
    }
    
    // Sort by date (newest first)
    achievements.sort((a, b) => b.timestamp - a.timestamp);
    
    achievementsList.innerHTML = achievements.map(achievement => {
        const modeText = achievement.mode === 'multiplication' ? 'Multiplication' : 'Division';
        const themeIcon = achievement.theme === 'panda' ? '🐼' : '🐢';
        const milestone = achievement.milestone || 50;
        return `
            <div class="achievement-item">
                <div>${themeIcon} <span class="achievement-mode">${modeText}</span> - ${milestone} Correct Answers!</div>
                <div class="achievement-date">Date: ${achievement.date}</div>
            </div>
        `;
    }).join('');
}

// Initialize last milestone from achievements
function initializeMilestone() {
    const achievements = JSON.parse(localStorage.getItem('mathAchievements') || '[]');
    if (achievements.length > 0) {
        const milestones = achievements.map(a => a.milestone || 50);
        lastMilestone = Math.max(...milestones);
    }
}

// Check the answer
function checkAnswer() {
    const userAnswer = parseInt(answerInput.value.trim());
    
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Please enter a number!';
        feedbackElement.className = 'feedback incorrect';
        return;
    }
    
    totalCount++;
    totalCountElement.textContent = totalCount;
    
    const isCorrect = userAnswer === currentQuestion.answer;
    
    if (isCorrect) {
        correctCount++;
        correctCountElement.textContent = correctCount;
        
        // Play success sound
        playSuccessSound();
        
        // Flash green in fast mode
        if (fastMode) {
            questionElement.classList.add('flash-green');
            setTimeout(() => {
                questionElement.classList.remove('flash-green');
            }, 400);
        }
        
        // Check for 50 correct answers milestone (50, 100, 150, etc.)
        const nextMilestone = Math.floor(correctCount / 50) * 50;
        if (nextMilestone > lastMilestone && nextMilestone >= 50) {
            saveAchievement(currentMode, currentTheme, nextMilestone);
            lastMilestone = nextMilestone;
            if (!fastMode) {
                feedbackElement.textContent = `🎉 Correct! 🏆 Achievement Unlocked: ${nextMilestone} Correct Answers!`;
            }
        } else {
            if (!fastMode) {
                feedbackElement.textContent = '🎉 Correct! Great job!';
            }
        }
        if (!fastMode) {
            feedbackElement.className = 'feedback correct';
        }
    } else {
        // Flash red in fast mode
        if (fastMode) {
            questionElement.classList.add('flash-red');
            setTimeout(() => {
                questionElement.classList.remove('flash-red');
            }, 400);
        }
        
        if (!fastMode) {
            feedbackElement.textContent = `❌ Incorrect. The answer is ${currentQuestion.answer}`;
            feedbackElement.className = 'feedback incorrect';
        }
    }
    
    // Generate new question - faster in fast mode
    const delay = fastMode ? 300 : 2000;
    setTimeout(() => {
        generateNewQuestion();
    }, delay);
}

