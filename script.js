let currentUser = null;
let carbonData = {};
let wasteReports = [];
let challenges = [];
let userPoints = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
    setupEventListeners();
    loadDemoData();
});

// Initialize Application
function initializeApp() {
    const savedUser = localStorage.getItem('ecoTraceUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }

    setupSmoothScrolling();
    setupScrollAnimations();
}

// Setup Event Listeners
function setupEventListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Escape key to close modals
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    setupFormHandlers();
}

function showLogin() {
    closeAllModals();
    document.getElementById('loginModal').style.display = 'flex';
}

function showRegister() {
    closeAllModals();
    document.getElementById('registerModal').style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.style.display = 'none');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email && password) {
        currentUser = {
            id: generateId(),
            email,
            name: email.split('@')[0],
            points: Math.floor(Math.random() * 10000) + 1000,
            carbonFootprint: Math.floor(Math.random() * 200) + 100,
            wasteReduced: Math.floor(Math.random() * 50) + 10,
            communityRank: Math.floor(Math.random() * 100) + 1,
            joinDate: new Date().toISOString(),
        };

        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeModal('loginModal');
        showNotification('Welcome back! Login successful.', 'success');
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const community = document.getElementById('community').value;

    if (firstName && lastName && email && password && community) {
        currentUser = {
            id: generateId(),
            email,
            name: `${firstName} ${lastName}`,
            firstName,
            lastName,
            community,
            points: 100,
            carbonFootprint: 0,
            wasteReduced: 0,
            communityRank: 0,
            joinDate: new Date().toISOString(),
            badges: ['Welcome Warrior'],
            challenges: [],
        };

        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        closeModal('registerModal');
        showNotification('Account created successfully! Welcome to EcoTrace.', 'success');
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

function updateUIForLoggedInUser() {
    if (!currentUser) return;
    const navAuth = document.querySelector('.nav-auth');
    navAuth.innerHTML = `
        <span>Welcome, ${currentUser.name}</span>
        <button class="btn-primary" onclick="showDashboard()">Dashboard</button>
        <button class="btn-secondary" onclick="logout()">Logout</button>
    `;
    updateDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ecoTraceUser');

    const navAuth = document.querySelector('.nav-auth');
    navAuth.innerHTML = `
        <button class="btn-secondary" onclick="showLogin()">Login</button>
        <button class="btn-primary" onclick="showRegister()">Sign Up</button>
    `;

    document.getElementById('dashboard')?.classList.add('hidden');
    document.getElementById('carbonResult')?.classList.add('hidden');
    closeAllModals();

    showNotification('Logged out successfully.', 'info');
}

function showDashboard() {
    if (!currentUser) return showLogin();

    const dashboard = document.getElementById('dashboard');
    dashboard.classList.remove('hidden');
    dashboard.scrollIntoView({ behavior: 'smooth' });

    updateDashboard();
}

function updateDashboard() {
    if (!currentUser) return;

    document.getElementById('userName').textContent = currentUser.name;
    updateCarbonDisplay();
    updateWasteStats();
    updateCommunityRank();
    updateActiveChallenges();
}

function updateCarbonDisplay() {
    const carbonValue = document.querySelector('.carbon-value');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    const footprint = currentUser.carbonFootprint || Math.floor(Math.random() * 200) + 100;
    const improvement = Math.max(0, ((200 - footprint) / 200) * 100);

    carbonValue.textContent = footprint.toFixed(1);
    progressFill.style.width = `${improvement}%`;
    progressText.textContent = `${improvement.toFixed(0)}% below average`;
}

function updateWasteStats() {
    const wasteStats = document.querySelector('.waste-stats');
    const recycled = currentUser.wasteReduced || Math.floor(Math.random() * 50) + 10;
    const composted = Math.floor(recycled * 0.3);

    wasteStats.innerHTML = `
        <div class="waste-item">
            <span class="waste-type">Recycled</span>
            <span class="waste-amount">${recycled} kg</span>
        </div>
        <div class="waste-item">
            <span class="waste-type">Composted</span>
            <span class="waste-amount">${composted} kg</span>
        </div>
    `;
}

function updateCommunityRank() {
    document.querySelector('.rank-number').textContent = `#${currentUser.communityRank || 1}`;
    document.querySelector('.rank-total').textContent = 'of 342';
    document.querySelector('.points').textContent = `${currentUser.points} points`;
}

function updateActiveChallenges() {
    const challengeList = document.querySelector('.challenge-list');
    challengeList.innerHTML = challenges.map(c => `
        <div class="challenge-item">
            <span class="challenge-name">${c.name}</span>
            <div class="challenge-progress">
                <div class="challenge-bar" style="width: ${Math.floor(Math.random() * 100)}%"></div>
            </div>
        </div>
    `).join('');
}

function startTracking() {
    if (!currentUser) return showRegister();
    showDashboard();
}

function watchDemo() {
    showNotification('Demo video would play here. Feature coming soon!', 'info');
}

function openCarbonCalculator() {
    const modal = document.getElementById('carbonCalculatorModal');
    if (modal.style.display === 'flex') return;
    modal.style.display = 'flex';
}

function openWasteMap() {
    const modal = document.getElementById('wasteMapModal');
    if (modal.style.display === 'flex') return;
    modal.style.display = 'flex';
    loadWasteMap();
}

function openChallenges() {
    showNotification('Challenge hub opening soon! Join competitions and earn points.', 'info');
}

function openDirectory() {
    showNotification('Eco-business directory coming soon! Discover green businesses near you.', 'info');
}

function openWasteClassifier() {
    showNotification('AI waste classifier coming soon! Upload photos to identify waste types.', 'info');
}

function openCarbonCredits() {
    showNotification('Carbon credit system launching soon! Track and trade your carbon savings.', 'info');
}

function switchTab(tabName, event) {
    event.preventDefault();
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');
}

function calculateCarbon() {
    const transportMode = document.getElementById('transportMode')?.value || 'car';
    const transportDistance = parseFloat(document.getElementById('transportDistance')?.value || 0);
    const electricityUsage = parseFloat(document.getElementById('electricityUsage')?.value || 0);
    const gasUsage = parseFloat(document.getElementById('gasUsage')?.value || 0);
    const meatConsumption = parseFloat(document.getElementById('meatConsumption')?.value || 0);
    const shoppingFreq = parseFloat(document.getElementById('shoppingFreq')?.value || 0);

    if ([transportDistance, electricityUsage, gasUsage, meatConsumption, shoppingFreq].some(val => isNaN(val))) {
        showNotification('Please enter valid numeric values for all input fields.', 'error');
        return;
    }

    const factors = {
        car: 0.21, bus: 0.089, train: 0.041, bike: 0, walk: 0,
        electricity: 0.82, gas: 2.04, meat: 3.3, shopping: 5.2
    };

    const transportCarbon = transportDistance * factors[transportMode] * 4.33;
    const electricityCarbon = electricityUsage * factors.electricity;
    const gasCarbon = gasUsage * factors.gas;
    const meatCarbon = meatConsumption * factors.meat * 4.33;
    const shoppingCarbon = shoppingFreq * factors.shopping;

    const totalCarbon = transportCarbon + electricityCarbon + gasCarbon + meatCarbon + shoppingCarbon;
    const carbonResult = document.getElementById('carbonResult');
    const carbonValue = document.getElementById('carbonValue');
    const comparisonText = document.getElementById('comparisonText');

    carbonResult.classList.remove('hidden');
    carbonValue.textContent = totalCarbon.toFixed(1);

    const avg = 200, diff = ((totalCarbon - avg) / avg) * 100;

    comparisonText.textContent = diff > 0
        ? `${diff.toFixed(1)}% above average. Let's work on reducing it!`
        : `${Math.abs(diff).toFixed(1)}% below average. Great job!`;
    comparisonText.style.color = diff > 0 ? '#f44336' : '#4caf50';

    if (currentUser) {
        currentUser.carbonFootprint = totalCarbon;
        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        updateDashboard();
    }
}

function loadWasteMap() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (!mapPlaceholder) return;

    mapPlaceholder.innerHTML = `
        <div class="map-simulation">
            <h3>Interactive Waste Map</h3>
            <div class="map-controls">
                <button class="btn-primary" onclick="reportWaste()">Report New Hotspot</button>
                <button class="btn-secondary" onclick="filterWaste('all')">All Types</button>
                <button class="btn-secondary" onclick="filterWaste('plastic')">Plastic</button>
                <button class="btn-secondary" onclick="filterWaste('organic')">Organic</button>
            </div>
            <div class="map-markers">
                <div class="marker plastic" style="top: 30%; left: 25%;">📍</div>
                <div class="marker organic" style="top: 60%; left: 70%;">📍</div>
                <div class="marker electronic" style="top: 45%; left: 50%;">📍</div>
            </div>
        </div>
    `;
}

function reportWaste() {
    if (!currentUser) return showLogin();

    const wasteType = prompt('What type of waste did you find?');
    const location = prompt('Where is this waste located? (Landmark or address)');

    if (wasteType && location) {
        wasteReports.push({
            id: generateId(),
            type: wasteType,
            location,
            reporter: currentUser.name,
            timestamp: new Date().toISOString(),
            status: 'reported'
        });

        currentUser.points += 50;
        localStorage.setItem('ecoTraceUser', JSON.stringify(currentUser));
        showNotification(`Waste report submitted! You earned 50 points.`, 'success');

        updateDashboard();
    }
}

function filterWaste(type) {
    showNotification(`Filtering waste map for: ${type}`, 'info');
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white; padding: 15px 20px;
        border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 10000; display: flex; gap: 10px;
        justify-content: space-between; min-width: 300px;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });

            const navMenu = document.querySelector('.nav-menu');
            if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.feature-card, .dashboard-card, .feed-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function setupFormHandlers() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                const original = btn.textContent;
                btn.textContent = 'Processing...';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = original;
                }, 2000);
            }
        });
    });
}

function loadDemoData() {
    challenges = [
        { id: 1, name: 'Plastic-Free Week' },
        { id: 2, name: 'Green Commute' },
        { id: 3, name: 'Zero Waste Day' }
    ];

    wasteReports = [
        { id: 1, type: 'Plastic', location: 'Sector 18, Noida' },
        { id: 2, type: 'Organic', location: 'MG Road, Bangalore' }
    ];
}

function initializeImpactChart() {
    const canvas = document.getElementById('impactChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Impact Chart', canvas.width / 2, canvas.height / 2);
    }
}

setTimeout(initializeImpactChart, 1000);
