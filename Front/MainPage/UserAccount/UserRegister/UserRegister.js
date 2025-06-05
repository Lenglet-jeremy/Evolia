// UserRegister.js

function isPasswordStrong(password) {
    // Exige au moins : 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
}

function checkPasswordStrength(password) {
    const requirementsDiv = document.getElementById("password-requirements");

    // Affiche ou cache le bloc selon si le champ est vide
    if (password === "") {
        requirementsDiv.style.display = "none";
        requirementsDiv.style.opacity = "0";
        return;
    } else {
        requirementsDiv.style.display = "flex";
        requirementsDiv.style.opacity = "1";
    }

    const rules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[\W_]/.test(password),
    };

    // Afficher uniquement les règles non respectées
    document.getElementById("req-length").style.display = rules.length ? "none" : "block";
    document.getElementById("req-uppercase").style.display = rules.uppercase ? "none" : "block";
    document.getElementById("req-lowercase").style.display = rules.lowercase ? "none" : "block";
    document.getElementById("req-number").style.display = rules.number ? "none" : "block";
    document.getElementById("req-special").style.display = rules.special ? "none" : "block";
}



function onSubmit() {
    const registerForm = document.getElementById("RegisterForm");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const inputs = registerForm.querySelectorAll("input");
        const [fullName, email, password, confirmPassword] = [...inputs].map(i => i.value.trim());

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!isPasswordStrong(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
            return;
        }

        try {
            const res = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur à l'inscription");

            alert("Inscription réussie !");
            window.location.href = "/";
        } catch (err) {
            alert(err.message);
        }
    });
}


export function SetRegisterBehavior() {
    onSubmit();

    const passwordInput = document.getElementById("password");
    passwordInput.addEventListener("input", (e) => {
        checkPasswordStrength(e.target.value);
    });
}
