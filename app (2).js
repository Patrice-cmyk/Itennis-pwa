// app.js
// Logique JavaScript pour le prototype PWA ITennis

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app-container");
    const mainContent = document.getElementById("main-content");

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
    const profileNameDisplay = document.getElementById("profile-name-display");
    const profileLevelDisplay = document.getElementById("profile-level-display");

    // --- Gestion de l'état de l'application (navigation simple) ---
    function navigateTo(screenId) {
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add("active");
            
            // Actions spécifiques lors de la navigation vers certains écrans
            if (screenId === "profile-screen") {
                loadProfileData();
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

        const newUser = { pseudo, email, password, level: "Débutant" }; // Niveau par défaut
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

    logoutBtn.addEventListener("click", () => {
        setCurrentUser(null);
        updateUIForLoggedOutUser();
        navigateTo("auth-screen");
    });

    // --- Gestion du profil utilisateur ---
    function loadProfileData() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            profilePseudo.value = currentUser.pseudo;
            profileEmail.value = currentUser.email;
            profileLevel.value = currentUser.level || "Débutant";
            
            // Mise à jour des affichages en haut du profil
            profileNameDisplay.textContent = currentUser.pseudo;
            profileLevelDisplay.textContent = `Niveau: ${currentUser.level || "Débutant"}`;
        }
    }

    profileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigateTo("auth-screen");
            return;
        }

        const updatedPseudo = profilePseudo.value;
        const updatedLevel = profileLevel.value;

        // Mise à jour de l'utilisateur actuel
        currentUser.pseudo = updatedPseudo;
        currentUser.level = updatedLevel;
        setCurrentUser(currentUser);

        // Mise à jour dans la liste des utilisateurs
        let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            localStorage.setItem("usersITennis", JSON.stringify(users));
        }

        // Mise à jour des affichages
        profileNameDisplay.textContent = updatedPseudo;
        profileLevelDisplay.textContent = `Niveau: ${updatedLevel}`;
        
        displayProfileMessage("Profil mis à jour avec succès !", "success");
        updateUIForLoggedInUser(currentUser);
    });

    backToDashboardProfile.addEventListener("click", () => {
        navigateTo("dashboard-screen");
    });

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
        const currentUser = getCurrentUser();
        if (currentUser) {
            updateUIForLoggedInUser(currentUser);
            navigateTo("dashboard-screen");
        } else {
            navigateTo("auth-screen");
        }
        // Activer le premier onglet par défaut sur l'écran d'auth
        showSignupBtn.click(); 
    }

    // Liens de navigation (exemples pour le dashboard)
    const createPartyLink = document.getElementById("create-party-link");
    const viewPartiesLink = document.getElementById("view-parties-link");
    const profileLink = document.getElementById("profile-link");

    if(createPartyLink) createPartyLink.addEventListener("click", (e) => { e.preventDefault(); navigateTo("create-party-screen"); });
    if(viewPartiesLink) viewPartiesLink.addEventListener("click", (e) => { e.preventDefault(); navigateTo("party-list-screen"); });
    if(profileLink) profileLink.addEventListener("click", (e) => { e.preventDefault(); navigateTo("profile-screen"); });

    // Boutons de retour
    const backToDashboardCreate = document.getElementById("back-to-dashboard-create");
    const backToDashboardList = document.getElementById("back-to-dashboard-list");

    if(backToDashboardCreate) backToDashboardCreate.addEventListener("click", () => { navigateTo("dashboard-screen"); });
    if(backToDashboardList) backToDashboardList.addEventListener("click", () => { navigateTo("dashboard-screen"); });

    // Détection du mode sombre du système
    function detectColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // Écouter les changements de préférence de thème
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);
    }

    // Initialiser le mode de couleur
    detectColorScheme();

    initApp();
});
