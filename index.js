const STORAGE_KEY = 'geometryLeoGameState';
const defaultLearningState = {
    points: 0,
    exp: 0,
    level: 1,
    nextLevelExp: 100,
    stageName: 'ด่าน 1: เบื้องต้น',
    progress: 0,
    nextLesson: 'บทเรียน 1: พื้นฐานเวกเตอร์',
    streakDays: 0,
    lastLogin: null,
    skillHint: 'เริ่มต้นพื้นฐานเวกเตอร์และมุม',
    achievementHint: 'เริ่มต้นการเดินทาง สะสมดาวเพื่อปลดล็อก'
};

function todayKey() {
    return new Date().toISOString().split('T')[0];
}

function loadLearningState() {
    const stored = loadJsonStorage(STORAGE_KEY, null);
    return stored ? { ...defaultLearningState, ...stored } : { ...defaultLearningState };
}

function saveLearningState(state) {
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

function renderLearningState(state) {
    const pointsValue = document.getElementById('pointsValue');
    if (pointsValue) pointsValue.textContent = `${state.points.toLocaleString()} pts`;

    const stageName = document.getElementById('stageName');
    if (stageName) stageName.textContent = state.stageName;

    const progressValue = document.getElementById('progressValue');
    if (progressValue) progressValue.textContent = `${state.progress}%`;

    const progressFill = document.getElementById('progressFill');
    if (progressFill) progressFill.style.width = `${state.progress}%`;

    const nextLessonName = document.getElementById('nextLessonName');
    if (nextLessonName) nextLessonName.textContent = state.nextLesson;

    const streakDaysValue = document.getElementById('streakDaysValue');
    if (streakDaysValue) streakDaysValue.textContent = `${state.streakDays} วัน`;

    const skillHint = document.getElementById('skillHint');
    if (skillHint) skillHint.textContent = state.skillHint;

    const achievementHint = document.getElementById('achievementHint');
    if (achievementHint) achievementHint.textContent = state.achievementHint;
}

function continueLearning(event) {
    if (event) event.preventDefault();
    window.location.href = 'stages.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const state = loadLearningState();
    updateDailyStreak(state);
    saveLearningState(state);
    renderLearningState(state);

    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', continueLearning);
    }
});
