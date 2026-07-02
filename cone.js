document.addEventListener('DOMContentLoaded', () => {
    const answerButtons = document.querySelectorAll('.answer-btn');
    const scoreValueEl = document.getElementById('scoreValue');
    const resultTextEl = document.getElementById('resultText');
    const lessonCard = document.querySelector('.lesson-card');

    let currentSessionScore = 0;

    // โหลดสถิติผู้ใช้ที่มีอยู่เพื่อแสดงคะแนนรวมและเลเวลให้ถูกต้องตั้งแต่ต้น
    updateTotalStatsDisplay();

    answerButtons.forEach(button => {
        button.addEventListener('click', () => {
            // ป้องกันการตอบคำถามเดิมซ้ำ
            if (lessonCard.classList.contains('answered')) {
                resultTextEl.textContent = 'คุณได้ตอบคำถามนี้ไปแล้ว';
                return;
            }

            const isCorrect = button.dataset.correct === 'true';

            if (isCorrect) {
                // --- กรณีตอบถูก ---
                resultTextEl.textContent = 'ถูกต้อง! คุณได้รับ 100 คะแนน และ 50 EXP';
                resultTextEl.style.color = '#4ade80'; // สีเขียว
                button.classList.add('correct');

                // อัปเดตคะแนนเฉพาะในด่านนี้
                currentSessionScore += 100;
                if (scoreValueEl) scoreValueEl.textContent = currentSessionScore;

                // เรียกใช้ฟังก์ชันกลางเพื่ออัปเดตสถิติโดยรวมของผู้เล่น
                // นี่คือ "ระบบใหม่" ที่เชื่อมต่อทุกอย่างเข้าด้วยกัน
                if (window.updateUserStats) {
                    window.updateUserStats({ points: 100, exp: 50 });
                } else {
                    console.error('ฟังก์ชัน updateUserStats ไม่ได้ถูกโหลด!');
                }

                // อัปเดตการแสดงผลคะแนนรวมและเลเวลทันที
                updateTotalStatsDisplay();

            } else {
                // --- กรณีตอบผิด ---
                resultTextEl.textContent = 'คำตอบไม่ถูกต้อง ลองอีกครั้งในด่านถัดไปนะ';
                resultTextEl.style.color = '#f87171'; // สีแดง
                button.classList.add('incorrect');

                // ค้นหาและไฮไลท์คำตอบที่ถูกต้อง
                const correctButton = lessonCard.querySelector('.answer-btn[data-correct="true"]');
                if (correctButton) {
                    correctButton.classList.add('correct');
                }
            }

            // กำหนดว่าคำถามนี้ถูกตอบแล้ว
            lessonCard.classList.add('answered');
        });
    });

    /**
     * ฟังก์ชันสำหรับอัปเดตการแสดงผล "คะแนนรวม", "เลเวล", และ "EXP"
     * โดยจะอ่านข้อมูลล่าสุดจาก localStorage เพื่อให้แน่ใจว่าถูกต้องเสมอ
     */
    function updateTotalStatsDisplay() {
        const totalScoreValueEl = document.getElementById('totalScoreValue');
        const levelValueEl = document.getElementById('levelValue');
        const expValueEl = document.getElementById('expValue');
        const nextLevelExpEl = document.getElementById('nextLevelExp');

        if (window.loadJsonStorage) {
            const gameState = window.loadJsonStorage('geometryLeoGameState', { points: 0, level: 1, exp: 0, nextLevelExp: 100 });
            if (totalScoreValueEl) totalScoreValueEl.textContent = (gameState.points || 0).toLocaleString();
            if (levelValueEl) levelValueEl.textContent = gameState.level || 1;
            if (expValueEl) expValueEl.textContent = gameState.exp || 0;
            if (nextLevelExpEl) nextLevelExpEl.textContent = gameState.nextLevelExp || 100;
        }
    }
});