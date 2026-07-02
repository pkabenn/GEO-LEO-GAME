const CURRENT_USER_ID = getCurrentUserId();
const USER_STORAGE_KEY = 'geometryLeoGameState';
const PROFILE_FIELD_KEYS = {
    score: 'points',
    streak: 'streakDays',
    level: 'level'
};

const profileState = {
    accountId: CURRENT_USER_ID,
    username: loadUserValue('geometryLeoUsername', 'นักเรียนGeometry'),
    avatarTheme: loadUserValue('geometryLeoAvatarTheme', 'sunset'),
    avatarImage: loadUserValue('geometryLeoAvatarImage', ''),
    title: 'MASTER OF LOGIC',
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

function loadGameState() {
    return loadJsonStorage(USER_STORAGE_KEY, null);
}

function saveGameState(state) {
    saveJsonStorage(USER_STORAGE_KEY, state);
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

function saveAvatarTheme(theme) {
    saveUserValue('geometryLeoAvatarTheme', theme);
}

function getProfileUsername() {
    const value = loadUserValue('geometryLeoUsername', null);
    return value || localStorage.getItem('geometryLeoUsername') || 'นักเรียนGeometry';
}

function getProfileAvatarTheme() {
    const value = loadUserValue('geometryLeoAvatarTheme', null);
    return value || localStorage.getItem('geometryLeoAvatarTheme') || 'sunset';
}

function getProfileAvatarImage() {
    const value = loadUserValue('geometryLeoAvatarImage', null);
    return value || localStorage.getItem('geometryLeoAvatarImage') || '';
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
    const stored = loadGameState();
    if (stored) {
        profileState.points = stored[PROFILE_FIELD_KEYS.score] ?? stored.score ?? profileState.points;
        profileState.exp = stored.exp ?? profileState.exp;
        profileState.nextLevelExp = stored.nextLevelExp ?? profileState.nextLevelExp;
        profileState.level = stored[PROFILE_FIELD_KEYS.level] ?? stored.level ?? profileState.level;
        profileState.streakDays = stored[PROFILE_FIELD_KEYS.streak] ?? profileState.streakDays;
        profileState.lastLogin = stored.lastLogin ?? profileState.lastLogin;
    }

    profileState.avatarImage = getProfileAvatarImage();
    profileState.username = getProfileUsername();
    profileState.avatarTheme = getProfileAvatarTheme();
    profileState.rankPosition = loadUserValue('geometryLeoRankPosition', '--'); // โหลดอันดับล่าสุดจาก Leaderboard

    updateDailyStreak(profileState);
    saveGameState(profileState);
    saveAvatarTheme(profileState.avatarTheme);

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
            }
            localStorage.setItem(imageKey, imageDataUrl); // เพื่อความเข้ากันได้แบบเดียวกับใน settings.js

            // อัปเดต state ในหน่วยความจำ
            profileState.avatarImage = imageDataUrl;
        };
        reader.readAsDataURL(file);
    });
}
