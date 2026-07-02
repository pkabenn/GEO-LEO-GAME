let currentUserId = localStorage.getItem('geometryLeoCurrentUser') || 'guest';
if (!localStorage.getItem('geometryLeoCurrentUser')) {
    localStorage.setItem('geometryLeoCurrentUser', currentUserId);
}

function getCurrentUserId() {
    return currentUserId;
}

function setCurrentUserId(userId) {
    currentUserId = userId || 'guest';
    localStorage.setItem('geometryLeoCurrentUser', currentUserId);
}

function loginUser(userId) {
    setCurrentUserId(userId);
}

function userStorageKey(key) {
    return `${key}_${getCurrentUserId()}`;
}

function loadUserValue(key, fallback = '') {
    return localStorage.getItem(userStorageKey(key)) ?? localStorage.getItem(key) ?? fallback;
}

function saveUserValue(key, value) {
    localStorage.setItem(userStorageKey(key), value);
}

function loadJsonStorage(key, fallback = null) {
    const raw = localStorage.getItem(userStorageKey(key)) || localStorage.getItem(key);
    if (!raw) return fallback;

    try {
        return JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

function saveJsonStorage(key, value) {
    localStorage.setItem(userStorageKey(key), JSON.stringify(value));
}
