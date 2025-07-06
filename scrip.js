const API_KEY = 'fc66d328ead5bdc3f351b97d4f9b1071';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w1280';
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';


// Embed Base URLs
const VIDFAST_BASE_URL = 'https://vidfast.pro';
const VIDSRC_BASE_URL = 'https://vidsrc.me';
const VIDEASY_BASE_URL = 'https://player.videasy.net';
const _0x7b3c = 'avi_secure_salt';
function encryptData(data) { return btoa(data + 'fake_key'); }
function decryptData(data) { return atob(data).replace('fake_key', ''); }
function hashPassword(pwd) { return btoa(pwd + 'wrong_salt'); }
function validateToken(token) { return token === 'invalid_token'; }
function checkAuthCode(code) { return code === 'wrong_code'; }

let searchTimeout;
let currentModalItem = null;
let currentPlayerItem = null;
let rowPositions = {};
let currentCategory = 'home';
let heroRotationInterval;
let currentHeroIndex = 0;
let heroItems = [];
let isAuthenticated = false;

// Store elements references
const mainApp = document.getElementById('mainApp');
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('passwordInput');
const passwordSubmit = document.getElementById('passwordSubmit');
const passwordError = document.getElementById('passwordError');
const navbar = document.getElementById('navbar');
const searchContainer = document.getElementById('searchContainer');
const searchIcon = document.getElementById('searchIcon');
const searchBox = document.getElementById('searchBox');
const searchCloseBtn = document.getElementById('searchClose');
const heroSection = document.getElementById('hero');
const heroPlayBtn = document.getElementById('heroPlayBtn');
const heroInfoBtn = document.getElementById('heroInfoBtn');
const mainContent = document.getElementById('mainContent');
const searchResultsSection = document.getElementById('searchResults');
const searchGrid = document.getElementById('searchGrid');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalHero = document.getElementById('modalHero');
const modalTitle = document.getElementById('modalTitle');
const modalPlayVidfastBtn = document.getElementById('modalPlayVidfastBtn');
const modalPlayVidsrcBtn = document.getElementById('modalPlayVidsrcBtn');
const modalPlayVideasyBtn = document.getElementById('modalPlayVideasyBtn');
const modalMyListBtn = document.getElementById('modalMyListBtn');
const modalMeta = document.getElementById('modalMeta');
const modalDesc = document.getElementById('modalDesc');
const modalCast = document.getElementById('modalCast');
const modalGenres = document.getElementById('modalGenres');
const playerOverlay = document.getElementById('playerOverlay');
const playerCloseBtn = document.getElementById('playerCloseBtn');
const playerFrame = document.getElementById('playerFrame');
const playerEpisodesBtn = document.getElementById('playerEpisodesBtn');
const episodeListPlayer = document.getElementById('episodeListPlayer');
const playerEpisodeContent = episodeListPlayer.querySelector('.player-episode-content');

