document.getElementById('signup-btn').addEventListener('click', function() {
    // 1. Ambil input dari ID yang ada di HTML lo
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPass = document.getElementById('signup-confirm').value;

    // 2. Validasi: Jangan sampe ada kolom kosong
    if (!username || !email || !password || !confirmPass) {
        alert("Waduh, semua kolom harus diisi bro!");
        return;
    }

    // 3. Validasi: Password vs Konfirmasi Password
    if (password !== confirmPass) {
        alert("Password dan Konfirmasi Password nggak cocok!");
        return;
    }

    // 4. Validasi: Panjang password
    if (password.length < 6) {
        alert("Password minimal 6 karakter ya biar aman!");
        return;
    }

    // 5. Ambil data users yang sudah ada di localStorage
    let usersList = JSON.parse(localStorage.getItem('usersList')) || [];

    // 6. Cek apakah email sudah terdaftar sebelumnya
    const isExist = usersList.find(user => user.email === email);
    if (isExist) {
        alert("Email ini udah ada di database! Langsung login aja.");
        return;
    }

    // 7. Simpan user baru ke dalam array
    usersList.push({ 
        username: username, 
        email: email, 
        password: password 
    });

    // 8. Masukkan array ke localStorage
    localStorage.setItem('usersList', JSON.stringify(usersList));

    alert("Akun berhasil dibuat! Mantap, sekarang silakan login.");
    window.location.href = 'login.html';
});