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
export function countItem() {
    let countMenu = 0
    let countOther = 0
    let nbItemOther = 0
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('menu')) {
            const dataItem = JSON.parse(localStorage.getItem(key))
            countMenu += i
            console.log(dataItem);
        } else if (!key.startsWith('menu') && !key.startsWith('restauration') && !key.startsWith('chevalet')) {
            console.log(key);
            const dataItem = JSON.parse(localStorage.getItem(key))
            dataItem.forEach(elt => {
                countOther += elt.quantite;
            });
        }
    }
    console.log((countMenu + countOther));
    return ((countMenu + countOther));
}

export default function hydratebubble() {
    const bubble = document.querySelector('.bubble')
    bubble.innerHTML = ''
    const content = document.createElement('span')
    content.innerHTML = `<span>${countItem()}</span>`
    bubble.appendChild(content)
}