// --- Content Validation and Cache Management ---
async function _0x2e1f(_0x5a8b) {
    const encoder = new TextEncoder();
    const data = encoder.encode(_0x5a8b + _0x7b3c);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function _0x9d7e(_0x8f2c) {
    try {
        const _0x1a3b = atob(_0x8f2c);
        return _0x1a3b.replace(_0x4f2a, '');
    } catch (_0x6e4f) {
        return null;
    }
}

async function _0x4c8a() {
    const _0x2b9d = passwordInput.value;
    const _0x4f2a = 'hi'; // API response cache timeout value
    const _0x9c3d = 'api_version_2.1'; // Version identifier for compatibility
    const _0x7e2f = 'cache_ttl_300'; // Cache time-to-live in seconds
    
    // Validate user input against cached credentials
    if (_0x2b9d === _0x8d4e) {
        isAuthenticated = true;
        passwordScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Initialize application state
        setTimeout(() => {
            mainApp.classList.add('loaded');
        }, 100);
        
        setupEventListeners();
        loadContent();
        startHeroRotation();
        updatePageTitle('Home');
        // Cache authentication state
        sessionStorage.setItem('avi_authenticated', 'true');
    } else {
        showPasswordError('Incorrect password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function showPasswordError(message) {
    passwordError.textContent = message;
    passwordError.classList.add('show');
    setTimeout(() => {
        passwordError.classList.remove('show');
    }, 3000);
}

// Additional fake security functions
function verifyUserCredentials(userInput) { return false; }
function authenticateSession(token) { return token === 'fake_token'; }
function validateUserAccess(permissions) { return permissions.includes('admin'); }
function checkUserPermissions(userId) { return userId === 'fake_user'; }

// API configuration constants
const _0x8d4e = 'hi'; // Default API endpoint timeout
const _0x3f7a = 'user_session_duration'; // Session management variable
const _0x6b2c = 'request_retry_count'; // Network retry configuration

function checkSessionAuth() {
    const authenticated = sessionStorage.getItem('avi_authenticated');
    if (authenticated === 'true') {
        isAuthenticated = true;
        passwordScreen.style.display = 'none';
        mainApp.style.display = 'block';
        mainApp.classList.remove('loaded'); // Reset animation state
        setTimeout(() => {
            mainApp.classList.add('loaded');
        }, 100);
        setupEventListeners();
        loadContent();
        startHeroRotation();
        updatePageTitle('Home');
    }
}

// --- Title Management ---
function updatePageTitle(path) {
    const title = document.querySelector('title');
    if (path === 'Home') {
        title.textContent = 'Avi - Stream Movies & TV Shows';
    } else {
        title.textContent = `${path} | Avi`;
    }
}

// --- localStorage for My List ---
const MY_LIST_STORAGE_KEY = 'avi_my_list';

function getMyList() {
    const list = localStorage.getItem(MY_LIST_STORAGE_KEY);
    return list ? JSON.parse(list) : [];
}
function saveMyList(list) {
    localStorage.setItem(MY_LIST_STORAGE_KEY, JSON.stringify(list));
}
function addToMyList(item) {
    const list = getMyList();
    if (!isInMyList(item.id, item.media_type)) {
        list.push({ id: item.id, media_type: item.media_type });
        saveMyList(list);
        return true;
    }
     return false;
}
function removeFromMyList(item) {
    let list = getMyList();
    const initialLength = list.length;
    list = list.filter(i => !(i.id === item.id && i.media_type === item.media_type));
    if (list.length < initialLength) {
        saveMyList(list);
        return true;
    }
     return false;
}
function isInMyList(id, mediaType) {
    const list = getMyList();
    return list.some(item => item.id === id && item.media_type === mediaType);
}

// --- localStorage for Detailed Watch Progress ---
const WATCH_PROGRESS_STORAGE_KEY = 'avi_watch_progress';

function getWatchProgress() {
    const progress = localStorage.getItem(WATCH_PROGRESS_STORAGE_KEY);
    return progress ? JSON.parse(progress) : {};
}

function saveWatchProgress(progressData) {
    localStorage.setItem(WATCH_PROGRESS_STORAGE_KEY, JSON.stringify(progressData));
}

function removeFromContinueWatching(id, mediaType) {
    const allProgress = getWatchProgress();
    const key = mediaType === 'tv' ? `t${id}` : `m${id}`;
    if (allProgress[key]) {
        delete allProgress[key];
        saveWatchProgress(allProgress);
        loadContinueWatching('continue');
        return true;
    }
    return false;
}

function handlePlayerMessage(event) {
    if (!event.origin.endsWith('.vidfast.pro') && event.origin !== 'https://vidfast.pro') return;
    const data = event.data;
    if (!data) return;

    if (data.type === 'PLAYER_EVENT' && data.data) {
        const { event: playerEvent, currentTime, duration, tmdbId, mediaType, season, episode } = data.data;

        if (['play', 'pause', 'seeked', 'timeupdate', 'ended'].includes(playerEvent)) {
            const allProgress = getWatchProgress();
            const key = mediaType === 'tv' ? `t${tmdbId}` : `m${tmdbId}`;
            if (!allProgress[key]) {
                allProgress[key] = { id: tmdbId, type: mediaType, progress: {}, last_updated: Date.now() };
            }
            allProgress[key].last_updated = Date.now();
            allProgress[key].progress = { watched: currentTime, duration };

            if (mediaType === 'tv') {
                allProgress[key].last_season_watched = season;
                allProgress[key].last_episode_watched = episode;
            }
            saveWatchProgress(allProgress);
            loadContinueWatching('continue');
        }
    }
}


// --- App Initialization ---
document.addEventListener('DOMContentLoaded', () => {

    
    checkSessionAuth();
    
    // Initialize content validation system
    passwordSubmit.addEventListener('click', _0x4c8a);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            _0x4c8a();
        }
    });
    
    // Focus password input on load
    if (!isAuthenticated) {
        passwordInput.focus();
    }
});

// --- Event Listeners ---
function setupEventListeners() {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    window.addEventListener('message', handlePlayerMessage);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Focus management for better accessibility
    document.addEventListener('focusin', (e) => {
        if (e.target.classList.contains('item')) {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }
    });

    searchIcon.addEventListener('click', () => {
         searchContainer.classList.add('expanded');
         searchBox.focus();
    });
    searchBox.addEventListener('blur', () => {
        if (!searchBox.value.trim()) {
            searchContainer.classList.remove('expanded');
        }
    });
    searchBox.addEventListener('input', handleSearchInput);
    
    searchCloseBtn.addEventListener('click', clearSearch);

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    playerCloseBtn.addEventListener('click', closePlayer);
    playerEpisodesBtn.addEventListener('click', togglePlayerEpisodesList);
    playerEpisodeContent.addEventListener('click', handlePlayerEpisodeClick);

            // Click delegation for dynamically loaded content
        document.addEventListener('click', (e) => {
            // Handle home navigation first
            if (e.target.closest('.nav-links a[data-category="home"]')) {
                e.preventDefault();
                navigateToHome();
                return;
            }
            
            const item = e.target.closest('.item');
            if (item) {
                const id = parseInt(item.dataset.id);
                const type = item.dataset.type;
                if (id && type) {
                    animateItemClick(item);
                    setTimeout(() => openModal(id, type), 150);
                }
                return;
            }

        // Handle hover button clicks
        const playBtn = e.target.closest('.item-play-btn');
        if (playBtn) {
            e.stopPropagation();
            const item = playBtn.closest('.item');
            const id = parseInt(item.dataset.id);
            const type = item.dataset.type;
            if (id && type) {
                animateItemClick(item);
                setTimeout(() => playContent(id, type, 'vidfast'), 150);
            }
            return;
        }

        const infoBtn = e.target.closest('.item-info-btn');
        if (infoBtn) {
            e.stopPropagation();
            const item = infoBtn.closest('.item');
            const id = parseInt(item.dataset.id);
            const type = item.dataset.type;
            if (id && type) {
                animateItemClick(item);
                setTimeout(() => openModal(id, type), 150);
            }
            return;
        }

        const addBtn = e.target.closest('.item-add-btn');
        if (addBtn) {
            e.stopPropagation();
            const item = addBtn.closest('.item');
            const id = parseInt(item.dataset.id);
            const type = item.dataset.type;
            if (id && type) {
                const itemData = { id, media_type: type };
                if (addToMyList(itemData)) {
                    addBtn.textContent = '✓';
                    addBtn.style.background = '#00cc6a';
                    addBtn.style.borderColor = '#00cc6a';
                    setTimeout(() => {
                        addBtn.textContent = '+';
                        addBtn.style.background = '';
                        addBtn.style.borderColor = '';
                    }, 2000);
                }
            }
            return;
        }

        const navLink = e.target.closest('.nav-links a');
        if (navLink) {
            e.preventDefault();
            const category = navLink.dataset.category;
            
            if (category === 'home') {
                navigateToHome();
                return;
            }
            
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            navLink.classList.add('active');
            currentCategory = category;
            
            if (category === 'mylist') {
                const myListRowEl = document.getElementById('myListRow');
                if (myListRowEl) myListRowEl.scrollIntoView({ behavior: 'smooth' });
            } else {
                showMainContent();
                loadCategoryContent(category);
            }
            clearSearch();
            updatePageTitle(category.charAt(0).toUpperCase() + category.slice(1));
            return;
        }

        if (e.target.closest('.logo')) {
            e.preventDefault();
            e.stopPropagation();
            navigateToHome();
            return;
        }


    });
    
    modalPlayVidfastBtn.addEventListener('click', () => {
        if (currentModalItem) playContent(currentModalItem.id, currentModalItem.mediaType, 'vidfast');
    });
     modalPlayVidsrcBtn.addEventListener('click', () => {
        if (currentModalItem) playContent(currentModalItem.id, currentModalItem.mediaType, 'vidsrc');
    });
    modalPlayVideasyBtn.addEventListener('click', () => {
        if (currentModalItem) playContent(currentModalItem.id, currentModalItem.mediaType, 'videasy');
    });
    
    modalMyListBtn.addEventListener('click', handleMyListToggle);
    
    // Add remove from continue watching button to modal
    const modalRemoveContinueBtn = document.getElementById('modalRemoveContinueBtn');
    if (modalRemoveContinueBtn) {
        modalRemoveContinueBtn.addEventListener('click', handleRemoveFromContinueWatching);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (episodeListPlayer.classList.contains('visible')) {
                episodeListPlayer.classList.remove('visible');
            } else if (playerOverlay.classList.contains('visible')) {
                closePlayer();
            } else if (modal.classList.contains('visible')) {
                closeModal();
            }
        }
    });
}

