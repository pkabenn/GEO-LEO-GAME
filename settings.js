const usernameInput = document.getElementById('usernameInput');
const saveSettings = document.getElementById('saveSettings');

function loadSettings() {
    usernameInput.value = loadUserValue('geometryLeoUsername', '');
}

if (saveSettings) {
    saveSettings.addEventListener('click', () => {
        const username = usernameInput.value.trim() || 'นักเรียนGeometry';
        saveUserValue('geometryLeoUsername', username);

        alert('บันทึกเรียบร้อยแล้ว');
    });
}

loadSettings();
