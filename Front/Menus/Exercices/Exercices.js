// Exercices.js
export function setExercicesContentTabSelection(){
    console.log("Initialisation des écouteurs d'onglets Exercices");
    const btns = document.querySelectorAll('.ExercicesContentTabsBar .TabBtn');
    console.log(`Boutons trouvés : ${btns.length}`);

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log("CLICK inside event listener");

            // Mise à jour des classes Selected
            btns.forEach(b => b.classList.remove('Selected'));
            btn.classList.add('Selected');

            // Chargement du contenu selon onglet
            const tabName = btn.dataset.tab;
            const contentArea = document.getElementById('ExercicesContentData');

            fetch(`/pages/exercices/${tabName}.html`)
                .then(res => {
                    if(!res.ok) throw new Error("Erreur réseau");
                    return res.text();
                })
                .then(html => {
                    contentArea.innerHTML = html;
                    // Si le contenu injecté a aussi des onglets, il faudra peut-être ré-appeler cette fonction ici
                })
                .catch(err => {
                    console.error(err);
                    contentArea.innerHTML = "<p>Erreur lors du chargement de l'onglet.</p>";
                });
        });
    });
}
