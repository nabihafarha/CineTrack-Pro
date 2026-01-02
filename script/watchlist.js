document.addEventListener('DOMContentLoaded', () => {
    const navAuth = document.getElementById('nav-auth');
    
    // Cek status login
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');

    if (isLoggedIn === 'true' && currentUser) {
        // JIKA SUDAH LOGIN: Munculkan Icon Profile (inisial nama)
        const initial = currentUser.charAt(0);
        navAuth.innerHTML = `
            <div class="profile-wrapper" onclick="toggleDropdown()">
                <span class="user-name">${currentUser}</span>
                <div class="profile-icon">${initial}</div>
            </div>
        `;
    } else {
        // JIKA BELUM LOGIN: Munculkan Tombol Login
        navAuth.innerHTML = `
            <a href="login.html" class="nav-login-btn">Login</a>
        `;
    }
});

// Tambahan fungsi logout kalau mau ditaruh di dropdown nanti
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.reload();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Fungsi manggil modal (Pas klik tombol Logout di Sidebar/Nav)
function logout() {
    const modal = document.getElementById('logout-modal');
    modal.style.display = 'flex';
}

// Fungsi tutup modal kalau gak jadi
function closeLogoutModal() {
    const modal = document.getElementById('logout-modal');
    modal.style.display = 'none';
}

// Fungsi beneran logout
function confirmLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Fungsi ambil data
async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);
}

const watchlistGrid = document.getElementById('watchlist-grid');
        const savedMovies = JSON.parse(localStorage.getItem('myWatchlist')) || [];

        if (savedMovies.length === 0) {
            watchlistGrid.innerHTML = `<h3 style="grid-column: 1/-1; text-align: center; color: #64748b;">Watchlist lo masih kosong nih...</h3>`;
        } else {
            savedMovies.forEach(movie => {
                const div = document.createElement('div');
                div.classList.add('movie-card');
                div.innerHTML = `
                    <img src="${movie.poster}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <div class="rating">${movie.rating}</div>
                    </div>
                    <button onclick="removeFromWatchlist(${movie.id})" style="width:100%; padding:10px; background:#ef4444; color:white; border:none; cursor:pointer;">Hapus</button>
                `;
                watchlistGrid.appendChild(div);
            });
        }

        function removeFromWatchlist(id) {
            let watchlist = JSON.parse(localStorage.getItem('myWatchlist'));
            watchlist = watchlist.filter(m => m.id !== id);
            localStorage.setItem('myWatchlist', JSON.stringify(watchlist));
            window.location.reload(); // Refresh buat update tampilan
        }