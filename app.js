// Global State
let currentUser = null;
let currentView = 'home';
let selectedMediaId = null;
let mediaData = [];
let categoriesData = [];

// Fetch initial data from DATA/DATA.json matching folder structure
document.addEventListener("DOMContentLoaded", () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('../DATA/DATA.json');
        const data = await response.json();
        mediaData = data.mediaItems;
        categoriesData = data.categories;
        
        // Initial Render
        renderApp();
    } catch (error) {
        console.error("Error al cargar DATA/DATA.json:", error);
        showNotification("Error al cargar los datos iniciales.", "error");
    }
}

function renderApp() {
    renderQuickPanel();
    renderTopFeatured();
    filterMedia();
    renderCategories();
    renderPendingMedia();
    updateUserUI();
}

// Navigation
function navigateTo(viewId, mediaId = null) {
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
    
    if (viewId === 'detail' && mediaId) {
        selectedMediaId = mediaId;
        renderMediaDetail(mediaId);
        document.getElementById('view-detail').classList.remove('hidden');
    } else {
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) targetView.classList.remove('hidden');
    }

    // Update Nav Active state across desktop and mobile nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('text-textBright'));
    const activeNav = document.getElementById(`nav-${viewId}`);
    if (activeNav) activeNav.classList.add('text-textBright');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Quick Nav Panel
function renderQuickPanel() {
    const container = document.getElementById('quick-panel-container');
    if (!container) return;
    
    container.innerHTML = mediaData.filter(m => m.approved).map(item => `
        <div onclick="navigateTo('detail', '${item.id}')" class="flex-none w-36 sm:w-44 bg-cardBg border border-gray-800 hover:border-textBright rounded-xl overflow-hidden cursor-pointer transition transform hover:-translate-y-1 flex-shrink-0">
            <img src="${item.image}" alt="${item.title}" class="w-full h-20 sm:h-24 object-cover">
            <div class="p-2">
                <p class="text-[11px] sm:text-xs font-bold text-white truncate">${item.title}</p>
                <span class="text-[9px] sm:text-[10px] text-goldAccent font-semibold">${item.category}</span>
            </div>
        </div>
    `).join('');
}