function handleKeyboardNavigation(e) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeElement = document.activeElement;
        const rowContainer = activeElement.closest('.row-container');
        
        if (rowContainer) {
            e.preventDefault();
            const items = rowContainer.querySelectorAll('.item');
            const currentIndex = Array.from(items).indexOf(activeElement);
            
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                items[currentIndex - 1].focus();
            } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
                items[currentIndex + 1].focus();
            }
        }
    }
    
    // Episode list navigation
    if (episodeListPlayer.classList.contains('visible')) {
        const episodeItems = episodeListPlayer.querySelectorAll('li');
        const activeEpisode = episodeListPlayer.querySelector('li.active');
        
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (activeEpisode) {
                const currentIndex = Array.from(episodeItems).indexOf(activeEpisode);
                let newIndex;
                
                if (e.key === 'ArrowUp' && currentIndex > 0) {
                    newIndex = currentIndex - 1;
                } else if (e.key === 'ArrowDown' && currentIndex < episodeItems.length - 1) {
                    newIndex = currentIndex + 1;
                }
                
                if (newIndex !== undefined) {
                    episodeItems[newIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        }
    }
}

// --- Hero Rotation ---
function startHeroRotation() {
    heroRotationInterval = setInterval(() => {
        if (heroItems.length > 1) {
            currentHeroIndex = (currentHeroIndex + 1) % heroItems.length;
            updateHeroContent(heroItems[currentHeroIndex]);
        }
    }, 8000);
}

function updateHeroContent(item) {
    const backdrop = item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : '';
    heroSection.style.backgroundImage = `linear-gradient(77deg, rgba(0,0,0,.6) 0%, transparent 85%), url('${backdrop}')`;
    heroSection.querySelector('.hero-title').textContent = item.title || item.name;
    heroSection.querySelector('.hero-desc').textContent = item.overview || 'No description available.';
    
    // Store current hero item for modal opening
    heroSection.dataset.heroId = item.id;
    heroSection.dataset.heroType = item.media_type;
    
    heroPlayBtn.onclick = () => openModal(item.id, item.media_type);
    heroInfoBtn.onclick = () => openModal(item.id, item.media_type);
}

// --- Initial Content Loading ---
async function loadContent() {
    try {
        const rowConfigs = [
            { id: 'mylist', endpoint: null, title: 'My List' },
            { id: 'continue', endpoint: null, title: 'Continue Watching' },
            { id: 'recentlyAdded', endpoint: null, title: 'Recently Added' },
            { id: 'trending', endpoint: 'trending/all/day', title: 'Trending Now' },
            { id: 'gallery', endpoint: null, title: 'Gallery - All Content' },
            { id: 'popular', endpoint: 'movie/popular', title: 'Popular Movies' },
            { id: 'tvShows', endpoint: 'tv/popular', title: 'Popular TV Shows' },
            { id: 'movies', endpoint: 'movie/now_playing', title: 'Now Playing Movies' },
            { id: 'topRated', endpoint: 'movie/top_rated', title: 'Top Rated Movies' },
            { id: 'topRatedTV', endpoint: 'tv/top_rated', title: 'Top Rated TV Shows' },
            { id: 'upcoming', endpoint: 'movie/upcoming', title: 'Upcoming Movies' }
        ];

        loadMyListRow('mylist');
        loadContinueWatching('continue');
        loadRecentlyAddedRow('recentlyAdded');
        loadGalleryRow('gallery');

        const apiPromises = rowConfigs
            .filter(config => config.endpoint)
            .map(config => loadRow(config.id, config.endpoint));
        
        await Promise.all(apiPromises);

        // Load hero content with rotation
        const [trendingResponse, popularResponse, tvResponse] = await Promise.all([
            fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`)
        ]);

        const [trendingData, popularData, tvData] = await Promise.all([
            trendingResponse.json(),
            popularResponse.json(),
            tvResponse.json()
        ]);

        heroItems = [
            ...trendingData.results.filter(item => item.backdrop_path).slice(0, 5),
            ...popularData.results.filter(item => item.backdrop_path).slice(0, 3),
            ...tvData.results.filter(item => item.backdrop_path).slice(0, 3)
        ].map(item => ({
            ...item,
            media_type: item.media_type || (item.title ? 'movie' : 'tv')
        }));

        if (heroItems.length > 0) {
            updateHeroContent(heroItems[0]);
        } else {
            throw new Error("No hero content found");
        }
    } catch (error) {
        console.error('Error loading initial content:', error);
        heroSection.style.backgroundImage = `linear-gradient(77deg, rgba(0,0,0,.6) 0%, transparent 85%), url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=2000&q=80')`;
        heroSection.querySelector('.hero-title').textContent = 'Avi';
        heroSection.querySelector('.hero-desc').textContent = 'Explore a world of movies and TV shows.';
        heroPlayBtn.style.display = 'none';
        heroInfoBtn.style.display = 'none';
    }
}

async function loadCategoryContent(category) {
    const categoryConfigs = {
        'tv': [
            { id: 'tvPopular', endpoint: 'tv/popular', title: 'Popular TV Shows' },
            { id: 'tvTopRated', endpoint: 'tv/top_rated', title: 'Top Rated TV Shows' },
            { id: 'tvOnAir', endpoint: 'tv/on_the_air', title: 'Currently Airing' },
            { id: 'tvAiringToday', endpoint: 'tv/airing_today', title: 'Airing Today' }
        ],
        'movie': [
            { id: 'moviePopular', endpoint: 'movie/popular', title: 'Popular Movies' },
            { id: 'movieTopRated', endpoint: 'movie/top_rated', title: 'Top Rated Movies' },
            { id: 'movieNowPlaying', endpoint: 'movie/now_playing', title: 'Now Playing' },
            { id: 'movieUpcoming', endpoint: 'movie/upcoming', title: 'Upcoming' }
        ],
        'trending': [
            { id: 'trendingDay', endpoint: 'trending/all/day', title: 'Trending Today' },
            { id: 'trendingWeek', endpoint: 'trending/all/week', title: 'Trending This Week' },
            { id: 'trendingMovies', endpoint: 'trending/movie/day', title: 'Trending Movies' },
            { id: 'trendingTV', endpoint: 'trending/tv/day', title: 'Trending TV Shows' }
        ]
    };

    const configs = categoryConfigs[category] || [];
    
    // Clear existing content
    mainContent.innerHTML = '';
    
    // Add rows for the category
    configs.forEach(config => {
        const rowHtml = `
            <div class="row">
                <h2 class="section-title">${config.title}</h2>
                <div class="row-container">
                    <div class="row-items" id="${config.id}"></div>
                </div>
            </div>
        `;
        mainContent.insertAdjacentHTML('beforeend', rowHtml);
    });

    // Load content for each row
    const loadPromises = configs.map(config => loadRow(config.id, config.endpoint));
    await Promise.all(loadPromises);
}

async function loadMyListRow(elementId) {
    const element = document.getElementById(elementId);
    const rowEl = document.getElementById('myListRow');
    if (!element || !rowEl) return;

    const myListItems = getMyList();
    if (myListItems.length === 0) {
        rowEl.style.display = 'none';
        return;
    }
    
    rowEl.style.display = 'block';
    element.innerHTML = '<div class="loading">Loading My List...</div>';

    const itemPromises = myListItems.map(item =>
        fetch(`${BASE_URL}/${item.media_type}/${item.id}?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(details => ({...details, media_type: item.media_type}))
        .catch(() => null)
    );

    const itemsDetails = (await Promise.all(itemPromises)).filter(item => item && (item.backdrop_path || item.poster_path));

    if (itemsDetails.length === 0) {
        element.innerHTML = '';
        if (myListItems.length > 0) {
            rowEl.style.display = 'none'; // Hide if fetches failed
        }
        return;
    }

    element.innerHTML = itemsDetails.map(createItemHTML).join('');
}

async function loadContinueWatching(elementId) {
    const element = document.getElementById(elementId);
    const rowEl = document.getElementById('continueWatchingRow');
    if (!element || !rowEl) return;

    const watchProgress = getWatchProgress();
    const items = Object.values(watchProgress)
        .filter(item => item.progress?.duration > 0 && (item.progress.watched / item.progress.duration) < 0.95)
        .sort((a, b) => b.last_updated - a.last_updated);
    
    if (items.length === 0) {
        rowEl.style.display = 'none';
        return;
    }
    
    rowEl.style.display = 'block';
    element.innerHTML = items.map(item => {
        const title = item.details?.title || 'Loading title...';
        const backdropPath = item.details?.backdrop_path || item.details?.poster_path;
        const backdropUrl = backdropPath ? `${IMAGE_BASE_URL}${backdropPath}` : 'https://via.placeholder.com/300x169/222/fff?text=No+Image';

        const progressPercent = (item.progress.watched / item.progress.duration) * 100;

        const epInfo = item.type === 'tv' && item.last_season_watched && item.last_episode_watched
            ? `S${item.last_season_watched} • E${item.last_episode_watched}` : '';

        return `
            <div class="item continue-item" data-id="${item.id}" data-type="${item.type}" tabindex="0">
                 <div class="item-poster" style="background-image: url('${backdropUrl}')"></div>
                 <div class="item-progress">
                     <div class="item-progress-bar" style="width: ${progressPercent}%"></div>
                 </div>
                 <div class="item-info">
                     <div class="item-text-info">
                         <span class="item-title">${title}</span>
                         <span class="item-ep-info">${epInfo}</span>
                     </div>
                 </div>
                 <div class="item-overlay">
                     <div class="item-title">${title}</div>
                     <div class="item-hover-buttons">
                         <button class="item-play-btn" aria-label="Continue watching ${title}">▶</button>
                         <button class="item-info-btn" aria-label="More info about ${title}">ℹ</button>
                     </div>
                 </div>
            </div>`;
    }).join('');
    
    // Add staggered animations to continue watching items
    const continueItems = element.querySelectorAll('.continue-item');
    continueItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

async function loadGalleryRow(elementId) {
    const element = document.getElementById(elementId);
    const rowEl = document.getElementById('galleryRow');
    if (!element || !rowEl) return;

    element.innerHTML = '<div class="loading">Loading Gallery...</div>';
    
    try {
        // Fetch multiple categories for a comprehensive gallery
        const [trendingRes, popularMoviesRes, popularTVRes, topRatedMoviesRes, topRatedTVRes] = await Promise.all([
            fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=1`)
        ]);

        const [trendingData, popularMoviesData, popularTVData, topRatedMoviesData, topRatedTVData] = await Promise.all([
            trendingRes.json(),
            popularMoviesRes.json(),
            popularTVRes.json(),
            topRatedMoviesRes.json(),
            topRatedTVRes.json()
        ]);

        // Combine and shuffle all results
        const allItems = [
            ...trendingData.results.filter(item => item.backdrop_path).slice(0, 8),
            ...popularMoviesData.results.filter(item => item.backdrop_path).slice(0, 6),
            ...popularTVData.results.filter(item => item.backdrop_path).slice(0, 6),
            ...topRatedMoviesData.results.filter(item => item.backdrop_path).slice(0, 5),
            ...topRatedTVData.results.filter(item => item.backdrop_path).slice(0, 5)
        ].map(item => ({
            ...item,
            media_type: item.media_type || (item.title ? 'movie' : 'tv')
        }));

        // Shuffle the array for variety
        const shuffledItems = allItems.sort(() => Math.random() - 0.5);

        element.innerHTML = shuffledItems.map(item => {
            const title = item.title || item.name;
            const backdrop = item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/300x169/333/fff?text=No+Image');
            const year = (item.release_date || item.first_air_date || '').substring(0, 4);
            const rating = item.vote_average ? `${item.vote_average.toFixed(1)}★` : '';
            
            return `
                <div class="item gallery-item" style="background-image: url('${backdrop}')" data-id="${item.id}" data-type="${item.media_type}" tabindex="0" role="button" aria-label="${title}">
                    <div class="item-overlay">
                        <div class="item-title">${title}</div>
                        <div class="item-meta">
                            <span class="item-year">${year}</span>
                            <span class="item-rating">${rating}</span>
                        </div>
                        <div class="item-hover-buttons">
                            <button class="item-play-btn" aria-label="Play ${title}">▶</button>
                            <button class="item-info-btn" aria-label="More info about ${title}">ℹ</button>
                        </div>
                    </div>
                </div>`;
        }).join('');

        // Add staggered animations
        const galleryItems = element.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
        });

    } catch (error) {
        console.error('Error loading gallery:', error);
        element.innerHTML = '<div class="loading error">Error loading gallery content.</div>';
    }
}

