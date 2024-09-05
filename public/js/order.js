//
//au click sur l'un des boutons on genere un nouveau numero de commande en incrementant de 1 en 1
const newOrder = document.querySelectorAll('.order')
// Initialiser le compteur à partir du localStorage ou commencer à 1 si c'est la première commande
newOrder.forEach((item) => {
    item.addEventListener('click', () => {
        console.log('click');
        // Générer un numéro de commande aléatoire unique
        const randomPart = Math.floor(Math.random() * 900) + 100;
        const newOrderNumber = 'Od'+ randomPart;
        // Sauvegarder ce numéro de commande dans le localStorage
        localStorage.setItem('order', newOrderNumber);
    });
});