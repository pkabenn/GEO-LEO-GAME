const STORAGE_KEY = 'geometryLeoGameState';
const defaultGameState = {
    points: 0,
    exp: 0,
    level: 1,
    nextLevelExp: 100,
    streakDays: 0,
    lastLogin: null
};

function todayKey() {
    return new Date().toISOString().split('T')[0];
}

function loadGameState() {
    return loadJsonStorage(STORAGE_KEY, { ...defaultGameState });
}

function saveGameState(state) {
    saveJsonStorage(STORAGE_KEY, state);
}

function updateDailyStreak(state) {
    const today = todayKey();
    if (state.lastLogin === today) return state;

    if (!state.lastLogin) {
        state.streakDays = 1;
    } else {
        const lastDate = new Date(state.lastLogin);
        const currentDate = new Date(today);
        const diffDays = Math.round((currentDate - lastDate) / 86400000);
        state.streakDays = diffDays === 1 ? (state.streakDays || 0) + 1 : 1;
    }

    state.lastLogin = today;
    return state;
}

const gameState = loadGameState();
updateDailyStreak(gameState);
saveGameState(gameState);

const lessonState = {
    score: 0,
    exp: 0,
    level: 1,
    nextLevelExp: 100,
    passed: false
};

function updateLessonStatus() {
    document.getElementById('scoreValue').textContent = lessonState.score;
    document.getElementById('totalScoreValue').textContent = gameState.points;
    document.getElementById('expValue').textContent = lessonState.exp;
    document.getElementById('nextLevelExp').textContent = lessonState.nextLevelExp;
    document.getElementById('levelValue').textContent = lessonState.level;
}

function gainExp(amount) {
    lessonState.exp += amount;
    while (lessonState.exp >= lessonState.nextLevelExp) {
        lessonState.exp -= lessonState.nextLevelExp;
        lessonState.level += 1;
        lessonState.nextLevelExp = Math.round(lessonState.nextLevelExp * 1.4);
    }
    gameState.exp = lessonState.exp;
    gameState.level = lessonState.level;
    gameState.nextLevelExp = lessonState.nextLevelExp;
}

function showResult(correct) {
    const resultText = document.getElementById('resultText');
    if (correct) {
        const gain = 150;
        lessonState.score += gain;
        gameState.points = (gameState.points || 0) + gain;
        gainExp(50);
        lessonState.passed = true;
        resultText.textContent = 'ตอบถูก! ผ่านด่านนี้แล้ว รับ 150 คะแนน + 50 EXP';
        resultText.style.color = '#86efac';
    } else {
        const penalty = 20;
        lessonState.score = Math.max(0, lessonState.score - penalty);
        gameState.points = Math.max(0, (gameState.points || 0) - penalty);
        gainExp(10);
        resultText.textContent = 'ตอบผิด ลองใหม่อีกครั้ง รับ 10 EXP';
        resultText.style.color = '#fca5a5';
    }

    saveGameState(gameState);
    updateLessonStatus();
}

document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const correct = btn.dataset.correct === 'true';
        showResult(correct);
    });
});

updateLessonStatus();
