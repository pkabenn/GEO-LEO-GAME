document.addEventListener('DOMContentLoaded', () => {
    const googleBtn = document.getElementById('google-signin');
    const facebookBtn = document.getElementById('facebook-signin');

    if (googleBtn) {
        googleBtn.addEventListener('click', signInWithGoogle);
    }
    if (facebookBtn) {
        facebookBtn.addEventListener('click', signInWithFacebook);
    }
});