/**
 * Ajoute un article au panier
 * @param {string||int} key ('cle a donner')
 * @param {string||int} newItem (valeur a donner)
 */
export default function addCart(key, newItem) {
    // Récupère les articles existants dans le panier ou crée un tableau vide
    let cart = JSON.parse(localStorage.getItem(key));
    key==='chevalet' && newItem
    // Trouve l'article existant dans le panier
    let existingItemIndex = cart.findIndex(item => item.id === newItem.id);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantite += newItem.quantite;
    } else {
        cart.push(newItem);
    }
    localStorage.setItem(key, JSON.stringify(item));
}
