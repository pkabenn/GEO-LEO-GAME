﻿let currentUserId = 'guest'; // Start as guest, auth.js will update this.

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

// Expose utility functions globally for modules to access
window.getCurrentUserId = getCurrentUserId;
window.setCurrentUserId = setCurrentUserId;
window.loginUser = loginUser;
window.userStorageKey = userStorageKey;
window.loadUserValue = loadUserValue;
window.saveUserValue = saveUserValue;
window.loadJsonStorage = loadJsonStorage;
window.saveJsonStorage = saveJsonStorage;
