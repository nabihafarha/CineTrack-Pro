document.getElementById('login-btn').addEventListener('click', function() {
    // 1. Ambil input dari HTML sesuai ID yang lo tulis (username & password)
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // 2. Ambil "Database" usersList dari localStorage
    const usersList = JSON.parse(localStorage.getItem('usersList')) || [];

    // 3. Validasi: Cari user yang USERNAME cocok DAN PASSWORD cocok
    // Karena di signup.js kita simpan 'username', kita cari berdasarkan itu
    const userFound = usersList.find(user => 
        user.username === usernameInput && user.password === passwordInput
    );

    if (userFound) {
        // LOGIN BERHASIL
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', userFound.username);
        
        alert(`Selamat datang kembali, ${userFound.username}!`);
        window.location.href = 'index.html'; // Pindah ke Home
    } else {
        // LOGIN GAGAL
        alert("Username atau Password salah! Cek lagi atau daftar dulu di signup.html");
    }
});

// Efek Google Login (Hiasan)
const googleBtn = document.querySelector('.google-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        alert("Fitur Google Login belum tersedia. Pake login manual dulu ya!");
    });
}