// Render Top Rated Panel
function renderTopFeatured() {
    const container = document.getElementById('top-featured-container');
    if (!container) return;

    const topRated = [...mediaData]
        .filter(m => m.approved)
        .sort((a, b) => (b.ratingSum / (b.ratingCount || 1)) - (a.ratingSum / (a.ratingCount || 1)))
        .slice(0, 3);

    container.innerHTML = topRated.map((item, index) => {
        const avg = (item.ratingSum / (item.ratingCount || 1)).toFixed(1);
        return `
            <div onclick="navigateTo('detail', '${item.id}')" class="bg-darkBg/80 border border-goldAccent/20 hover:border-goldAccent p-3 rounded-xl flex items-center gap-3 cursor-pointer transition">
                <span class="text-lg sm:text-xl font-display font-black text-goldAccent">#${index + 1}</span>
                <img src="${item.image}" class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0">
                <div class="flex-grow min-w-0">
                    <h4 class="text-xs font-bold text-white truncate">${item.title}</h4>
                    <p class="text-[10px] text-gray-400">${item.category}</p>
                </div>
                <div class="text-right flex-shrink-0">
                    <span class="text-xs font-bold text-goldAccent">★ ${avg}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Filter and Render Media Grid
function filterMedia() {
    const searchVal = document.getElementById('search-input')?.value.toLowerCase() || '';
    const catVal = document.getElementById('category-filter')?.value || 'ALL';
    const sortVal = document.getElementById('sort-order')?.value || 'ranking';

    let filtered = mediaData.filter(m => m.approved && 
        (m.title.toLowerCase().includes(searchVal) || m.description.toLowerCase().includes(searchVal)) &&
        (catVal === 'ALL' || m.category === catVal)
    );

    if (sortVal === 'rating') {
        filtered.sort((a, b) => (b.ratingSum / (b.ratingCount || 1)) - (a.ratingSum / (a.ratingCount || 1)));
    } else if (sortVal === 'newest') {
        filtered.sort((a, b) => b.year - a.year);
    }

    const grid = document.getElementById('media-grid');
    if (grid) {
        grid.innerHTML = filtered.map(item => {
            const avg = (item.ratingSum / (item.ratingCount || 1)).toFixed(1);
            return `
                <div onclick="navigateTo('detail', '${item.id}')" class="bg-cardBg border border-gray-800 hover:border-goldAccent/50 rounded-2xl overflow-hidden shadow-lg transition duration-300 hover:-translate-y-1 cursor-pointer flex flex-col">
                    <img src="${item.image}" alt="${item.title}" class="w-full h-40 sm:h-48 object-cover">
                    <div class="p-3 sm:p-4 flex flex-col flex-grow justify-between space-y-3">
                        <div>
                            <span class="text-[9px] sm:text-[10px] uppercase font-bold text-goldAccent tracking-wider bg-goldAccent/10 px-2 py-0.5 rounded border border-goldAccent/20">${item.category}</span>
                            <h3 class="text-sm sm:text-base font-bold text-white mt-2">${item.title} (${item.year})</h3>
                            <p class="text-xs text-gray-400 line-clamp-2 mt-1">${item.description}</p>
                        </div>
                        <div class="flex items-center justify-between border-t border-gray-800 pt-2 text-xs">
                            <span class="text-goldAccent font-bold">★ ${avg} / 10</span>
                            <span class="text-gray-500">${item.reviews ? item.reviews.length : 0} reseñas</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    const countBadge = document.getElementById('item-count-badge');
    if (countBadge) countBadge.innerText = `${filtered.length} obras`;
}

// Detail View
function renderMediaDetail(id) {
    const item = mediaData.find(m => m.id === id);
    if (!item) return;

    const avg = (item.ratingSum / (item.ratingCount || 1)).toFixed(1);
    const isAdmin = currentUser && currentUser.role === 'admin';

    const header = document.getElementById('detail-header-card');
    if (header) {
        header.innerHTML = `
            <img src="${item.image}" class="w-full md:w-56 h-60 sm:h-72 object-cover rounded-2xl shadow-xl flex-shrink-0">
            <div class="flex-grow space-y-3 sm:space-y-4">
                <div class="flex items-center justify-between">
                    <span class="text-[10px] sm:text-xs font-bold uppercase text-goldAccent bg-goldAccent/10 px-3 py-1 rounded-full border border-goldAccent/20">${item.category}</span>
                    <span class="text-xl sm:text-2xl font-bold text-goldAccent">★ ${avg} <span class="text-xs text-gray-400">/ 10</span></span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-display font-extrabold text-white">${item.title} (${item.year})</h1>
                <p class="text-xs sm:text-sm text-gray-300 leading-relaxed">${item.description}</p>
                
                ${isAdmin ? `
                    <div class="pt-4 border-t border-gray-800 flex gap-2">
                        <button onclick="editMediaInline('${item.id}')" class="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-4 py-2 rounded-lg transition">
                            <i class="fa-solid fa-pen"></i> Editar Datos (Admin)
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Render Reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (reviewsContainer) {
        reviewsContainer.innerHTML = item.reviews && item.reviews.length > 0 ? item.reviews.map(r => `
            <div class="bg-darkBg p-3 sm:p-4 rounded-xl border border-gray-800 space-y-2">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-xs sm:text-sm text-white">${r.userName}</span>
                    <span class="text-xs text-goldAccent font-bold">★ ${r.rating}/10</span>
                </div>
                <h4 class="text-xs font-semibold text-textBright">${r.title}</h4>
                <p class="text-xs text-gray-400">${r.comment}</p>
            </div>
        `).join('') : '<p class="text-xs text-gray-500 italic">No hay reseñas aún. ¡Sé el primero en opinar!</p>';
    }
}

// Review Submission (Voting Guard)
function handleReviewSubmit(e) {
    e.preventDefault();
    if (!currentUser) {
        alert("¡Atención! Debes iniciar sesión para votar y publicar una reseña.");
        openAuthModal();
        return;
    }

    const rating = parseInt(document.getElementById('review-rating').value);
    const title = document.getElementById('review-title').value;
    const comment = document.getElementById('review-comment').value;

    const item = mediaData.find(m => m.id === selectedMediaId);
    if (item) {
        item.ratingSum += rating;
        item.ratingCount += 1;
        if (!item.reviews) item.reviews = [];
        item.reviews.unshift({
            userName: currentUser.name,
            rating,
            title,
            comment,
            date: new Date().toISOString().split('T')[0]
        });

        renderMediaDetail(selectedMediaId);
        showNotification("¡Reseña publicada con éxito!", "success");
        document.getElementById('review-form').reset();
    }
}

// Authentication Handlers
function openAuthModal() { document.getElementById('auth-modal').classList.remove('hidden'); }
function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }
function switchAuthTab(tab) {
    if (tab === 'login') {
        document.getElementById('form-login').classList.remove('hidden');
        document.getElementById('form-register').classList.add('hidden');
    } else {
        document.getElementById('form-login').classList.add('hidden');
        document.getElementById('form-register').classList.remove('hidden');
    }
}

function handleLogin(e) {
    e.preventDefault();
    const role = document.querySelector('input[name="demo-role"]:checked').value;
    currentUser = {
        name: role === 'admin' ? 'Administrador' : 'Usuario Normal',
        role: role
    };
    updateUserUI();
    closeAuthModal();
    showNotification(`Sesión iniciada como ${currentUser.name}`, "success");
    if (selectedMediaId) renderMediaDetail(selectedMediaId);
}

function updateUserUI() {
    const badge = document.getElementById('user-badge');
    const rolePill = document.getElementById('user-role-pill');
    const nameDisplay = document.getElementById('user-name-display');
    const adminNav = document.getElementById('nav-admin');
    const adminNavM = document.getElementById('nav-admin-m');

    if (currentUser) {
        badge.classList.remove('hidden');
        rolePill.innerText = currentUser.role.toUpperCase();
        nameDisplay.innerText = currentUser.name;
        if (currentUser.role === 'admin') {
            if (adminNav) adminNav.classList.remove('hidden');
            if (adminNavM) adminNavM.classList.remove('hidden');
        } else {
            if (adminNav) adminNav.classList.add('hidden');
            if (adminNavM) adminNavM.classList.add('hidden');
        }
    } else {
        badge.classList.add('hidden');
        if (adminNav) adminNav.classList.add('hidden');
        if (adminNavM) adminNavM.classList.add('hidden');
    }
}

// Notifications & Modals
function showNotification(msg, type = "info") {
    const banner = document.getElementById('notification-banner');
    const message = document.getElementById('notification-message');
    if (banner && message) {
        message.innerText = msg;
        banner.classList.remove('hidden');
        setTimeout(() => banner.classList.add('hidden'), 4000);
    }
}
function closeNotification() { document.getElementById('notification-banner').classList.add('hidden'); }
function toggleGuideModal() { document.getElementById('guide-modal').classList.toggle('hidden'); }

// Inline Admin Editing
function editMediaInline(id) {
    const item = mediaData.find(m => m.id === id);
    if (!item) return;

    const newTitle = prompt("Nuevo Título:", item.title);
    const newImage = prompt("URL de la Imagen:", item.image);
    const newDesc = prompt("Nueva Descripción:", item.description);

    if (newTitle) item.title = newTitle;
    if (newImage) item.image = newImage;
    if (newDesc) item.description = newDesc;

    renderMediaDetail(id);
    renderApp();
    showNotification("Datos actualizados correctamente.", "success");
}

// Admin Operations
function renderCategories() {
    const container = document.getElementById('admin-categories-list');
    if (container) {
        container.innerHTML = categoriesData.map(c => `
            <span class="inline-block bg-darkBg text-textBright border border-gray-700 px-3 py-1 rounded-full text-xs font-semibold mr-2 mb-2">${c}</span>
        `).join('');
    }
}

function renderPendingMedia() {
    const table = document.getElementById('admin-pending-table');
    if (!table) return;
    const pending = mediaData.filter(m => !m.approved);
    
    table.innerHTML = pending.length ? pending.map(p => `
        <tr>
            <td class="p-2 sm:p-3 font-bold text-white">${p.title}</td>
            <td class="p-2 sm:p-3">${p.category}</td>
            <td class="p-2 sm:p-3">${p.year}</td>
            <td class="p-2 sm:p-3 text-right">
                <button onclick="approveMedia('${p.id}')" class="bg-textBright text-black font-bold px-3 py-1 rounded text-xs">Aprobar</button>
            </td>
        </tr>
    `).join('') : '<tr><td colspan="4" class="p-3 text-center text-gray-500">No hay propuestas pendientes</td></tr>';
}

function approveMedia(id) {
    const item = mediaData.find(m => m.id === id);
    if (item) {
        item.approved = true;
        renderApp();
        showNotification("Obra aprobada con éxito.", "success");
    }
}