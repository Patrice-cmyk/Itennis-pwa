// app.js
// Logique JavaScript pour le prototype PWA ITennis

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app-container");
    const mainContent = document.getElementById("main-content");
    const themeSwitcherBtn = document.getElementById("theme-switcher");

    // Écrans
    const authScreen = document.getElementById("auth-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");
    const profileScreen = document.getElementById("profile-screen");
    const createPartyScreen = document.getElementById("create-party-screen");
    const partyListScreen = document.getElementById("party-list-screen");

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

    // Éléments de l'écran de profil
    const profileForm = document.getElementById("profile-form");
    const profilePseudoInput = document.getElementById("profile-pseudo");
    const profileEmailInput = document.getElementById("profile-email");
    const profileLevelSelect = document.getElementById("profile-level");
    const profileMessage = document.getElementById("profile-message");
    const backToDashboardProfileBtn = document.getElementById("back-to-dashboard-profile");

    // --- Gestion du thème (Mode Sombre) ---
    function applyTheme(theme) {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
            if(themeSwitcherBtn) themeSwitcherBtn.textContent = "Mode Clair";
        } else {
            document.body.classList.remove("dark-mode");
            if(themeSwitcherBtn) themeSwitcherBtn.textContent = "Mode Sombre";
        }
    }

    function toggleTheme() {
        const currentTheme = localStorage.getItem("iTennisTheme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("iTennisTheme", newTheme);
        applyTheme(newTheme);
    }

    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener("click", toggleTheme);
    }
    
    // Appliquer le thème sauvegardé au chargement
    const savedTheme = localStorage.getItem("iTennisTheme");
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    // --- Gestion de l'état de l'application (navigation simple) ---
    function navigateTo(screenId) {
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add("active");
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

    if (showSignupBtn) {
        showSignupBtn.addEventListener("click", () => {
            signupFormContainer.classList.add("active");
            loginFormContainer.classList.remove("active");
            showSignupBtn.classList.add("active");
            showLoginBtn.classList.remove("active");
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener("click", () => {
            loginFormContainer.classList.add("active");
            signupFormContainer.classList.remove("active");
            showLoginBtn.classList.add("active");
            showSignupBtn.classList.remove("active");
        });
    }

    if (signupForm) {
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

            let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
            if (users.find(user => user.email === email)) {
                displayAuthMessage("Cet email est déjà utilisé.", "error");
                return;
            }

            const newUser = { pseudo, email, password, level: "Débutant" };
            users.push(newUser);
            localStorage.setItem("usersITennis", JSON.stringify(users));
            setCurrentUser(newUser);
            displayAuthMessage("Inscription réussie ! Vous êtes connecté.", "success");
            updateUIForLoggedInUser(newUser);
            navigateTo("dashboard-screen");
            signupForm.reset();
        });
    }

    if (loginForm) {
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
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            setCurrentUser(null);
            updateUIForLoggedOutUser();
            navigateTo("auth-screen");
        });
    }

    // --- Logique de l'écran de Profil ---
    function loadProfileData() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            profilePseudoInput.value = currentUser.pseudo;
            profileEmailInput.value = currentUser.email;
            profileLevelSelect.value = currentUser.level || "Débutant";
        } else {
            navigateTo("auth-screen");
        }
    }

    if (profileForm) {
        profileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentUser = getCurrentUser();
            if (!currentUser) return;

            const updatedPseudo = profilePseudoInput.value;
            const updatedLevel = profileLevelSelect.value;

            currentUser.pseudo = updatedPseudo;
            currentUser.level = updatedLevel;
            setCurrentUser(currentUser);

            let users = JSON.parse(localStorage.getItem("usersITennis")) || [];
            const userIndex = users.findIndex(user => user.email === currentUser.email);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                localStorage.setItem("usersITennis", JSON.stringify(users));
            }
            
            updateUIForLoggedInUser(currentUser);
            displayProfileMessage("Profil mis à jour avec succès !", "success");
        });
    }

    if(backToDashboardProfileBtn) {
        backToDashboardProfileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            navigateTo("dashboard-screen");
        });
    }

    // --- Mise à jour de l'UI en fonction de l'état de connexion ---
    function updateUIForLoggedInUser(user) {
        if (userPseudoDisplay) userPseudoDisplay.textContent = user.pseudo;
    }

    function updateUIForLoggedOutUser() {
        if (userPseudoDisplay) userPseudoDisplay.textContent = "";
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
        if(showSignupBtn) showSignupBtn.click(); 
    }

    // Liens de navigation
    document.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetScreenId = e.target.dataset.target;
            if (targetScreenId) {
                navigateTo(targetScreenId);
            }
        });
    });
    
    // Boutons de retour génériques
    document.querySelectorAll(".back-btn").forEach(button => {
        if (button.id !== "back-to-dashboard-profile") { 
            button.addEventListener("click", (e) => {
                e.preventDefault();
                navigateTo("dashboard-screen"); 
            });
        }
    });

    initApp();
});

