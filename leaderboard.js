document.addEventListener('DOMContentLoaded', () => {
    /**
     * สร้างข้อมูลผู้เล่นจำลองสำหรับ Leaderboard
     * @param {number} count - จำนวนผู้เล่นที่ต้องการสร้าง
     * @returns {Array<Object>} - รายชื่อผู้เล่นพร้อมคะแนน
     */
    function generateMockLeaderboard(count) {
        const prefixes = ['Geo', 'Vector', 'Angle', 'Poly', 'Tri', 'Circle', 'Line', 'Point', 'Cube', 'Sphere', 'Axiom', 'Proof', 'Tangent', 'Radius'];
        const suffixes = ['Master', 'Ninja', 'Guru', 'Rider', 'Slayer', 'Bot', 'Pro', 'King', 'Queen', 'Ace', 'Viper', 'Titan'];
        const players = [];
        const usedUsernames = new Set();
        let currentPoints = 50000; // คะแนนเริ่มต้นสำหรับอันดับ 1

        while (players.length < count) {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            const randomNumber = Math.floor(Math.random() * 900) + 100; // 100-999
            const username = `${prefix}${suffix}${randomNumber}`;

            if (!usedUsernames.has(username)) {
                usedUsernames.add(username);

                // ลดคะแนนสำหรับผู้เล่นถัดไปแบบสุ่ม
                const pointsDrop = Math.floor(Math.random() * (currentPoints * 0.05)) + 100;
                currentPoints -= pointsDrop;

                players.push({ username, points: Math.max(1000, Math.floor(currentPoints)) });
            }
        }
        return players;
    }

    const mockLeaderboardData = generateMockLeaderboard(100);

    function loadCurrentUser() {
        const username = loadUserValue('geometryLeoUsername', 'นักเรียนGeometry');
        let points = 0;
        // ใช้ loadJsonStorage เพื่อให้สอดคล้องกับระบบ user-specific storage
        const gameState = loadJsonStorage('geometryLeoGameState');
        if (gameState) {
            points = gameState.points || 0;
        }
        return { username, points, isCurrentUser: true };
    }

    function renderLeaderboard() {
        const leaderboardListEl = document.getElementById('leaderboardList');
        if (!leaderboardListEl) return;

        const currentUser = loadCurrentUser();
        const allPlayers = [...mockLeaderboardData];

        // ตรวจสอบว่าผู้เล่นปัจจุบันมีอยู่ในรายชื่อจำลองหรือไม่
        const existingUserIndex = allPlayers.findIndex(p => p.username.toLowerCase() === currentUser.username.toLowerCase());

        if (existingUserIndex > -1) {
            // ถ้ามี ให้อัปเดตคะแนนเป็นคะแนนจริงของผู้เล่น และมาร์คว่าเป็นผู้เล่นปัจจุบัน
            allPlayers[existingUserIndex].points = currentUser.points;
            allPlayers[existingUserIndex].isCurrentUser = true;
        } else {
            // ถ้าไม่มี ให้เพิ่มเข้าไปในรายชื่อ
            allPlayers.push(currentUser);
        }

        // จัดอันดับตามคะแนนจากมากไปน้อย
        allPlayers.sort((a, b) => b.points - a.points);

        // เพิ่มข้อมูลอันดับจริงให้กับผู้เล่นทุกคน
        allPlayers.forEach((player, index) => {
            player.rank = index + 1;
        });

        const currentUserData = allPlayers.find(p => p.isCurrentUser);
        const currentUserRank = currentUserData ? currentUserData.rank : -1;

        // บันทึกอันดับของผู้เล่นปัจจุบันเพื่อใช้ในหน้าโปรไฟล์
        if (currentUserRank > -1) {
            // ใช้ฟังก์ชันจาก script.js เพื่อบันทึกข้อมูล
            saveUserValue('geometryLeoRankPosition', currentUserRank);
        }

        // --- แสดงอันดับของผู้เล่นปัจจุบันที่ด้านล่าง ---
        const currentUserRankDisplayEl = document.getElementById('currentUserRankDisplay');
        if (currentUserRankDisplayEl && currentUserData) {
            const avatarLetter = currentUserData.username.charAt(0).toUpperCase();

            currentUserRankDisplayEl.innerHTML = `
                <div class="leaderboard-item current-user">
                    <div class="leaderboard-rank">
                        <span>${currentUserData.rank}</span>
                    </div>
                    <div class="leaderboard-player">
                        <div class="player-avatar" data-letter="${avatarLetter}">${avatarLetter}</div>
                        <span class="player-name">${currentUserData.username} (คุณ)</span>
                    </div>
                    <div class="leaderboard-points">
                        ${currentUserData.points.toLocaleString()} pts
                    </div>
                </div>`;
            currentUserRankDisplayEl.style.display = 'block';
        }

        // เตรียมรายชื่อที่จะแสดงผล
        let displayPlayers = allPlayers.slice(0, 100);

        // ถ้าผู้เล่นปัจจุบันไม่อยู่ใน 100 อันดับแรก ให้เพิ่มเข้าไปในรายชื่อแสดงผล
        if (currentUserData && currentUserRank > 100) {
            displayPlayers.push(currentUserData);
        }

        // สร้าง HTML สำหรับแสดงผล
        leaderboardListEl.innerHTML = displayPlayers.map((player) => {
            const isCurrentUserClass = player.isCurrentUser ? 'current-user' : '';
            const avatarLetter = player.username.charAt(0).toUpperCase();

            return `
                <div class="leaderboard-item ${isCurrentUserClass}">
                    <div class="leaderboard-rank">
                        <span>${player.rank}</span>
                    </div>
                    <div class="leaderboard-player">
                        <div class="player-avatar" data-letter="${avatarLetter}">${avatarLetter}</div>
                        <span class="player-name">${player.username}</span>
                    </div>
                    <div class="leaderboard-points">
                        ${player.points.toLocaleString()} pts
                    </div>
                </div>
            `;
        }).join('');
    }

    renderLeaderboard();
});