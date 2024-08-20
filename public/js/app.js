import addCart from "./addCart.js";
/***********  RECCUPERATION ET TRAITEMENT DE L'URL ***********/
// Récupère l'URL actuelle
const url = document.location.href;
// Crée une instance de URLSearchParams avec les paramètres de l'URL actuelle
let params = new URLSearchParams(window.location.search);
// Récupère la valeur du paramètre 'choix'
let choixRestauration = params.get('choix');
const storage = localStorage

let restauration = {
    "restauration": choixRestauration
}
addCart("restauration", restauration)
/************ Declaration de la variable localstorage qui va contenir le panier  *************/
//Creation de la variable currentMenu
let currentMenu = {}
console.log(JSON.parse(localStorage.getItem('restauration')));
/************ Gestion du bouton abandon **************/
/**
 * supprime le local storage
 */
function clear() {
    storage.clear()
    window.location.href = ('index.html')
    console.log(storage);
}
const btnClear = document.querySelector(".clear").addEventListener('click', clear)
// au chargement de la page on affiche le tye de restauration sur place ouy a emporter 
window.addEventListener('load', () => {
    extractDatasProduits('menus')
    nameCategory('menus')
    refreshOrderInfo()
    createTempalteCart()
})
/********** AJAX ***********/
/********** gerer l'etat selectionner ou non des cartes **********/
/**
 * Ajoute l'etat active a une carte
 * @param {string} selectorClass (selectaur de class au format ('.selectorClass'))
 */
function cardSelected(selectorClass) {
    let cards = document.querySelectorAll(selectorClass);
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(otherCard => otherCard.classList.remove('active'));
            card.classList.add('active');
        });
    });
}
// traitement du menu sliders avec les categories
//Appel de la methode fetch pour traiter les données
fetch('./public/categories.json')
    .then(rep => { return rep.json() })
    .then(datas => {
        console.log(datas);
        construcTemplateCategory(datas)
    })
    .catch((error) => {
        console.error('Erreur lors de la récupération des données des produits :', error);
    })
/**
 * Construire le template des catégories
 * @param {Array} datas - Tableau de données
 */
function construcTemplateCategory(datas) {
    const container = document.querySelector('.slider-menu-content');
    // Réinitialise le conteneur
    container.innerHTML = '';
    datas.forEach(data => {
        const cardMenu = document.createElement('div')
        cardMenu.className = 'card-menu flex item-center justify-center'
        cardMenu.setAttribute('data-category', data.title)
        cardMenu.setAttribute('data-id', data.id)
        cardMenu.innerHTML =
            `
                <img src="./public/wacdo${data.image}" alt="image du menu best-of">
                <p>${data.title}</p>
        `;
        //gere l'etat selected
        cardSelected(".card-menu")
        // On ecoute l'evenement sur la carte
        cardMenu.addEventListener('click', () => {
            handleClickCategory(data.title)

        })
        container.appendChild(cardMenu);
    })
}
/**
 * Recharge les donnée et passe a l'etat actif ou non
 * @param {string} category (categorie active du click)
 */
function handleClickCategory(category) {
    // au click sur chaque categorie on rappelle le fetch
    extractDatasProduits(category)
    nameCategory(category)
}
/**
 * affiche le nom de la categorie séléctionner
 * @param {*} category 
 */
function nameCategory(category) {

    const name = document.querySelector('.name-category')
    name.innerHTML = ''
    name.innerHTML =
        `
    <h3>Nos ${category}</h3>
    <h4>Une petite soif, sucrée, légère, rafraîchissante </h4>

    `
}
/**
 * extraire la donnée, appel constructTamplateItem()
 * @param {string} category 
 */
function extractDatasProduits(category) {
    fetch('./public/produits.json')
        .then(rep => rep.json())
        .then(datas => {
            // Filtrer les articles par catégorie avant de construire le template
            construcTemplateItem(datas[category], category)
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données des produits :', error);
        });
}
/**
 * Construire le template des articles
 * @param {Array} datas  Tableau de données filtrées par catégorie
 * @param {string} category Chaine de caractere desigant la categorie
 */