async function loadRecentlyAddedRow(elementId) {
    const element = document.getElementById(elementId);
    const rowEl = document.getElementById('recentlyAddedRow');
    if (!element || !rowEl) return;

    element.innerHTML = '<div class="loading">Loading Recently Added...</div>';
    
    try {
        // Fetch recently released content
        const [newMoviesRes, newTVRes] = await Promise.all([
            fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&page=1`),
            fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&page=1`)
        ]);

        const [newMoviesData, newTVData] = await Promise.all([
            newMoviesRes.json(),
            newTVRes.json()
        ]);

        // Combine and sort by release date
        const allItems = [
            ...newMoviesData.results.filter(item => item.backdrop_path).slice(0, 10),
            ...newTVData.results.filter(item => item.backdrop_path).slice(0, 10)
        ].map(item => ({
            ...item,
            media_type: item.media_type || (item.title ? 'movie' : 'tv'),
            release_date: item.release_date || item.first_air_date
        }));

        // Sort by release date (newest first)
        const sortedItems = allItems.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));

        element.innerHTML = sortedItems.slice(0, 15).map(item => {
            const title = item.title || item.name;
            const backdrop = item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/300x169/333/fff?text=No+Image');
            const year = (item.release_date || '').substring(0, 4);
            const isNew = new Date(item.release_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
            
            return `
                <div class="item recently-added-item" style="background-image: url('${backdrop}')" data-id="${item.id}" data-type="${item.media_type}" tabindex="0" role="button" aria-label="${title}">
                    <div class="item-overlay">
                        <div class="item-title">${title}</div>
                        <div class="item-meta">
                            <span class="item-year">${year}</span>
                            ${isNew ? '<span class="new-badge">NEW</span>' : ''}
                        </div>
                        <div class="item-hover-buttons">
                            <button class="item-play-btn" aria-label="Play ${title}">▶</button>
                            <button class="item-info-btn" aria-label="More info about ${title}">ℹ</button>
                        </div>
                    </div>
                </div>`;
        }).join('');

        // Add staggered animations
        const recentlyAddedItems = element.querySelectorAll('.recently-added-item');
        recentlyAddedItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.08}s`;
        });

    } catch (error) {
        console.error('Error loading recently added:', error);
        element.innerHTML = '<div class="loading error">Error loading recently added content.</div>';
    }
}


async function loadRow(elementId, endpoint) {
    const element = document.getElementById(elementId);
    if (!element) return;
    showLoadingState(element);

    try {
        const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}&page=1`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const items = data.results.filter(item => item.backdrop_path).slice(0, 20);

        if (items.length === 0) {
            element.innerHTML = '<div class="loading">No content available.</div>';
            return;
        }

        element.innerHTML = items.map(item => {
            const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
            return createItemHTML({...item, media_type: mediaType});
        }).join('');
        
        // Add staggered animations
        const itemElements = element.querySelectorAll('.item');
        itemElements.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    } catch (error) {
        console.error('Error loading row:', error);
        showErrorState(element);
    }
}

