/**
 * Ajoute un article au panier
 * @param {string||int} key ('clé à donner')
 * @param {Object} newItem (valeur à ajouter avec id et quantité)
 */
export default function addCart(key, newItem) {
    // Récupère les articles existants dans le panier ou initialise un tableau vide
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    // Trouve l'article existant dans le panier
    let existingItemIndex = cart.findIndex(item => item.id === newItem.id);
    if (existingItemIndex >= 0) {
        // Si l'article existe déjà, augmenter la quantité
        cart[existingItemIndex].quantite += newItem.quantite;
    } else {
        // Sinon, ajouter l'article au panier
        cart.push(newItem);
    }
    // Mettre à jour le localStorage avec les nouvelles valeurs
    localStorage.setItem(key, JSON.stringify(cart));
}
