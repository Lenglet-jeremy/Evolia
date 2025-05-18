// MainPage.js

export function initializeMainPageEvents() {
    const burger = document.getElementById('MainPageBurgerToggle');
    const close = document.getElementById('MainPageCloseMenu');
    const menu = document.getElementById('MainPageMainMenu');
    const nav = document.getElementById('MainPageNavigationPanel'); // ➕ on récupère le nav
    

    if (burger && close && menu && nav) {

        // Ouvre le menu
        burger.addEventListener('click', () => {
            menu.classList.add('active');
            menu.style.visibility = "visible"
            nav.classList.add('menu-open'); // ➕ pour afficher la croix
        });
        

        // Ferme avec la croix
        close.addEventListener('click', () => {
            menu.classList.remove('active');
            menu.style.visibility = "hidden"
            nav.classList.remove('menu-open'); // ➖ cacher la croix
        });

        // Ferme au clic sur un lien
        const links = menu.querySelectorAll('a[data-link]');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                menu.style.visibility = "hidden"
                nav.classList.remove('menu-open'); // ➖ aussi ici
            });
        });
    }
}