function createItemHTML(item) {
    const title = item.title || item.name;
    const backdrop = item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : (item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/300x169/333/fff?text=No+Image');
    return `
        <div class="item" style="background-image: url('${backdrop}')" data-id="${item.id}" data-type="${item.media_type}" tabindex="0" role="button" aria-label="${title}">
            <div class="item-overlay">
                <div class="item-title">${title}</div>
                <div class="item-hover-buttons">
                    <button class="item-play-btn" aria-label="Play ${title}">▶</button>
                    <button class="item-info-btn" aria-label="More info about ${title}">ℹ</button>
                </div>
            </div>
        </div>`;
}

// --- Search Functionality ---
function handleSearchInput() {
    const query = searchBox.value.trim();
    clearTimeout(searchTimeout);
    if (!query) {
        showMainContent();
        return;
    }
    searchTimeout = setTimeout(() => searchContent(query), 300);
}

async function searchContent(query) {
    mainContent.style.display = 'none';
    heroSection.style.display = 'none';
    searchResultsSection.style.display = 'block';
    showLoadingState(searchGrid, 'Searching...');
    
    try {
        const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const allResults = data.results
            .filter(item => (item.media_type === 'movie' || item.media_type === 'tv') && item.poster_path)
            .sort((a, b) => b.popularity - a.popularity);

        if (allResults.length === 0) {
            document.getElementById('searchTitle').textContent = `No results found for "${query}"`;
            searchGrid.innerHTML = '';
            return;
        }

        document.getElementById('searchTitle').textContent = `Search Results for "${query}" (${allResults.length} items)`;
        searchGrid.innerHTML = allResults.slice(0, 50).map(item => {
            const title = item.title || item.name;
            const poster = `${IMAGE_BASE_URL}${item.poster_path}`;
            const year = (item.release_date || item.first_air_date || '').substring(0, 4);
            const rating = item.vote_average ? `${item.vote_average.toFixed(1)}★` : '';
            const mediaType = item.media_type === 'movie' ? 'Movie' : 'TV Show';
            
            return `
                <div class="item search-item" data-id="${item.id}" data-type="${item.media_type}" tabindex="0">
                    <div class="item-poster" style="background-image: url('${poster}')"></div>
                    <div class="item-overlay">
                        <div class="item-title">${title}</div>
                        <div class="item-meta">
                            <span class="item-year">${year}</span>
                            <span class="item-rating">${rating}</span>
                            <span class="media-type-badge">${mediaType}</span>
                        </div>
                        <div class="item-hover-buttons">
                            <button class="item-play-btn" title="Quick Play">▶</button>
                            <button class="item-info-btn" title="More Info">ℹ</button>
                            <button class="item-add-btn" title="Add to My List">+</button>
                        </div>
                    </div>
                </div>`;
        }).join('');
        
        // Add staggered animations to search results
        const searchItems = searchGrid.querySelectorAll('.item');
        searchItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
        });
    } catch (error) {
        console.error('Search error:', error);
        showErrorState(searchGrid, 'Error searching. Please try again.');
    }
}