function construcTemplateItem(datas, category) {
    const container = document.querySelector('.container-item-selection');
    // Réinitialise le container pour éviter les doublons
    container.innerHTML = '';
    datas.forEach(data => {
        const cardItem = document.createElement('div')
        cardItem.className = 'card-item flex space-between item-center'
        cardItem.setAttribute('data-category', category)
        cardItem.setAttribute('data-id', data.id)
        cardItem.setAttribute('data-nomMenu', data.nom)
        cardItem.innerHTML =
            `
            <img src="./public/wacdo/${data.image}" alt="image d'un ${data.nom}">
            <p>${data.nom}</p>
            <p>${data.prix.toFixed(2)}€</p>
        `;
        cardItem.addEventListener('click', (e) => {
            let nomProduit = data.nom
            let idProduit = data.id
            handleClickProduit(category, nomProduit, idProduit)

        })
        container.appendChild(cardItem)
        //gere l'etat selected
        cardSelected('.card-item')
    });
}
/********** MODAL **********/
// État pour suivre la catégorie actuelle
let currentCategory = 'menus';
/**
 * gere le click sur la carte produit
 * @param {string} category 
 * @param {string} nomProduit 
 * @param {string} idProduit 
 */
function handleClickProduit(category, nomProduit, idProduit) {
    currentCategory = category;
    currentMenu.id = idProduit
    category === "menus" ? openModal(nomProduit, idProduit) : createModalOther(category, idProduit)
}
/**
 * gere l'ouverture de la modal
 * @param {*} nomProduit 
 * @param {*} idProduit 
 * @returns 
 */
function openModal(nomProduit, idProduit) {
    const menu = {
        title: 'Une grosse faim ?',
        text: 'Le menu maxi Best Of comprend un sandwich, une grande frite et une boisson 50 Cl',
        image1: './images/illustration-best-of.png',
        image2: './images/illustration-maxi-best-of.png',
        statut: 'menu',
        choiceOne: 'best of',
        choiceTwo: 'maxi best of',
        nom: nomProduit,
        id: idProduit
    };
    const side = {
        title: 'Choisissez votre side',
        text: 'Frites, potatoes, la pomme de terre dans tous ses états',
        image1: './frites/PETITE_FRITE.png',
        image2: './frites/POTATOES.png',
        statut: 'side',
        choiceOne: 'frites',
        choiceTwo: 'patatoes'
    };
    const boissonsMenu = {
        title: 'Choisissez votre boisson',
        text: 'Un soda, un jus de fruit ou un verre d’eau pour accompagner votre repas',
        statut: 'boissonsMenu'
    };

    let modalContent;

    switch (currentCategory) {
        case 'menus':
            modalContent = menu;
            createModalMenu(modalContent.title, modalContent.text, modalContent.image1, modalContent.image2, modalContent.choiceOne, modalContent.choiceTwo, modalContent.statut, modalContent.nom, modalContent.id, modalContent.datas);
            break;
        case 'side':
            modalContent = side;
            createModalMenu(modalContent.title, modalContent.text, modalContent.image1, modalContent.image2, modalContent.choiceOne, modalContent.choiceTwo, modalContent.statut);
            break;
        case 'boissonsMenu':
            extractDatas('boissons').then(datas => {
                modalContent = boissonsMenu;
                createModalMenu(modalContent.title, modalContent.text, null, null, null, null, modalContent.statut, Array.isArray(datas) ? datas : []);
            });
            break;
        default:
            return;
    }
}
/**
 * gere le changement de page au menu
 * @returns 
*/
function handleNext() {
    if (currentCategory === 'menus') {
        currentCategory = 'side';
    } else if (currentCategory === 'side') {
        currentCategory = 'boissonsMenu';
    } else if (currentCategory === 'boissonsMenu') {
        return;
    }
    openModal(currentCategory);
}
/**
 * gere le retour arriere des pages menu
 */
