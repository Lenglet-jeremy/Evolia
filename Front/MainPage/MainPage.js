// MainPage.js

import { loadPageContent } from "./Router/Router.js";


export async function handleMainPageRoutes(path) {
    const bodyDiv = document.getElementById("BodyContent");

    try {
        const mainRes = await fetch('./MainPage/MainPage.html');
        if (!mainRes.ok) throw new Error("MainPage.html non trouvé");

        // Convertir la reponse depuis le string vers le DOM
        const mainHtml = await mainRes.text();
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = mainHtml;

        // Exploite la reponse
        const mainPageContent = tempDiv.querySelector("#MainPageContentArea");
        const selectedMenuContainer = tempDiv.querySelector("#MainPageSelectedMenu");

        if (!mainPageContent || !selectedMenuContainer) {
            throw new Error("Structure invalide dans MainPage.html");
        }

        // Injecte la reponse dans le DOM
        bodyDiv.innerHTML = mainPageContent.outerHTML;
        handleBurgerMenu();

        // Appel de la fonction dédiée à la gestion des routes
        await loadPageContent(path);
        
    } catch (err) {
        console.error(err);
        bodyDiv.innerHTML = `<p>📛 Une erreur est survenue</p>`;
    }
}

export function handleBurgerMenu() {
    const burger = document.getElementById('MainPageBurgerToggle');
    const close = document.getElementById('MainPageCloseMenu');
    const menu = document.getElementById('MainPageMainMenu');
    const nav = document.getElementById('MainPageNavigationPanel');
    const accountButton = document.getElementById('MainPageUserAccountArea');

    if (burger && close && menu && nav) {
        burger.addEventListener('click', () => {
            menu.classList.add('active');
            menu.style.visibility = "visible";
            nav.classList.add('menuOpen');
        });

        const closeMenu = () => {
            menu.classList.remove('active');
            nav.classList.remove('menuOpen');
            setTimeout(() => {
                menu.style.visibility = "hidden";
            }, 500);
        };

        close.addEventListener('click', closeMenu);
        const links = menu.querySelectorAll('a[data-link]');
        links.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    if (accountButton) {
        accountButton.addEventListener('click', () => {
            history.pushState(null, null, "/login");
            window.dispatchEvent(new PopStateEvent('popstate'));
        });
    }
}
