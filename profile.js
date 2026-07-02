// This listener will handle the display of login/logout buttons.
// It's robust because it uses the official Firebase listener, which guarantees
// it will be called with the current auth state and on any subsequent changes.
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(user => {
        const loggedInActions = document.getElementById('logged-in-actions');
        const loggedOutActions = document.getElementById('logged-out-actions');

        if (!loggedInActions || !loggedOutActions) return;

        if (user) {
            // User is signed in: show settings and logout buttons.
            loggedInActions.style.display = 'flex';
            loggedOutActions.style.display = 'none';
        } else {
            // User is signed out: show login button.
            loggedInActions.style.display = 'none';
            loggedOutActions.style.display = 'block';
        }
    });
});

const CURRENT_USER_ID = getCurrentUserId();
const USER_STORAGE_KEY = 'geometryLeoGameState';
const PROFILE_FIELD_KEYS = {
    score: 'points',
    streak: 'streakDays',
    level: 'level'
};

const profileState = {
    accountId: CURRENT_USER_ID,
    username: 'นักเรียนGeometry',
    avatarTheme: 'sunset',
    avatarImage: '',
    title: 'MASTER OF LOGIC', // This seems static
    rank: 'ผู้เชี่ยวชาญ',
    points: 0,
    streakDays: 0,
    lastLogin: null,
    rankPosition: '--', // ค่าเริ่มต้นสำหรับอันดับ
    level: 1,
    exp: 0,
    nextLevelExp: 100,
    latestAchievements: [
        { title: 'นักล่าโลหะเวกเตอร์', detail: 'แก้โจทย์ 3 ข้อ ครบ 50 วินาที', value: '+280' },
        { title: 'ความเร็วแสง', detail: 'ทำคะแนนเต็มภายใน 30 วินาที', value: '+150' },
        { title: 'ผู้พิชิตระนาบ', detail: 'จบบทเรียนเส้นขนานโดดไม่ผิด', value: '+300' }
    ]
};

function todayKey() {
    return new Date().toISOString().split('T')[0];
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

function saveAvatarTheme(theme) {
    saveUserValue('geometryLeoAvatarTheme', theme);
}

function applyAvatarTheme(theme, imageData) {
    const avatar = document.getElementById('profileAvatar');
    if (!avatar) return;
    if (imageData) {
        avatar.style.backgroundImage = `url(${imageData})`;
        avatar.style.backgroundSize = 'cover';
        avatar.style.backgroundPosition = 'center';
        avatar.classList.add('has-image');
    } else {
        avatar.style.backgroundImage = '';
        avatar.classList.remove('has-image');
        avatar.dataset.theme = theme;
    }
}

function renderProfile() {
    const stored = loadJsonStorage(USER_STORAGE_KEY, {});
    if (stored) {
        // Directly update profileState from the single source of truth
        profileState.points = stored.points ?? 0;
        profileState.exp = stored.exp ?? 0;
        profileState.nextLevelExp = stored.nextLevelExp ?? 100;
        profileState.level = stored.level ?? 1;
        profileState.streakDays = stored.streakDays ?? 0;
        profileState.lastLogin = stored.lastLogin ?? null;
    }

    profileState.avatarImage = loadUserValue('geometryLeoAvatarImage', '');
    profileState.username = loadUserValue('geometryLeoUsername', 'นักเรียนGeometry');
    profileState.avatarTheme = loadUserValue('geometryLeoAvatarTheme', 'sunset');
    profileState.rankPosition = loadUserValue('geometryLeoRankPosition', '--'); // โหลดอันดับล่าสุดจาก Leaderboard

    updateDailyStreak(profileState);
    saveJsonStorage(USER_STORAGE_KEY, profileState); // Save the updated state (with streak)

    document.getElementById('profileName').textContent = profileState.username;
    const profileTitleElement = document.getElementById('profileTitle');
    if (profileTitleElement) {
        profileTitleElement.textContent = profileState.title;
    }
    applyAvatarTheme(profileState.avatarTheme, profileState.avatarImage);
    document.getElementById('profileRank').textContent = profileState.rank;
    document.getElementById('pointsValue').textContent = `${profileState.points.toLocaleString()} pts`;
    document.getElementById('rankPosition').textContent = `#${profileState.rankPosition}`;
    document.getElementById('profileExp').textContent = `${profileState.exp} / ${profileState.nextLevelExp} EXP`;
    document.getElementById('profileLevel').textContent = profileState.level;
    document.getElementById('levelFill').style.width = `${Math.min(100, (profileState.exp / profileState.nextLevelExp) * 100)}%`;
    document.getElementById('streakValue').textContent = `${profileState.streakDays} วัน`;

    const achievementList = document.getElementById('achievementList');
    if (achievementList) {
        const latestTwo = profileState.latestAchievements.slice(0, 2);
        achievementList.innerHTML = latestTwo.map(item => `
            <div class="achievement-item">
                <div>
                    <strong>${item.title}</strong>
                    <p>${item.detail}</p>
                </div>
                <span>${item.value}</span>
            </div>
        `).join('');
    }
}

renderProfile();
window.addEventListener('focus', renderProfile);
window.addEventListener('pageshow', renderProfile);
window.addEventListener('storage', (event) => {
    if (!event.key) return;
    if (event.key.includes('geometryLeoUsername') || event.key.includes('geometryLeoAvatarTheme') || event.key.includes('geometryLeoAvatarImage')) {
        renderProfile();
    }
});

const avatarUpload = document.getElementById('avatarUpload');

if (avatarUpload) {
    avatarUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const imageDataUrl = e.target.result;
            const imageKey = 'geometryLeoAvatarImage';

            // แสดงผลรูปที่เลือกทันทีโดยใช้ฟังก์ชันที่มีอยู่แล้ว
            applyAvatarTheme(profileState.avatarTheme, imageDataUrl);

            // บันทึกรูปภาพลงใน localStorage โดยใช้ key ที่ถูกต้อง
            if (typeof saveUserValue === 'function') {
                saveUserValue(imageKey, imageDataUrl);
            } else { localStorage.setItem(imageKey, imageDataUrl); } // Fallback

            // อัปเดต state ในหน่วยความจำ
            profileState.avatarImage = imageDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
            signOutUser();
        }
    });
}
