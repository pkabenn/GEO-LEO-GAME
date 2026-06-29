const defaultLearningState = {
    points: 0,
    stageName: 'ด่าน 1: เบื้องต้น',
    progress: 0,
    nextLesson: 'บทเรียน 1: พื้นฐานเวกเตอร์',
    streakDays: 0,
    skillHint: 'เริ่มต้นพื้นฐานเวกเตอร์และมุม',
    achievementHint: 'เริ่มต้นการเดินทาง สะสมดาวเพื่อปลดล็อก'
};

function createLearningState() {
    return { ...defaultLearningState };
}

function renderLearningState(state) {
    document.getElementById('pointsValue').textContent = `${state.points.toLocaleString()} pts`;
    document.getElementById('stageName').textContent = state.stageName;
    document.getElementById('progressValue').textContent = `${state.progress}%`;
    document.getElementById('progressFill').style.width = `${state.progress}%`;
    document.getElementById('nextLessonName').textContent = state.nextLesson;
    document.getElementById('streakDaysValue').textContent = `${state.streakDays} วัน`;
    document.getElementById('skillHint').textContent = state.skillHint;
    document.getElementById('achievementHint').textContent = state.achievementHint;
}

function continueLearning(event) {
    if (event) event.preventDefault();

    const state = createLearningState();
    state.progress = Math.min(100, state.progress + 10);
    state.points += 120;
    state.streakDays += 1;
    state.skillHint = state.progress >= 90 ? 'คุณใกล้เสร็จสิ้นด่านแล้ว!' : 'ฝึกฝนความแม่นยำให้แน่นยิ่งขึ้น';
    state.achievementHint = state.progress >= 100 ? 'สำเร็จด่านนี้แล้ว!' : 'ต่อเนื่องอย่างมั่นคง';

    renderLearningState(state);
}

document.addEventListener('DOMContentLoaded', () => {
    const state = createLearningState();
    renderLearningState(state);
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', continueLearning);
    }
});