function handleBack() {
    if (currentCategory === 'side') {
        currentCategory = 'menus'
    } else if (currentCategory === 'boissonsMenu') {
        currentCategory = 'side'
    }
    openModal(currentCategory)
}
function closeModal(dialog) {
    const close = dialog.querySelector('.close');
    close.addEventListener('click', () => {
        dialog.close();
    });
}
/**
 * Construit le modal pour choisir son menu
 * @param {string} title 
 * @param {string} text 
 * @param {string} image1 
 * @param {string} image2 
 * @param {string} choiceOne 
 * @param {string} choiceTwo 
 * @param {string} statut 
 * @param {array} datas 
 * @param {int} idProduit 
 * @param {string} nomProduit 
 */
async function createModalMenu(title, text, image1, image2, choiceOne, choiceTwo, statut, datas = []) {
    // Vérifiez que `datas` est un tableau
    if (!Array.isArray(datas)) {
        console.error("Les données des boissons ne sont pas un tableau :", datas);
        datas = [];
    }
    // Suppression de la modal existante
    const existingDialog = document.querySelector('.dialog-menu');
    if (existingDialog) {
        existingDialog.remove();
    }

    const salade = await extractDatas('salades')
    console.log(salade[0].image);

    const contentbtn = `
        <div class="width40 card-modal flex item-center justify-center active" data-side=${choiceOne}>
            <img src="./public/wacdo/${image1}" alt="Illustration" >
            <p>${choiceOne}</p>
        </div>
        <div class="width40 card-modal flex item-center justify-center" data-side=${choiceTwo}>
            <img src="./public/wacdo/${image2}" alt="Illustration" >
            <p>${choiceTwo}</p>
        </div>
        ${statut === 'side' ? `<div class="width40 card-modal flex item-center justify-center "data-side=${salade[0].id}>
        <img src="./public/wacdo/${salade[0].image}" alt="Illustration" >
        <p>${salade[0].nom}</p>
    </div>
` : ''
    }
        `
    

    const contentBoissons = datas.length > 0 ? `
        <div class="slide-container-boissons flex">
            ${datas.map(data => `
                <div class="width40 modal-card-boissons modal-card-boissons-active flex item-center justify-center" data-id=${data.id}>
                    <img src="./public/wacdo/${data.image}" alt="boisson ${data.nom}">
                    <p>${data.nom}</p>
                </div>
            `).join('')}
        </div>
    ` : '<p>Aucune boisson disponible</p>';

    const dialog = document.createElement('dialog');
    dialog.className = `dialog-menu dialog-menu-${statut}`;
    dialog.innerHTML = `
        <div>
            <div class="padding20px">
                <button class="retour ${statut === 'menu' && 'd-none'}">Retour</button>
                <div><button class="close"><img src="./public/wacdo/images/supprimer.png" alt="Fermer"></button></div>
            </div>
            <div class="modal-choice-content padding20px flex space-between margin-autoLR">
                <div class="padding-bottom20px">
                    <p><span class="modal-title">${title}</span></p>
                    <p><span class="modal-text">${text}</span></p>
                </div>
                <div class="flex space-between space-between gap20px">
                    ${statut !== 'boissonsMenu' ? contentbtn : contentBoissons}
                </div>
                <div class='error-boisson d-none'><p class=" width100 text-center">Vous devez choisir une boisson</p></div>
                <div class="modal-button">
                    ${statut === 'boissonsMenu' ? '<button class="btn-first validateCommande">Ajouter le menu à ma commande</button>' : '<button class="btn-first">Etape Suivante</button>'}
                </div>
            </div>
        </div>
    `;

    //On ajoute la modal au document
    document.body.appendChild(dialog);
    dialog.showModal();

    // function qui gere la fermeture du modal dialog
    closeModal(dialog)


    const errorBoisson = document.querySelector('.error-boisson')

    // assignement des valeur par defaut
    const defaultSize = 'best of'
    const defaultSide = 'frite'

    //gere l'etat selected
    cardSelected('.card-modal')

    // Ecouteur d'evenement pour ma modal Size et side 
    const cards = document.querySelectorAll('.card-modal');
    cards.forEach(eltCard => {
        eltCard.addEventListener('click', () => {
            const selectedChoice = eltCard.getAttribute('data-side');
            if (statut === 'menu') {
                currentMenu.taille = selectedChoice
            } else if (statut === 'side') {
                currentMenu.side = selectedChoice
            }
        });
    });


    //appelle de la function cardSelected
    cardSelected('.modal-card-boissons')

    // ecouteur d'evenement pour la modal boissons
    const cardBoissons = document.querySelectorAll('.modal-card-boissons');
    cardBoissons.forEach(card => {
        card.addEventListener('click', () => {
            errorBoisson.classList.add('d-none')
            const selectedBoisson = card.getAttribute('data-id')
            currentMenu.boissons = selectedBoisson
            console.log(selectedBoisson);
            })

        });

    console.log(statut);
    // gestion du bouton next
    const nextButton = dialog.querySelector('.btn-first');
    nextButton.addEventListener('click', () => {
        if (currentMenu.taille === undefined) {
            currentMenu.taille = defaultSize
        }
        if (currentMenu.side === undefined) {
            currentMenu.side = defaultSide
        }
        handleNext()
    });

    //gestion du bouton back
    const backButton = dialog.querySelector('.retour')
    backButton.addEventListener('click', handleBack)

    console.log(currentMenu.taille);

    console.log(currentMenu);
    // ajouter la commande au panier
    const validateCommande = document.querySelector(".validateCommande")
    validateCommande && validateCommande.addEventListener('click', () => {
        if (currentMenu.boissons === undefined) {
            errorBoisson.classList.remove('d-none')
            console.log("c'est vide");
            return
        }
        // Initialisation de count
        let count = 1;
        // Boucle pour trouver une clé non utilisée
        while (storage.getItem('menu_' + count)) {
            count += 1; // Incrémentation de count
        }
        storage.setItem('menu_' + count, JSON.stringify(currentMenu));
        dialog.close()
        dialog.remove()
        createTempalteCart()
    });
}
/**
 * genere le modal autre que les menus
 * @param {string} category
 * @param {int} idProduit ('id du produit séléctionner)
 */
