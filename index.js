// ดึง User ID ปัจจุบัน (อาจจะเป็น 'guest' หรือ UID จาก Firebase)
const CURRENT_USER_ID = window.getCurrentUserId ? window.getCurrentUserId() : 'guest';
// สร้าง Key สำหรับ state ของเกมให้ผูกกับผู้ใช้แต่ละคน
const STORAGE_KEY = `geometryLeoGameState_${CURRENT_USER_ID}`;
const defaultLearningState = {
    points: 0, // This default is fine, as it will be overwritten
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
    // Just load the state, don't merge with defaults here. Let the source of truth be the stored object.
    return window.loadJsonStorage(STORAGE_KEY, defaultLearningState); // Access from global scope
}

function updateDailyStreak(state) {
    const today = todayKey();
    if (state.lastLogin === today) return state;

    const lastDate = state.lastLogin ? new Date(state.lastLogin) : null;
    const currentDate = new Date(today);
    const diffDays = lastDate ? Math.round((currentDate - lastDate) / 86400000) : Infinity;
    
    state.streakDays = (diffDays === 1) ? (state.streakDays || 0) + 1 : 1;
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
    window.saveJsonStorage(STORAGE_KEY, state); // Save back the updated streak info // Access from global scope
    renderLearningState(state);

    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', continueLearning);
    }
});