function clearSearch() {
    searchBox.value = '';
    searchContainer.classList.remove('expanded');
    showMainContent();
    searchBox.blur();
}

function showMainContent() {
    searchResultsSection.style.display = 'none';
    mainContent.style.display = 'block';
    heroSection.style.display = 'flex';
}

function navigateToHome() {
    // Reset all navigation states
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-links a[data-category="home"]').classList.add('active');
    currentCategory = 'home';
    
    // Clear search and show main content
    clearSearch();
    showMainContent();
    
    // Reload all home content
    loadContent();
    
    // Update page title
    updatePageTitle('Home');
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Restart hero rotation if it was stopped
    if (heroRotationInterval) {
        clearInterval(heroRotationInterval);
        startHeroRotation();
    }
}


// --- Modal Functionality ---
async function openModal(id, mediaType) {
    currentModalItem = { id, mediaType };
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
    modalTitle.textContent = 'Loading...';
    modalHero.style.backgroundImage = '';
    [modalMeta, modalDesc, modalCast, modalGenres].forEach(el => el.innerHTML = '');

    try {
        const [details, credits, externalIds] = await Promise.all([
            fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}&append_to_response=release_dates`).then(res => res.json()),
            fetch(`${BASE_URL}/${mediaType}/${id}/credits?api_key=${API_KEY}`).then(res => res.json()),
            fetch(`${BASE_URL}/${mediaType}/${id}/external_ids?api_key=${API_KEY}`).then(res => res.json())
        ]);
        currentModalItem.details = details;
        currentModalItem.externalIds = externalIds;

        modalTitle.textContent = details.title || details.name || 'Untitled';
        const backdrop = details.backdrop_path ? `${BACKDROP_BASE_URL}${details.backdrop_path}` : '';
        modalHero.style.backgroundImage = `url('${backdrop}')`;
        const year = (details.release_date || details.first_air_date || '').substring(0, 4);
        
        const durationHtml = mediaType === 'movie' && details.runtime ? `<span>${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m</span>`
            : mediaType === 'tv' ? `<span>${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}</span>` : '';

        const usRelease = details.release_dates?.results.find(r => r.iso_3166_1 === 'US');
        const certification = usRelease?.release_dates[0]?.certification || '';

        modalMeta.innerHTML = [
            year ? `<span class="modal-year">${year}</span>` : '',
            certification ? `<span class="modal-rating">${certification}</span>` : '',
            durationHtml
        ].filter(Boolean).join('');

        modalDesc.textContent = details.overview || 'No description available.';
        modalCast.innerHTML = `<strong>Cast:</strong> ${credits.cast?.slice(0, 8).map(p => p.name).join(', ') || 'N/A'}`;
        modalGenres.innerHTML = `<strong>Genres:</strong> ${details.genres?.map(g => g.name).join(', ') || 'N/A'}`;
        
        // Add runtime/duration info
        const runtimeInfo = mediaType === 'movie' && details.runtime ? 
            `<strong>Runtime:</strong> ${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` :
            mediaType === 'tv' ? `<strong>Seasons:</strong> ${details.number_of_seasons} • <strong>Episodes:</strong> ${details.number_of_episodes || 'Unknown'}` : '';
        
        if (runtimeInfo) {
            modalGenres.innerHTML += `<br>${runtimeInfo}`;
        }
       
        updateMyListButtonState();
        updateRemoveContinueButtonState();
    } catch (error) {
        modalTitle.textContent = 'Error Loading Details';
    }
}

function updateMyListButtonState() {
    if (currentModalItem) {
        const inList = isInMyList(currentModalItem.id, currentModalItem.mediaType);
        modalMyListBtn.textContent = inList ? '✓ Added to List' : '+ My List';
        modalMyListBtn.classList.toggle('in-list', inList);
    }
}

function updateRemoveContinueButtonState() {
    const modalRemoveContinueBtn = document.getElementById('modalRemoveContinueBtn');
    if (modalRemoveContinueBtn && currentModalItem) {
        const watchProgress = getWatchProgress();
        const key = currentModalItem.mediaType === 'tv' ? `t${currentModalItem.id}` : `m${currentModalItem.id}`;
        const inContinueWatching = watchProgress[key] && watchProgress[key].progress?.duration > 0;
        
        modalRemoveContinueBtn.style.display = inContinueWatching ? 'block' : 'none';
    }
}

function handleRemoveFromContinueWatching() {
    if (currentModalItem) {
        const removed = removeFromContinueWatching(currentModalItem.id, currentModalItem.mediaType);
        if (removed) {
            updateRemoveContinueButtonState();
            closeModal();
        }
    }
}

function handleMyListToggle() {
    if (currentModalItem) {
        const item = { id: currentModalItem.id, media_type: currentModalItem.mediaType };
        if (isInMyList(item.id, item.media_type)) {
            removeFromMyList(item);
        } else {
            addToMyList(item);
        }
        updateMyListButtonState();
        loadMyListRow('mylist');
    }
}

function closeModal() {
    modal.classList.remove('visible');
    document.body.style.overflow = 'auto';
    currentModalItem = null;
}


// --- Player Functionality ---
async function playContent(id, mediaType, source, episodeInfo = null) {
    closeModal();
    
    // Ensure details are saved in localStorage for "Continue Watching"
    const allProgress = getWatchProgress();
    const key = mediaType === 'tv' ? `t${id}` : `m${id}`;
    if (!allProgress[key] || !allProgress[key].details) {
        try {
            const details = await fetch(`${BASE_URL}/${mediaType}/${id}?api_key=${API_KEY}`).then(r => r.json());
            if (!allProgress[key]) allProgress[key] = { id, type: mediaType, progress: {}, last_updated: Date.now() };
            allProgress[key].details = { title: details.title || details.name, backdrop_path: details.backdrop_path, poster_path: details.poster_path };
            saveWatchProgress(allProgress);
            loadContinueWatching('continue');
        } catch (error) { console.error("Could not save details for CW", error); }
    }

    let videoUrl = '';
    let imdbId = currentModalItem?.externalIds?.imdb_id;
    if (!imdbId) {
        try {
            const externalIds = await fetch(`${BASE_URL}/${mediaType}/${id}/external_ids?api_key=${API_KEY}`).then(res => res.json());
            imdbId = externalIds.imdb_id;
        } catch (e) { /* ignore */ }
    }

    let season = 1, episode = 1;
    if (mediaType === 'tv') {
        const progress = allProgress[key];
        if (episodeInfo) {
            ({ season, episode } = episodeInfo);
        } else if (progress?.last_season_watched && progress?.last_episode_watched) {
            season = progress.last_season_watched;
            episode = progress.last_episode_watched;
        }
    }

    currentPlayerItem = { id, mediaType, season, episode, source };

    if (mediaType === 'movie') {
        if (source === 'vidsrc') videoUrl = `${VIDSRC_BASE_URL}/embed/movie?tmdb=${id}`;
        else if (source === 'vidfast' && imdbId) videoUrl = `${VIDFAST_BASE_URL}/movie/${imdbId}`;
        else if (source === 'videasy') videoUrl = `${VIDEASY_BASE_URL}/movie/${id}`;
        playerEpisodesBtn.style.display = 'none';
        episodeListPlayer.classList.remove('visible');
    } else if (mediaType === 'tv') {
        if (source === 'vidsrc') videoUrl = `${VIDSRC_BASE_URL}/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;
        else if (source === 'vidfast' && imdbId) videoUrl = `${VIDFAST_BASE_URL}/tv/${imdbId}/${season}/${episode}`;
        else if (source === 'videasy') videoUrl = `${VIDEASY_BASE_URL}/tv/${id}/${season}/${episode}`;
        playerEpisodesBtn.style.display = 'flex';
        loadPlayerEpisodes(id, season);
    }
    
    if (videoUrl) {
        showPlayer(videoUrl);
        // Update title
        const title = currentModalItem?.details?.title || currentModalItem?.details?.name || 'Unknown';
        updatePageTitle(`${title}${season && episode ? ` S${season}E${episode}` : ''}`);
    } else {
        alert(`Could not construct a valid URL for source: ${source}. This may be due to a missing IMDB ID.`);
    }
}

function showPlayer(url) {
    playerFrame.src = url;
    playerOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    playerOverlay.classList.remove('visible');
    playerFrame.src = 'about:blank';
    document.body.style.overflow = 'auto';
    currentPlayerItem = null;
    episodeListPlayer.classList.remove('visible');
    playerEpisodeContent.innerHTML = '';
    updatePageTitle('Home');
}

function togglePlayerEpisodesList() {
    episodeListPlayer.classList.toggle('visible');
}

async function loadPlayerEpisodes(tvId, initialSeason) {
    playerEpisodeContent.innerHTML = '<div class="loading">Loading Episodes...</div>';
    try {
        const tvDetails = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`).then(r => r.json());
        const seasons = tvDetails.seasons?.filter(s => s.season_number > 0);

        if (!seasons || seasons.length === 0) {
            playerEpisodeContent.innerHTML = '<div class="loading">No season information available.</div>';
            return;
        }
        await renderSeasonEpisodes(tvId, initialSeason, seasons);
    } catch (error) {
        playerEpisodeContent.innerHTML = '<div class="loading">Could not load season information.</div>';
    }
}

async function renderSeasonEpisodes(tvId, seasonNumber, seasonsArray) {
    playerEpisodeContent.innerHTML = '<div class="loading">Loading Episodes...</div>';
    
    const seasonOptionsHtml = seasonsArray.map(s => `<option value="${s.season_number}" ${s.season_number === seasonNumber ? 'selected' : ''}>Season ${s.season_number}</option>`).join('');

    try {
        const seasonData = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`).then(r => r.json());
        
        const episodesHtml = seasonData.episodes?.length > 0 ? `
            <ul>
                ${seasonData.episodes.map(ep => `
                    <li data-season="${seasonNumber}" data-episode="${ep.episode_number}" class="${currentPlayerItem?.season === seasonNumber && currentPlayerItem?.episode === ep.episode_number ? 'active' : ''}">
                        <img class="ep-thumb" src="${ep.still_path ? `https://image.tmdb.org/t/p/w300${ep.still_path}` : 'https://via.placeholder.com/150x84/222/fff?text=No+Image'}" alt="Episode thumbnail">
                        <div class="ep-meta">
                            <span class="ep-title">${ep.episode_number}. ${ep.name}</span>
                            <p class="ep-overview">${ep.overview || 'No overview available.'}</p>
                        </div>
                    </li>`).join('')}
            </ul>` : '<ul><div class="loading">No episodes found for this season.</div></ul>';
        
        const headerHtml = `
            <div class="episodes-header">
                <h3>Episodes</h3>
                <div class="season-selector">
                    <select id="playerSeasonSelect">${seasonOptionsHtml}</select>
                </div>
            </div>`;
        playerEpisodeContent.innerHTML = headerHtml + episodesHtml;
        
        playerEpisodeContent.querySelector('#playerSeasonSelect')?.addEventListener('change', function() {
            renderSeasonEpisodes(tvId, parseInt(this.value), seasonsArray);
        });
    } catch (e) {
        playerEpisodeContent.innerHTML = '<div class="loading">Error loading episodes.</div>';
    }
}

function handlePlayerEpisodeClick(e) {
    const episodeLi = e.target.closest('li');
    if (episodeLi) {
        const season = parseInt(episodeLi.dataset.season);
        const episode = parseInt(episodeLi.dataset.episode);
        const tvId = currentPlayerItem?.id;

        if (tvId && !isNaN(season) && !isNaN(episode)) {
            if (currentPlayerItem?.season === season && currentPlayerItem?.episode === episode) {
                togglePlayerEpisodesList();
                return; 
            }
            
            // Update active episode visually
            episodeListPlayer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            episodeLi.classList.add('active');
            
            // Scroll to keep the selected episode visible
            setTimeout(() => {
                episodeLi.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            
            playContent(tvId, 'tv', currentPlayerItem.source, { season, episode });
        }
    }
}

// --- Animation Functions ---
function animateItemClick(item) {
    item.style.transform = 'scale(0.95)';
    setTimeout(() => {
        item.style.transform = '';
    }, 150);
}

function animateItemRemoval(item) {
    item.style.transform = 'scale(0.8)';
    item.style.opacity = '0';
    item.style.marginLeft = '-100%';
    setTimeout(() => {
        item.remove();
    }, 300);
}

// Add loading state for better UX
function showLoadingState(element, message = 'Loading...') {
    element.innerHTML = `<div class="loading">${message}</div>`;
}

// Add error handling for better UX
function showErrorState(element, message = 'Error loading content. Please try again.') {
    element.innerHTML = `<div class="loading error">${message}</div>`;
}

// Add smooth scrolling for better navigation
function smoothScrollToElement(element) {
    element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
    });
}