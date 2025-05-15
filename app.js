// app.js
// Logique JavaScript pour le prototype PWA ITennis

document.addEventListener("DOMContentLoaded", () => {
    const appContainer = document.getElementById("app-container");
    const mainContent = document.getElementById("main-content");

    // Écrans
    const authScreen = document.getElementById("auth-screen");
    const dashboardScreen = document.getElementById("dashboard-screen");
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

    // --- Gestion de l'état de l'application (navigation simple) ---
    function navigateTo(screenId) {
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add("active");
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


    initApp();
});

