import { setExercicesContentTabSelection } from "../../Modules/Exercices/Exercices.js";

const routes = {
    '/': './MainPage/Home/Home.html',
    '/exercices': './Modules/Exercices/Exercices.html',
    '/journal': './Modules/Journal/Journal.html',
    '/planning': './Modules/Planning/Planning.html',
    '/login': './MainPage/UserAccount/UserLogin/UserLogin.html',
    '/register': './MainPage/UserAccount/UserRegister/UserRegister.html',
};

export async function loadPageContent(path) {
    const pageUrl = routes[path] ?? null;

    if (!pageUrl && path === "/") {
        const res = await fetch(routes["/"]);
        const homeHtml = await res.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = homeHtml;

        const homeContent = tempDiv.querySelector("#HomeContentArea") || homeHtml;
        document.querySelector("#MainPageSelectedMenu").innerHTML = typeof homeContent === "string"
            ? homeContent
            : homeContent.outerHTML;
        return;
    }

    if (pageUrl) {
        const res = await fetch(pageUrl);
        if (!res.ok) throw new Error("Fichier de contenu non trouvé");
        const html = await res.text();
        document.querySelector("#MainPageSelectedMenu").innerHTML = html;

        if (path === "/exercices") {
            setExercicesContentTabSelection();
        }

        const registerLink = document.getElementById("UserRegisterLink");
        if (registerLink) {
            registerLink.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/register";
            });
        }

        const loginLink = document.getElementById("UserLoginLink");
        if (loginLink) {
            loginLink.addEventListener("click", (e) => {
                e.preventDefault();
                window.location.href = "/login";
            });
        }
    } else {
        document.querySelector("#MainPageSelectedMenu").innerHTML = `<p>📛 Page introuvable</p>`;
    }
}
