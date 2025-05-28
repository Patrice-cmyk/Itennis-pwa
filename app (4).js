// app.js
// Logique JavaScript pour le prototype PWA ITennis

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app-container");
    const mainContent = document.getElementById("main-content");
    const themeToggle = document.getElementById("theme-toggle");
    const html = document.documentElement;

    // Écrans
    const authScreen = document.getElementById("auth-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");
    const profileScreen = document.getElementById("profile-screen");
    // ... (autres écrans à définir plus tard)

    // Éléments d'authentification
    const showSignupBtn = document.getElementById("show-signup-btn");
    const showLoginBtn = document.getElementById("show-login-btn");
    const signupFormContainer = document.getElementById("signup-form-container");
    const loginFormContainer = document.getElementById("login-form-container");
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const authMessage = document.getElementById("auth-message");

    // Éléments du tableau de bord
    const userPseudoDisplay = document.getElementById("user-pseudo-display");
    const logoutBtn = document.getElementById("logout-btn");

    // Éléments du profil
    const profileForm = document.getElementById("profile-form");
    const profilePseudo = document.getElementById("profile-pseudo");
    const profileEmail = document.getElementById("profile-email");
    const profileLevel = document.getElementById("profile-level");
    const profileMessage = document.getElementById("profile-message");
    const backToDashboardProfile = document.getElementById("back-to-dashboard-profile");
    const logoutProfileBtn = document.getElementById("logout-profile-btn");
    const changePhotoBtn = document.getElementById("change-photo-btn");
    const photoUpload = document.getElementById("photo-upload");
    const profilePhotoImg = document.getElementById("profile-photo-img");
    const profileNameDisplay = document.getElementById("profile-name-display");
    const profileLevelBadge = document.getElementById("profile-level-badge");
    const statParties = document.getElementById("stat-parties");
    const statWins = document.getElementById("stat-wins");
    const statClubs = document.getElementById("stat-clubs");

    // --- Gestion du thème (clair/sombre) ---
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.checked = (theme === 'dark');
    }

    // Vérifier les préférences système pour le mode sombre
    function checkSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Initialiser le thème
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(checkSystemPreference());
        }
    }

    // Écouter les changements de préférence système
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) { // Seulement si l'utilisateur n'a pas explicitement choisi
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Toggle manuel du thème
    themeToggle.addEventListener('change', () => {
        setTheme(themeToggle.checked ? 'dark' : 'light');
    });

    // --- Gestion de l'état de l'application (navigation simple) ---
    function navigateTo(screenId) {
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add("active");
            
            // Si on navigue vers le profil, mettre à jour les informations
            if (screenId === "profile-screen") {
                updateProfileUI();
            }
        } else {
            console.error(`Screen with id ${screenId} not found.`);
        }
    }

    // --- Logique d'Authentification (avec LocalStorage pour le prototype) ---
    function getCurrentUser() {
        const userJson = localStorage.getItem("currentUserITennis");
        return userJson ? JSON.parse(userJson) : null;
    }

    function setCurrentUser(user) {
        if (user) {
            localStorage.setItem("currentUserITennis", JSON.stringify(user));
        } else {
            localStorage.removeItem("currentUserITennis");
        }
    }

    function displayAuthMessage(message, type) {
        authMessage.textContent = message;
        authMessage.className = `message ${type}`;
        setTimeout(() => {
            authMessage.textContent = "";
            authMessage.className = "message";
        }, 3000);
    }

    function displayProfileMessage(message, type) {
        profileMessage.textContent = message;
        profileMessage.className = `message ${type}`;
        setTimeout(() => {
            profileMessage.textContent = "";
            profileMessage.className = "message";
        }, 3000);
    }

    showSignupBtn.addEventListener("click", () => {
        signupFormContainer.classList.add("active");
        loginFormContainer.classList.remove("active");
        showSignupBtn.classList.add("active");
        showLoginBtn.classList.remove("active");
    });

    showLoginBtn.addEventListener("click", () => {
        loginFormContainer.classList.add("active");
        signupFormContainer.classList.remove("active");
        showLoginBtn.classList.add("active");
        showSignupBtn.classList.remove("active");
    });

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const pseudo = document.getElementById("signup-pseudo").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        if (password !== confirmPassword) {
            displayAuthMessage("Les mots de passe ne correspondent pas.", "error");
            return;
        }

        // Simuler la vérification d'email unique
        let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
        if (users.find(user => user.email === email)) {
            displayAuthMessage("Cet email est déjà utilisé.", "error");
            return;
        }

        // Créer un nouvel utilisateur avec des statistiques par défaut
        const newUser = { 
            pseudo, 
            email, 
            password, 
            level: "Débutant",
            photo: null, // Photo de profil (sera stockée en base64)
            stats: {
                parties: 0,
                wins: 0,
                clubs: 0
            }
        };
        
        users.push(newUser);
        localStorage.setItem("usersITennis", JSON.stringify(users));
        setCurrentUser(newUser);
        displayAuthMessage("Inscription réussie ! Vous êtes connecté.", "success");
        updateUIForLoggedInUser(newUser);
        navigateTo("dashboard-screen");
        signupForm.reset();
    });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            setCurrentUser(foundUser);
            displayAuthMessage("Connexion réussie !", "success");
            updateUIForLoggedInUser(foundUser);
            navigateTo("dashboard-screen");
            loginForm.reset();
        } else {
            displayAuthMessage("Email ou mot de passe incorrect.", "error");
        }
    });

    function logout() {
        setCurrentUser(null);
        updateUIForLoggedOutUser();
        navigateTo("auth-screen");
    }

    if (logoutBtn) logoutBtn.addEventListener("click", logout);
    if (logoutProfileBtn) logoutProfileBtn.addEventListener("click", logout);

    // --- Gestion du profil utilisateur ---
    function updateProfileUI() {
        const currentUser = getCurrentUser();
        if (!currentUser) return;

        // Mettre à jour les champs du formulaire
        if (profilePseudo) profilePseudo.value = currentUser.pseudo;
        if (profileEmail) profileEmail.value = currentUser.email;
        if (profileLevel) profileLevel.value = currentUser.level || "Débutant";
        
        // Mettre à jour l'affichage du nom et du niveau
        if (profileNameDisplay) profileNameDisplay.textContent = currentUser.pseudo;
        if (profileLevelBadge) profileLevelBadge.textContent = currentUser.level || "Débutant";
        
        // Mettre à jour les statistiques
        if (statParties) statParties.textContent = currentUser.stats?.parties || 0;
        if (statWins) statWins.textContent = currentUser.stats?.wins || 0;
        if (statClubs) statClubs.textContent = currentUser.stats?.clubs || 0;
        
        // Mettre à jour la photo de profil si elle existe
        if (profilePhotoImg && currentUser.photo) {
            profilePhotoImg.src = currentUser.photo;
        }
    }

    // Gestion du formulaire de profil
    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const currentUser = getCurrentUser();
            if (!currentUser) return;
            
            // Mettre à jour les informations de l'utilisateur
            currentUser.pseudo = profilePseudo.value;
            currentUser.level = profileLevel.value;
            
            // Mettre à jour l'utilisateur dans le localStorage
            setCurrentUser(currentUser);
            
            // Mettre à jour la liste des utilisateurs
            let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem("usersITennis", JSON.stringify(users));
            }
            
            // Mettre à jour l'UI
            updateProfileUI();
            displayProfileMessage("Profil mis à jour avec succès !", "success");
        });
    }

    // Gestion du changement de photo
    if (changePhotoBtn && photoUpload) {
        changePhotoBtn.addEventListener("click", () => {
            photoUpload.click();
        });
        
        photoUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const photoData = event.target.result;
                
                // Mettre à jour la photo dans l'UI
                if (profilePhotoImg) profilePhotoImg.src = photoData;
                
                // Mettre à jour la photo dans les données utilisateur
                const currentUser = getCurrentUser();
                if (currentUser) {
                    currentUser.photo = photoData;
                    setCurrentUser(currentUser);
                    
                    // Mettre à jour la liste des utilisateurs
                    let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
                    const userIndex = users.findIndex(user => user.email === currentUser.email);
                    if (userIndex !== -1) {
                        users[userIndex] = currentUser;
                        localStorage.setItem("usersITennis", JSON.stringify(users));
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Retour au tableau de bord depuis le profil
    if (backToDashboardProfile) {
        backToDashboardProfile.addEventListener("click", () => {
            navigateTo("dashboard-screen");
        });
    }

    // --- Mise à jour de l'UI en fonction de l'état de connexion ---
    function updateUIForLoggedInUser(user) {
        if (userPseudoDisplay) userPseudoDisplay.textContent = user.pseudo;
        // Cacher/afficher les éléments de menu appropriés, etc.
    }

    function updateUIForLoggedOutUser() {
        if (userPseudoDisplay) userPseudoDisplay.textContent = "";
        // Réinitialiser l'état de l'UI pour un utilisateur déconnecté
    }

    // --- Initialisation de l'application ---
    function initApp() {
        // Initialiser le thème
        initTheme();
        
        // Vérifier si un utilisateur est connecté
        const currentUser = getCurrentUser();
        if (currentUser) {
            updateUIForLoggedInUser(currentUser);
            navigateTo("dashboard-screen");
        } else {
            navigateTo("auth-screen");
        }
        // Activer le premier onglet par défaut sur l'écran d'auth
        if (showSignupBtn) showSignupBtn.click(); 
    }

    // Liens de navigation (exemples pour le dashboard)
    const createPartyLink = document.getElementById("create-party-link");
    const viewPartiesLink = document.getElementById("view-parties-link");
    const profileLink = document.getElementById("profile-link");

    if(createPartyLink) createPartyLink.addEventListener("click", (e) => { e.preventDefault(); navigateTo("create-party-screen"); });
    if(viewPartiesLink) viewPartiesLink.addEventListener("click", (e) => { e.preventDefault(); navigateTo("party-list-screen"); });
    if(profileLink) profileLink.addEventListener("click", (e) => { e.preventDefault(); navigateTo("profile-screen"); });

    // Initialiser l'application
    initApp();
});

