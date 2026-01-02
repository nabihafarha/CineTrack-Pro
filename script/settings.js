// Tampilkan username sekarang saat page dibuka
document.addEventListener('DOMContentLoaded', () => {
    const currentName = localStorage.getItem('currentUser');
    if (currentName) {
        document.getElementById('new-username').value = currentName;
    }
});

// 1. Fungsi Ganti Nama
function updateProfile() {
    const newName = document.getElementById('new-username').value.trim();
    if (!newName) return alert("Nama gak boleh kosong!");

    // Update username di session sekarang
    localStorage.setItem('currentUser', newName);

    // (Opsional) Update juga di daftar usersList agar permanen
    let usersList = JSON.parse(localStorage.getItem('usersList')) || [];
    alert("Profil berhasil diperbarui!");
    window.location.reload(); // Refresh biar navbar berubah
}

// 2. Fungsi Hapus Watchlist
function resetWatchlist() {
    if (confirm("Serius mau hapus semua isi watchlist? Gak bisa dibalikin lho!")) {
        localStorage.removeItem('myWatchlist');
        alert("Watchlist dikosongkan.");
    }
}