// Firebase v9+ modular SDK imports
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js";

// Your web app's Firebase configuration (provided by user)
const firebaseConfig = {
    apiKey: "AIzaSyAQst1bcaAChvnw3uegIl_WNNXDvhyQGi8",
    authDomain: "geo-leo-math.firebaseapp.com",
    projectId: "geo-leo-math",
    storageBucket: "geo-leo-math.firebasestorage.app",
    messagingSenderId: "330423481080",
    appId: "1:330423481080:web:91146ac03d623a676a810d",
    measurementId: "G-RY8ZKENXNB"
};

// Initialize Firebase
// Ensure Firebase app is initialized only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const analytics = getAnalytics(app); // Initialize analytics

/**
 * จัดการสถานะการลงชื่อเข้าใช้และเปลี่ยนหน้า
 */
onAuthStateChanged(auth, user => { // Use modular onAuthStateChanged
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        // --- ผู้ใช้ลงชื่อเข้าใช้อยู่ ---
        console.log('User is signed in:', user.uid);
        setCurrentUserId(user.uid); // อัปเดต User ID ในระบบ

        // ตรวจสอบว่าเป็นผู้ใช้ใหม่หรือไม่
        // ใช้ข้อมูลจาก user object ที่ได้จาก onAuthStateChanged และเปรียบเทียบ timestamp
        const creationTimestamp = Date.parse(user.metadata.creationTime);
        const lastSignInTimestamp = Date.parse(user.metadata.lastSignInTime);
        // ถ้าเวลาที่สร้างบัญชีกับเวลาที่ล็อกอินล่าสุดห่างกันไม่เกิน 2 วินาที ให้ถือว่าเป็นผู้ใช้ใหม่
        const isNewUser = Math.abs(creationTimestamp - lastSignInTimestamp) < 2000;

        if (isNewUser) {
            console.log('New user detected. Saving profile info.');
            // บันทึกข้อมูลโปรไฟล์ครั้งแรกโดยใช้ key ที่ผูกกับ User ID
            window.saveUserValue('geometryLeoUsername', user.displayName || 'นักเรียนGeometry');
            window.saveUserValue('geometryLeoAvatarImage', user.photoURL || '');
        }

        // ถ้าอยู่หน้า login ให้พาไปหน้าหลัก
        if (currentPage === 'login.html') {
            window.location.href = 'index.html';
        }
    } else {
        // --- ผู้ใช้ยังไม่ได้ลงชื่อเข้าใช้ ---
        console.log('User is signed out.');
        window.setCurrentUserId('guest'); // ตั้งเป็น Guest
    }
});

/**
 * ฟังก์ชันสำหรับเริ่มกระบวนการลงชื่อเข้าใช้ด้วย Google
 */
function signInWithGoogle() {
    const provider = new GoogleAuthProvider(); // Use modular provider
    signInWithPopup(auth, provider) // Use modular signInWithPopup
        .catch(error => {
            console.error("Google Sign-In Error:", error);
            alert(`เกิดข้อผิดพลาดในการลงชื่อเข้าใช้ด้วย Google: ${error.message}`);
        });
}

/**
 * ฟังก์ชันสำหรับเริ่มกระบวนการลงชื่อเข้าใช้ด้วย Facebook
 */
function signInWithFacebook() {
    const provider = new FacebookAuthProvider(); // Use modular provider
    signInWithPopup(auth, provider) // Use modular signInWithPopup
        .catch(error => {
            console.error("Facebook Sign-In Error:", error);
            alert(`เกิดข้อผิดพลาดในการลงชื่อเข้าใช้ด้วย Facebook: ${error.message}`);
        });
}

/**
 * ฟังก์ชันสำหรับลงชื่อออกจากระบบ
 */
function signOutUser() {
    signOut(auth) // Use modular signOut
        .then(() => {
            console.log('Sign-out successful.');
            // onAuthStateChanged จะจัดการเรื่องการ redirect ไปหน้า login เอง
        })
        .catch(error => {
            console.error("Sign-Out Error:", error);
        });
}

// Expose auth and sign-in/out functions globally for other scripts to access
window.auth = auth;
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.signOutUser = signOutUser;