async function createModalOther(category, idProduit) {
    //definir le compteur d'article a 1 par defaut
    let count = 1;
    //definir la taille de la boisson a small par defaut
    const defaultSizeBoisson = 'small'
    // creattion de l'objet qui va contenire les infos
    let articles = new Object()
    articles = {
        'id': idProduit,
        'quantite': count
    }
    category==='boissons' ? articles.size = defaultSizeBoisson : ''


    const datas = await extractDatas(category)
    const datasFiltered = datas.find(dataFind => dataFind.id === idProduit)
    console.log(datasFiltered);
    // Vérifiez si une modal existe et la supprimer avant d'en créer une nouvelle
    const existDialog = document.querySelector('.dialog-boissons');
    if (existDialog) {
        existDialog.remove();
    }

    // Créer une boîte de dialogue
    const dialogOther = document.createElement('dialog');
    dialogOther.className = `dialog-${category}`;

    let content;
    if (category === "boissons") {
        content = `
            <div class="width40 card-modal card-boissons modal-img-small active flex item-center justify-center margin-autoLR" data-size="small">
                <img src="./public/wacdo/${datasFiltered.image}" alt="Illustration d'un ${datasFiltered.nom}">
                <p>30 cl</p>
            </div>
            <div class="width40 card-modal card-boissons modal-img-big flex item-center justify-center margin-autoLR" data-size="large">
                <img src="./public/wacdo/${datasFiltered.image}" alt="Illustration d'un ${datasFiltered.nom}">
                <p>50 cl</p>
            </div>
        `
    } else {
        content = `
            <div class="width40 card-modal modal-img flex item-center justify-center margin-autoLR">
                <img src="./public/wacdo/${datasFiltered.image}" alt="Illustration d'un ${datasFiltered.nom}">
            </div>
        `
    }
    // Contenu HTML de la modal avec les options de boissons
    dialogOther.innerHTML = `
        <div>
            <div class="padding20px">
                <button class="retour d-none">Retour</button>
                <div><button class="close"><img src="./public/wacdo/images/supprimer.png" alt="Fermer"></button></div>
            </div>
            <div class="modal-choice-content padding20px flex space-between margin-autoLR">
                <div class="padding-bottom20px">
                    <p><span class="modal-title">Choisissez votre boisson</span></p>
                    <p><span class="modal-text">Sélectionnez parmi nos options de boissons</span></p>
                </div>
                <div class="flex space-between gap20px">
                        ${content}
                </div>
                <div class="select-quantity flex justify-center"><button class="btn-moins">-</button><span class="quantity-display flex item-center justify-center">${count}</span><button class="btn-plus">+</button></div>
                <div class="modal-button">
                    <button class="btn-first btn-add">Ajouter le menu à ma commande</button>
                </div>
            </div>
        </div>
    `;
    // Ajouter la modal au document
    document.body.appendChild(dialogOther);
    dialogOther.showModal();

    //gestion de la taille des boissons
    cardSelected('.card-boissons')

    //reccuperation du getAttribut en fonction de sa selection
    const choiceSizeBoissons = document.querySelectorAll('.card-boissons');
    choiceSizeBoissons.forEach(choiceSize => {
        choiceSize.addEventListener('click', () => {
            const size = choiceSize.getAttribute('data-size');
            articles.size = size;
            console.log('Taille sélectionnée:', articles.size);
        });
    });

    // gestion de l'ajout au panier
    const btnAddCart = dialogOther.querySelector('.btn-add')
    btnAddCart.addEventListener('click', () => {
        // creattion de l'objet qui va contenire les infos
        console.log(articles);
        addCart(category ,articles)
        dialogOther.close()
        dialogOther.remove()
        createTempalteCart()
        console.log(storage);
    })
    console.log(storage);
    //gestion des boutons
    // Appel de la fonction pour fermer la popup
    closeModal(dialogOther)

    // gestion des boutons plus et moins
    const btnMoins = dialogOther.querySelector('.btn-moins');
    const btnPlus = dialogOther.querySelector('.btn-plus');
    const quantityDisplay = dialogOther.querySelector('.quantity-display');
    btnMoins.addEventListener('click', () => {
        if (count > 1) {
            count--;
            quantityDisplay.textContent = count;
            articles.quantite = count;
        }
        console.log('moins', count);
    });
    
    btnPlus.addEventListener('click', () => {
        count++;
        quantityDisplay.textContent = count;
        articles.quantite = count;
    });
}
/**
 * Fonction pour extraire les données des boissons
 * @param { string } (cle de ce qu'on veut reccuperer )
 * @returns {Array}
 */
