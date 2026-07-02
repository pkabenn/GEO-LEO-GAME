const usernameInput = document.getElementById('usernameInput');
const saveSettings = document.getElementById('saveSettings');

function loadSettings() {
    usernameInput.value = window.loadUserValue('geometryLeoUsername', ''); // Access from global scope
}

if (saveSettings) {
    saveSettings.addEventListener('click', () => {
        const username = usernameInput.value.trim() || 'นักเรียนGeometry';
        window.saveUserValue('geometryLeoUsername', username); // Access from global scope

        alert('บันทึกเรียบร้อยแล้ว');
    });
}

loadSettings();
