const API_KEY = '36997379cb101028f34d723880637d05';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w1280'; 

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

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

async function getMovieDetails() {
    if (!movieId) return;
    try {
        const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews,videos,watch/providers`);
        const movie = await res.json();
        renderDetails(movie);
    } catch (err) {
        console.error("Gagal ambil data:", err);
    }
}

function renderDetails(movie) {
    const container = document.getElementById('movie-details-container');
    
    // --- CEK APAKAH FILM SUDAH ADA DI WATCHLIST ---
    const savedWatchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    const isAlreadySaved = savedWatchlist.some(m => m.id === movie.id);

    // 1. Logika Watch Providers
    const providers = movie['watch/providers']?.results?.ID;
    let providersHTML = providers && providers.flatrate ? `
        <div class="providers-section" style="margin-top: 20px;">
            <p style="margin-bottom: 10px; font-weight: bold; color: #38bdf8;">Streaming on:</p>
            <div style="display: flex; gap: 10px;">
                ${providers.flatrate.map(p => `<img src="https://image.tmdb.org/t/p/original${p.logo_path}" title="${p.provider_name}" style="width: 40px; border-radius: 8px; border: 1px solid #334155;">`).join('')}
            </div>
        </div>` : `<p style="color: #94a3b8; font-size: 0.9rem; margin-top:15px;">🚫 Belum tersedia di streaming Indonesia.</p>`;

    // 2. Logika Trailer
    const videoData = movie.videos?.results || [];
    const trailer = videoData.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videoData.find(v => v.site === 'YouTube');
    const trailerHTML = trailer ? `<div class="trailer-container" style="margin-top: 50px;"><h2 style="margin-bottom: 20px; border-left: 5px solid #38bdf8; padding-left: 15px;">Official Trailer</h2><iframe width="100%" height="500" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" style="border-radius:15px;" allowfullscreen></iframe></div>` : '';

    // 3. Logika Cast & Review
    const castHTML = movie.credits?.cast?.slice(0, 6).map(person => `<div class="cast-card" style="text-align:center; background:#1e293b; padding:10px; border-radius:10px;"><img src="${person.profile_path ? 'https://image.tmdb.org/t/p/w200' + person.profile_path : 'https://via.placeholder.com/200x300'}" style="width:100%; border-radius:8px;"><p style="margin: 10px 0 0; font-size: 0.9rem;"><b>${person.name}</b></p><p style="font-size: 0.8rem; color: #94a3b8;">${person.character}</p></div>`).join('') || 'Data tidak tersedia';
    const reviewsHTML = movie.reviews?.results?.slice(0, 3).map(rev => `<div class="review-card" style="background:#1e293b; padding:20px; border-radius:10px; margin-bottom:15px; border-left:4px solid #38bdf8;"><h4 style="color:#38bdf8; margin-top:0;">${rev.author}</h4><p style="font-size:0.9rem;">"${rev.content.substring(0, 250)}..."</p></div>`).join('') || '<p>Belum ada review.</p>';

    // 4. RENDER UTAMA (Perhatikan bagian Button!)
    container.innerHTML = `
        <div class="hero-backdrop" style="position:absolute; width:100%; height:100vh; background-image:url('${movie.backdrop_path ? IMG_URL + movie.backdrop_path : ''}'); background-size:cover; background-position:center; filter:brightness(0.2) blur(8px); z-index:-1;"></div>
        
        <div class="details-content" style="display:flex; padding:100px 10% 50px; gap:50px;">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="detail-poster" style="width:350px; border-radius:15px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            <div class="info-text">
                <h1 style="font-size:3rem; margin-bottom:10px;">${movie.title}</h1>
                <div class="meta-row" style="display:flex; gap:20px; margin-bottom:15px; color:#94a3b8;">
                    <span>📅 ${movie.release_date}</span>
                    <span>⏱️ ${movie.runtime} min</span>
                    <span>⭐ ${movie.vote_average.toFixed(1)}</span>
                </div>
                <div class="genres">
                    ${movie.genres.map(g => `<span style="background:#334155; padding:5px 12px; border-radius:20px; margin-right:8px; font-size:0.8rem;">${g.name}</span>`).join('')}
                </div>
                
                ${providersHTML}

                <h3 style="margin-top:30px;">Overview</h3>
                <p style="line-height:1.6; color:#cbd5e1; max-width:800px;">${movie.overview}</p>
                
                <button class="primary-btn" 
                    onclick="addToWatchlist(${movie.id})" 
                    ${isAlreadySaved ? 'disabled style="width:220px; margin-top:20px; padding:12px; background:#22c55e; border:none; border-radius:8px; font-weight:bold; color:white; cursor:default;"' : 'style="width:220px; margin-top:20px; padding:12px; background:#38bdf8; border:none; border-radius:8px; font-weight:bold; color:white; cursor:pointer;"'}>
                    ${isAlreadySaved ? '✅ In Watchlist' : '+ Add to Watchlist'}
                </button>
            </div>
        </div>

        <div class="extra-info" style="padding: 50px 10%; background: #0f172a;">
            <div class="cast-section">
                <h2 style="margin-bottom: 25px; border-left: 5px solid #38bdf8; padding-left: 15px;">Top Cast</h2>
                <div class="cast-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px;">
                    ${castHTML}
                </div>
            </div>
            ${trailerHTML}
            <div class="reviews-section" style="margin-top: 50px;">
                <h2 style="margin-bottom: 25px; border-left: 5px solid #38bdf8; padding-left: 15px;">User Reviews</h2>
                ${reviewsHTML}
            </div>
        </div>`;
}

function addToWatchlist(movieId) {
    let watchlist = JSON.parse(localStorage.getItem('myWatchlist')) || [];
    if (watchlist.some(movie => movie.id === movieId)) return;

    const movieData = {
        id: movieId,
        title: document.querySelector('.info-text h1').innerText,
        poster: document.querySelector('.detail-poster').src,
        rating: document.querySelector('.meta-row span:last-child').innerText
    };

    watchlist.push(movieData);
    localStorage.setItem('myWatchlist', JSON.stringify(watchlist));

    const btn = document.querySelector('.primary-btn');
    btn.innerText = "✅ Added to Watchlist";
    btn.style.background = "#22c55e";
    btn.disabled = true;
    btn.style.cursor = "default";
}

getMovieDetails();