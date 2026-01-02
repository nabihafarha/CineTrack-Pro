const API_KEY = '36997379cb101028f34d723880637d05';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search');

function checkAuth() {
    const status = localStorage.getItem('isLoggedIn');
    if (status !== 'true') {
        window.location.href = 'login.html';
    }
}
checkAuth(); // Langsung jalankan saat page dibuka

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

function displayMovies(movies) {
    movieGrid.innerHTML = '';
    
    movies.forEach(movie => {
        const { id, title, poster_path, vote_average, release_date } = movie;
        const year = release_date ? release_date.split('-')[0] : 'N/A';
        
        const div = document.createElement('div');
        div.classList.add('movie-card');
        
        // Tambahkan event click ke seluruh card
        div.onclick = () => {
            window.location.href = `details.html?id=${id}`;
        };
        
        div.innerHTML = `
            <img src="${IMG_URL + poster_path}" alt="${title}">
            <div class="movie-info">
                <div class="title-section">
                    <h3>${title}</h3>
                    <span class="year">${year}</span>
                </div>
                <div class="rating">
                    <span class="star">★</span> ${vote_average.toFixed(1)}
                </div>
            </div>
        `;
        movieGrid.appendChild(div);
    });
}

// Fitur Search
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        getMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchInput.value}`);
    }
});

// Fitur Mood
function filterByMood(mood) {
    let genre = mood === 'healing' ? '35' : mood === 'adrenaline' ? '28' : mood === 'cry' ? '18' : '878';
    getMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genre}`);
}

// Load film populer pas awal buka
getMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);

