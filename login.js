document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('google-signin');
    const facebookBtn = document.getElementById('facebook-signin');

    if (googleBtn) {
        googleBtn.addEventListener('click', window.signInWithGoogle); // Access from global scope
    }
    if (facebookBtn) {
        facebookBtn.addEventListener('click', window.signInWithFacebook); // Access from global scope
    }
});