async function extractDatas(value = "") {
    try {
        const reponse = await fetch('./public/produits.json');
        const datas = await reponse.json();
        return datas[value];
    } catch (erreur) {
        console.error('Erreur lors de la récupération des données des produits :', erreur);
        return [];
    }
}
/********** GESTION DU PANIER **********/
/**
 * afficher les infos dans le header du panier
 */
function refreshOrderInfo() {
    const orderInfo = document.querySelector('.order-info')
    orderInfo.innerHTML =
        `
    <p>Commande numéro</p>
    ${JSON.parse(storage.getItem('restauration'))[0].restauration === 'sur_place' ? '<p>Sur place</p>' : 
    `<p>${JSON.parse(storage.getItem('restauration'))[0].restauration}</p>`}
    `
}
/**
 * genere le template du panier 
 */
async function createTempalteCart() {
    // Sélectionner le container qui va recevoir le template
    const container = document.querySelector('.cart-content');
    // Vider le container pour éviter les doublons
    container.innerHTML = "";
    // Declaration du total
    let total = 0
    // Parcourir le localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('menu')) {
            // Récupération des données asynchrones
            let cartBoisson = await extractDatas('boissons');
            let cartMenu = await extractDatas('menus');
            let cartSalade = await extractDatas('salades');
            // Récupération des données pour les articles du menu
            const data = JSON.parse(localStorage.getItem(key));
            const menu = cartMenu.find(menuCurrent => menuCurrent.id === data.id);
            const salade = cartSalade.find(saladeCurrent => saladeCurrent.id == data.side);
            const boisson = cartBoisson.find(boissonCurrent => boissonCurrent.id == data.boissons);
            // on calcul la sommes des menus
            data.taille !== 'maxi' ? (total += menu.prix) : (total += (menu.prix + 0.50))

            let accompagnement = '';
            if (data.side === 'frite' || data.side === 'patatoes') {
                accompagnement = data.side;
            } else if (salade) {
                accompagnement = salade.nom;
            } else {
                accompagnement = 'accompagnement non trouvé';
            }
            const cardCart = document.createElement('div');
            cardCart.className = 'menu padding-bottom20px';
            cardCart.innerHTML = `
                <div class="flex item-center space-between">
                    <h3>${data.taille === 'maxi' ? `1 Maxi Best Of ${menu ? menu.nom : 'menu non trouvé'}` : `1 Best Of ${menu ? menu.nom : 'menu non trouvé'}`}</h3>
                    <img src="./public/wacdo/images/trash.png" alt="logo d'une poubelle pour la suppression" class="delete-item-cart" data-id="${key}">
                </div>
                <ul>
                <li>${accompagnement}</li>
                <li>${boisson ? boisson.nom : 'Boisson non trouvée'}</li>
                </ul>
            `;
            container.appendChild(cardCart);

        } else if (!key.startsWith('menu') && !key.startsWith('restauration')) {
            // Traitement des autres articles
            let datas = await extractDatas(key);
            const dataItem = JSON.parse(localStorage.getItem(key));
            dataItem.forEach(elt =>{
                const articles = datas.find(article => article.id == elt.id);
                console.log(dataItem);
                console.log(articles);
                console.log(elt);
                // on calcul la sommes des autres articles
                if(key === 'boissons'){
                    elt.size === "small" ? total += articles.prix : total += (articles.prix + 0.50)
                }else{
                    total += (articles.prix * elt.quantite)
                }
                
                const cardCart = document.createElement('div');
                cardCart.className = 'menu padding-bottom20px';
                cardCart.innerHTML = `
                <div class="flex item-center space-between">
                <h3>${articles ? `${elt.quantite} x ${articles.nom} ${key==='boissons' ? `${elt.size === "small" ? '30cl':'50cl'}` : ''}` : 'Article non trouvé'}</h3>
                <img src="./public/wacdo/images/trash.png" alt="logo d'une poubelle pour la suppression" class="delete-item-cart" data-id="${ articles ? articles.id : elt.id }"data-key="${key}">
                </div>
                `;
                container.appendChild(cardCart);
            })
        }
    }
    //Gestion de l'affichage du prix
    const price = document.querySelector('.price')
    price.innerHTML = `<p><span class="font-size42px">${total.toFixed(2)}</span></p>`
    // Gestion du bouton suppresion de l'article
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-item-cart')) {
            const id = e.target.getAttribute('data-id');
            const key = e.target.getAttribute('data-key')
            // On verifie que quel ecard Item et un tableau 
            //      si oui on cherche l'index
            let cardItems = JSON.parse(localStorage.getItem(key));
            if (cardItems && Array.isArray(cardItems)) {
                // Trouver l'index de l'article à supprimer
                const itemIndex = cardItems.find(item => item.id == id);
                console.log(itemIndex);
                if (itemIndex !== -1) {
                    // Supprimer cet article du tableau
                    cardItems.splice(itemIndex, 1);
                    localStorage.removeItem(key);
                }
            }else{
                localStorage.removeItem(id);
            }
            location.reload()
        }
    })
    //Gestion du bouton payer
    const pay = document.getElementById('pay')
    pay.addEventListener('click', () =>{
        console.log(JSON.parse(localStorage.getItem('restauration'))[0].restauration === 'emporter');
        if (JSON.parse(localStorage.getItem('restauration'))[0].restauration === 'emporter') {
            window.location.href = 'confirmation.html'
        }else {
            window.location.href = 'validation.html'
        } 
    })
}
