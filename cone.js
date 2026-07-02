const STORAGE_KEY = 'geometryLeoGameState';

let gameState = loadJsonStorage(STORAGE_KEY, {
    points: 0, exp: 0, level: 1, nextLevelExp: 100
});

let lessonScore = 0; // Score for this session only

function updateLessonStatus() {
    document.getElementById('scoreValue').textContent = lessonScore;
    document.getElementById('totalScoreValue').textContent = gameState.points.toLocaleString();
    document.getElementById('expValue').textContent = gameState.exp;
    document.getElementById('nextLevelExp').textContent = gameState.nextLevelExp;
    document.getElementById('levelValue').textContent = gameState.level;
}

function gainExp(amount) {
    gameState.exp += amount;
    while (gameState.exp >= gameState.nextLevelExp) {
        gameState.exp -= gameState.nextLevelExp;
        gameState.level += 1;
        gameState.nextLevelExp = Math.round(gameState.nextLevelExp * 1.4);
    }
}

function showResult(correct) {
    const resultText = document.getElementById('resultText');
    if (correct) {
        const gain = 150;
        lessonScore += gain;
        gameState.points = (gameState.points || 0) + gain;
        gainExp(50);
        resultText.textContent = 'ตอบถูก! ผ่านด่านนี้แล้ว รับ 150 คะแนน + 50 EXP';
        resultText.style.color = '#86efac';
    } else {
        const penalty = 20;
        lessonScore = Math.max(0, lessonScore - penalty);
        gameState.points = Math.max(0, (gameState.points || 0) - penalty);
        gainExp(10);
        resultText.textContent = 'ตอบผิด ลองใหม่อีกครั้ง รับ 10 EXP';
        resultText.style.color = '#fca5a5';
    }

    saveJsonStorage(STORAGE_KEY, gameState);
    updateLessonStatus();
}

document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const correct = btn.dataset.correct === 'true';
        showResult(correct);
    });
});

updateLessonStatus();
