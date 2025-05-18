// Script.js

import { initializeMainPageEvents } from "./MainPage/MainPage.js";
import { setExercicesContentTabSelection } from "./Menus/Exercices/Exercices.js";

const routes = {
    '/': null,
    '/exercices': './Menus/Exercices/Exercices.html',
    '/journal': './Menus/Journal/Journal.html',
    '/planning': './Menus/Planning/Planning.html',
};

function navigateTo(url) {
    history.pushState(null, null, url);
    loadContent(url);
}

async function loadContent(route) {
    const container = document.getElementById("BodyContent");

    try {
        // Toujours charger le squelette principal de la page
        const mainRes = await fetch('./MainPage/MainPage.html');
        if (!mainRes.ok) throw new Error("Fichier MainPage.html non trouvé");

        const mainHtml = await mainRes.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = mainHtml;

        // Transforme la chaine de caractere qu'est mainHTML
        // En un element DOM
        const mainPageContent = tempDiv.querySelector("#MainPageContentArea");
        const selectedMenuContainer = tempDiv.querySelector("#MainPageSelectedMenu");

        if (!mainPageContent || !selectedMenuContainer) {
            throw new Error("Structure invalide dans MainPage.html");
        }

        // Injecter MainPageContentArea dans BodyContent
        container.innerHTML = mainPageContent.outerHTML;
        initializeMainPageEvents();

        const targetMenu = routes[route] || null;

        // Si aucune page spécifique n’est définie, injecter le contenu de Home.html
        if (!targetMenu && route === '/') {
            const homeRes = await fetch('./MainPage/Home/Home.html');
            if (!homeRes.ok) throw new Error("Fichier Home.html non trouvé");

            const homeHtml = await homeRes.text();
            const homeDiv = document.createElement("div");
            homeDiv.innerHTML = homeHtml;

            const homeContent = homeDiv.querySelector("#HomeContentArea") || homeHtml;
            document.querySelector("#MainPageSelectedMenu").innerHTML = 
                typeof homeContent === 'string' ? homeContent : homeContent.outerHTML;

            return;
        }

        // Si une page spécifique est définie
        if (targetMenu) {
            const pageRes = await fetch(targetMenu);
            if (!pageRes.ok) throw new Error("Fichier de menu non trouvé");

            const pageHtml = await pageRes.text();
            document.querySelector("#MainPageSelectedMenu").innerHTML = pageHtml;
            // ✅ Ajouter ceci : si on est sur la page Exercices
            if (route === "/exercices") {
                setExercicesContentTabSelection(); // maintenant les boutons sont dans le DOM
            }
        } else {
            document.querySelector("#MainPageSelectedMenu").innerHTML = `<p>📛 Page introuvable</p>`;
        }
        

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p>📛 Une erreur est survenue lors du chargement</p>`;
    }
}

function setURLNavigation(){
    // Charge les EndPoints selectionnés
    document.addEventListener("click", e => {
        const link = e.target.closest("a[data-link]");
        if (link) {
            e.preventDefault();
            navigateTo(link.pathname);
        }
    });

    // Gestion Bouton Precedent / Suivant
    window.addEventListener("popstate", () => {
        loadContent(location.pathname);
    });
}

setURLNavigation()
loadContent(location.pathname);
setExercicesContentTabSelection()