const btnCart = document.querySelector('.cart-device')
const cart = document.querySelector('.cart-container')
console.log(cart);

btnCart.addEventListener('click', () => {
    cart.classList.toggle('reveal')
})
console.log(localStorage);
// compte le nombre d'article dans le panier
/**
 * Compte le d'article stocker dans le localStorage
 * @returns {integer} (Le nombre d'article du panier)
 */
export function countItem(data) {
    if (!data || typeof data !== 'object') {
        return 0;
    }
    return (Object.keys(data).length);
}

export function hydratebubble(data) {
    const bubble = document.querySelector('.bubble')
    bubble.innerHTML = ''
    const content = document.createElement('span')
    content.innerHTML = `<span>${countItem(data)}</span>`
    bubble.appendChild(content)
}
