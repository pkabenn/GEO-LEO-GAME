const usernameInput = document.getElementById('usernameInput');
const saveSettings = document.getElementById('saveSettings');

function loadSettings() {
    usernameInput.value = loadUserValue('geometryLeoUsername', '');
}

if (saveSettings) {
    saveSettings.addEventListener('click', () => {
        const username = usernameInput.value.trim() || 'นักเรียนGeometry';
        saveUserValue('geometryLeoUsername', username);

        // Fallback for profile page and legacy access
        localStorage.setItem('geometryLeoUsername', username);

        alert('บันทึกเรียบร้อยแล้ว');
    });
}

loadSettings();
