// 📝 TODO: นำ firebaseConfig ที่คัดลอกมาจาก Firebase Console มาวางที่นี่
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/**
 * จัดการสถานะการลงชื่อเข้าใช้และเปลี่ยนหน้า
 */
auth.onAuthStateChanged(user => {
    const currentPage = window.location.pathname.split('/').pop();

    if (user) {
        // --- ผู้ใช้ลงชื่อเข้าใช้อยู่ ---
        console.log('User is signed in:', user.uid);
        setCurrentUserId(user.uid); // อัปเดต User ID ในระบบ

        // ตรวจสอบว่าเป็นผู้ใช้ใหม่หรือไม่
        const isNewUser = firebase.auth().currentUser.metadata.creationTime === firebase.auth().currentUser.metadata.lastSignInTime;

        if (isNewUser) {
            console.log('New user detected. Saving profile info.');
            // บันทึกข้อมูลโปรไฟล์ครั้งแรก
            saveUserValue('geometryLeoUsername', user.displayName || 'นักเรียนGeometry');
            saveUserValue('geometryLeoAvatarImage', user.photoURL || '');
        }

        // ถ้าอยู่หน้า login ให้พาไปหน้าหลัก
        if (currentPage === 'login.html') {
            window.location.href = 'index.html';
        }
    } else {
        // --- ผู้ใช้ยังไม่ได้ลงชื่อเข้าใช้ ---
        console.log('User is signed out.');
        setCurrentUserId('guest'); // ตั้งเป็น Guest
    }
});

/**
 * ฟังก์ชันสำหรับเริ่มกระบวนการลงชื่อเข้าใช้ด้วย Google
 */
function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .catch(error => {
            console.error("Google Sign-In Error:", error);
            alert(`เกิดข้อผิดพลาดในการลงชื่อเข้าใช้ด้วย Google: ${error.message}`);
        });
}

/**
 * ฟังก์ชันสำหรับเริ่มกระบวนการลงชื่อเข้าใช้ด้วย Facebook
 */
function signInWithFacebook() {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider)
        .catch(error => {
            console.error("Facebook Sign-In Error:", error);
            alert(`เกิดข้อผิดพลาดในการลงชื่อเข้าใช้ด้วย Facebook: ${error.message}`);
        });
}

/**
 * ฟังก์ชันสำหรับลงชื่อออกจากระบบ
 */
function signOutUser() {
    auth.signOut()
        .then(() => {
            console.log('Sign-out successful.');
            // onAuthStateChanged จะจัดการเรื่องการ redirect ไปหน้า login เอง
        })
        .catch(error => {
            console.error("Sign-Out Error:", error);
        });
}