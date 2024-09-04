import addCart from "./addCart.js";
import hydratebubble from "./cartResponsive.js";
/***********  RECCUPERATION ET TRAITEMENT DE L'URL ***********/
// Récupère l'URL actuelle
const url = document.location.href;
// Crée une instance de URLSearchParams avec les paramètres de l'URL actuelle
let params = new URLSearchParams(window.location.search);
// Récupère la valeur du paramètre 'choix'
let choixRestauration = params.get("choix");
const storage = localStorage;
console.log(choixRestauration);

storage.setItem("restauration", choixRestauration);
/************ Declaration de la variable localstorage qui va contenir le panier  *************/
//Creation de la variable currentMenu
let currentMenu = {};
let currentCart = [];
/************ Gestion du bouton abandon **************/
/**
 * supprime le local storage
 */
function clear() {
  storage.clear();
  window.location.href = "index.html";
  console.log(storage);
}
const btnClear = document
  .querySelector(".clear")
  .addEventListener("click", clear);
// au chargement de la page on affiche le tye de restauration sur place ouy a emporter
window.addEventListener("load", () => {
  extractDatasProduits("menus");
  nameCategory("menus");
  refreshOrderInfo();
  createTempalteCart();
  hydratebubble();
});
/********** AJAX ***********/
/********** gerer l'etat selectionner ou non des cartes **********/
/**
 * Ajoute l'etat active a une carte
 * @param {string} selectorClass (selectaur de class au format ('.selectorClass'))
 */
function cardSelected(selectorClass) {
  let cards = document.querySelectorAll(selectorClass);
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((otherCard) => otherCard.classList.remove("active"));
      card.classList.add("active");
    });
  });
}
// traitement du menu sliders avec les categories
//Appel de la methode fetch pour traiter les données
fetch("http://exam-back.mdaszczynski.mywebecom.ovh/API_wacdo_categories")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((datas) => {
    console.log(datas);
    construcTemplateCategory(datas);
  })
  .catch((error) => {
    console.error(
      "Erreur lors de la récupération des données des produits :",
      error
    );
  });
/**
 * Construire le template des catégories
 * @param {Array} datas - Tableau de données
 */
function construcTemplateCategory(datas) {
  const container = document.querySelector(".slider-menu-content");
  // Réinitialise le conteneur
  container.innerHTML = "";
  datas.forEach((data) => {
    const cardMenu = document.createElement("div");
    cardMenu.className = "card-menu flex item-center justify-center";
    cardMenu.setAttribute("data-category", data.title);
    cardMenu.setAttribute("data-id", data.id);
    cardMenu.innerHTML = `
                <img src="./public/wacdo${data.image}" alt="image du menu best-of">
                <p>${data.title}</p>
        `;
    //gere l'etat selected
    cardSelected(".card-menu");
    // On ecoute l'evenement sur la carte
    cardMenu.addEventListener("click", () => {
      handleClickCategory(data.title);
    });
    container.appendChild(cardMenu);
  });
}
/**
 * Recharge les donnée et passe a l'etat actif ou non
 * @param {string} category (categorie active du click)
 */
function handleClickCategory(category) {
  // au click sur chaque categorie on rappelle le fetch
  extractDatasProduits(category);
  nameCategory(category);
}
/**
 * affiche le nom de la categorie séléctionner
 * @param {*} category
 */
function nameCategory(category) {
  const name = document.querySelector(".name-category");
  name.innerHTML = "";
  name.innerHTML = `
    <h3>Nos ${category}</h3>
    <h4>Une petite soif, sucrée, légère, rafraîchissante </h4>

    `;
}
/**
 * extraire la donnée, appel constructTamplateItem()
 * @param {string} category
 */
function extractDatasProduits(category) {
  fetch("http://exam-back.mdaszczynski.mywebecom.ovh/API_wacdo_produits")
    .then((rep) => rep.json())
    .then((datas) => {
      // Filtrer les articles par catégorie avant de construire le template
      console.log(datas);
      construcTemplateItem(datas[category], category);
    })
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des données des produits :",
        error
      );
    });
}
/**
 * Construire le template des articles
 * @param {Array} datas  Tableau de données filtrées par catégorie
 * @param {string} category Chaine de caractere desigant la categorie
 */
function construcTemplateItem(datas, category) {
  const container = document.querySelector(".container-item-selection");
  // Réinitialise le container pour éviter les doublons
  container.innerHTML = "";
  datas.forEach((data) => {
    const cardItem = document.createElement("div");
    cardItem.className = "card-item flex space-between item-center";
    cardItem.setAttribute("data-category", category);
    cardItem.setAttribute("data-id", data.id);
    cardItem.setAttribute("data-nomMenu", data.nom);
    cardItem.innerHTML = `
            <img src="${data.image}" alt="image d'un ${data.nom}">
            <p>${data.nom}</p>
            <p>${data.prix}€</p>
        `;
    cardItem.addEventListener("click", (e) => {
      let nomProduit = data.nom;
      let idProduit = data.id;
      handleClickProduit(category, nomProduit, idProduit);
    });
    container.appendChild(cardItem);
    //gere l'etat selected
    cardSelected(".card-item");
  });
}
/********** MODAL **********/
// État pour suivre la catégorie actuelle
let currentCategory = "menus";
/**
 * gere le click sur la carte produit
 * @param {string} category
 * @param {string} nomProduit
 * @param {string} idProduit
 */
function handleClickProduit(category, nomProduit, idProduit) {
  currentCategory = category;
  currentMenu.id_produit = idProduit;
  category === "menus"
    ? openModal(nomProduit, idProduit)
    : createModalOther(category, idProduit);
}
/**
 * gere l'ouverture de la modal
 * @param {*} nomProduit
 * @param {*} idProduit
 * @returns
 */
function openModal(nomProduit, idProduit) {
  const menu = {
    title: "Une grosse faim ?",
    text: "Le menu maxi Best Of comprend un sandwich, une grande frite et une boisson 50 Cl",
    image1: "./public/wacdo/images/illustration-best-of.png",
    image2: "./public/wacdo/images/illustration-maxi-best-of.png",
    statut: "menu",
    choiceOne: "best of",
    choiceTwo: "maxi best of",
    nom: nomProduit,
    id: idProduit,
  };
  const side = {
    title: "Choisissez votre side",
    text: "Frites, potatoes, la pomme de terre dans tous ses états",
    image1:
      "http://exam-back.mdaszczynski.mywebecom.ovh/public/wacdo/5522272046c8703cbf3a5f51c61dcecb.png",
    image2:
      "http://exam-back.mdaszczynski.mywebecom.ovh/public/wacdo/c4b292ac2b9ca13e0ddb60647e74e041.png",
    statut: "side",
    choiceOne: "frites",
    choiceTwo: "patatoes",
  };
  const boissonsMenu = {
    title: "Choisissez votre boisson",
    text: "Un soda, un jus de fruit ou un verre d’eau pour accompagner votre repas",
    statut: "boissonsMenu",
  };

  let modalContent;

  switch (currentCategory) {
    case "menus":
      modalContent = menu;
      createModalMenu(
        modalContent.title,
        modalContent.text,
        modalContent.image1,
        modalContent.image2,
        modalContent.choiceOne,
        modalContent.choiceTwo,
        modalContent.statut,
        modalContent.nom,
        modalContent.id,
        modalContent.datas
      );
      break;
    case "side":
      modalContent = side;
      createModalMenu(
        modalContent.title,
        modalContent.text,
        modalContent.image1,
        modalContent.image2,
        modalContent.choiceOne,
        modalContent.choiceTwo,
        modalContent.statut
      );
      break;
    case "boissonsMenu":
      extractDatas("boissons").then((datas) => {
        modalContent = boissonsMenu;
        createModalMenu(
          modalContent.title,
          modalContent.text,
          null,
          null,
          null,
          null,
          modalContent.statut,
          Array.isArray(datas) ? datas : []
        );
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
  if (currentCategory === "menus") {
    currentCategory = "side";
  } else if (currentCategory === "side") {
    currentCategory = "boissonsMenu";
  } else if (currentCategory === "boissonsMenu") {
    return;
  }
  openModal(currentCategory);
}
/**
 * gere le retour arriere des pages menu
 */
function handleBack() {
  if (currentCategory === "side") {
    currentCategory = "menus";
  } else if (currentCategory === "boissonsMenu") {
    currentCategory = "side";
  }
  openModal(currentCategory);
}
function closeModal(dialog) {
  const close = dialog.querySelector(".close");
  close.addEventListener("click", () => {
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
async function createModalMenu(
  title,
  text,
  image1,
  image2,
  choiceOne,
  choiceTwo,
  statut,
  datas = []
) {
  // Vérifiez que `datas` est un tableau
  if (!Array.isArray(datas)) {
    console.error("Les données des boissons ne sont pas un tableau :", datas);
    datas = [];
  }
  // Suppression de la modal existante
  const existingDialog = document.querySelector(".dialog-menu");
  if (existingDialog) {
    existingDialog.remove();
  }

  const salade = await extractDatas("salades");
  const frite = await extractDatas("frites");
  console.log(salade[0].image);
  console.log(frite);

  currentMenu.category = "menus";

  const contentbtn = `
        <div class="width40 card-modal flex item-center justify-center active" data-side=${choiceOne} data-id=${
    frite[1].id
  }>
            <img src="${frite[1].image}" alt="Illustration" >
            <p>${choiceOne}</p>
        </div>
        <div class="width40 card-modal flex item-center justify-center" data-side=${choiceTwo} data-id=${
    frite[2].id
  }>
            <img src="${frite[2].image}" alt="Illustration" >
            <p>${choiceTwo}</p>
        </div>
        ${
          statut === "side"
            ? `<div class="width40 card-modal flex item-center justify-center "data-side=${salade[0].id}>
        <img src="http://exam-back.mdaszczynski.mywebecom.ovh/public/wacdo/04e284f4fa8d56b2fdb9368b28453cd3.png" alt="Illustration" >
        <p>${salade[0].nom}</p>
    </div>
`
            : ""
        }
        `;

  const contentBoissons =
    datas.length > 0
      ? `
        <div class="slide-container-boissons flex">
            ${datas
              .map(
                (data) => `
                <div class="width40 modal-card-boissons modal-card-boissons-active flex item-center justify-center" data-id=${data.id}>
                    <img src="${data.image}" alt="boisson ${data.nom}">
                    <p>${data.nom}</p>
                </div>
            `
              )
              .join("")}
        </div>
    `
      : "<p>Aucune boisson disponible</p>";

  const dialog = document.createElement("dialog");
  dialog.className = `dialog-menu dialog-menu-${statut}`;
  dialog.innerHTML = `
        <div>
            <div class="padding20px">
                <button class="retour ${
                  statut === "menu" && "d-none"
                }">Retour</button>
                <div><button class="close"><img src="./public/wacdo/images/supprimer.png" alt="Fermer"></button></div>
            </div>
            <div class="modal-choice-content padding20px flex space-between margin-autoLR">
                <div class="padding-bottom20px">
                    <p><span class="modal-title">${title}</span></p>
                    <p><span class="modal-text">${text}</span></p>
                </div>
                <div class="flex space-between space-between gap20px">
                    ${statut !== "boissonsMenu" ? contentbtn : contentBoissons}
                </div>
                <div class='error-boisson d-none'><p class=" width100 text-center">Vous devez choisir une boisson</p></div>
                <div class="modal-button">
                    ${
                      statut === "boissonsMenu"
                        ? '<button class="btn-first validateCommande">Ajouter le menu à ma commande</button>'
                        : '<button class="btn-first">Etape Suivante</button>'
                    }
                </div>
            </div>
        </div>
    `;

  //On ajoute la modal au document
  document.body.appendChild(dialog);
  dialog.showModal();

  // function qui gere la fermeture du modal dialog
  closeModal(dialog);

  const errorBoisson = document.querySelector(".error-boisson");

  // assignement des valeur par defaut
  const defaultSize = "best of";
  const defaultSide = "frite";
  const defaultSideId = frite[1].id;

  //gere l'etat selected
  cardSelected(".card-modal");

  // Ecouteur d'evenement pour ma modal Size et side
  const cards = document.querySelectorAll(".card-modal");
  cards.forEach((eltCard) => {
    eltCard.addEventListener("click", () => {
      const selectedChoice = eltCard.getAttribute("data-side");
      const selectedChoiceId = eltCard.getAttribute("data-id");
      if (statut === "menu") {
        currentMenu.taille = selectedChoice;
      } else if (statut === "side") {
        currentMenu.side = selectedChoice;
        currentMenu.id_side = parseFloat(selectedChoiceId);
      }
    });
  });

  //appelle de la function cardSelected
  cardSelected(".modal-card-boissons");

  // ecouteur d'evenement pour la modal boissons
  const cardBoissons = document.querySelectorAll(".modal-card-boissons");
  cardBoissons.forEach((card) => {
    card.addEventListener("click", () => {
      errorBoisson.classList.add("d-none");
      const selectedBoisson = card.getAttribute("data-id");
      currentMenu.id_boisson = parseFloat(selectedBoisson);
      console.log(selectedBoisson);
    });
  });

  console.log(statut);
  // gestion du bouton next
  const nextButton = dialog.querySelector(".btn-first");
  nextButton.addEventListener("click", () => {
    if (currentMenu.taille === undefined) {
      currentMenu.taille = defaultSize;
    }
    if (currentMenu.side === undefined) {
      currentMenu.side = defaultSide;
      currentMenu.id_side = defaultSideId;
    }
    handleNext();
  });

  //gestion du bouton back
  const backButton = dialog.querySelector(".retour");
  backButton.addEventListener("click", handleBack);

  console.log(currentMenu.taille);

  console.log(currentMenu);
  // ajouter la commande au panier
  const validateCommande = document.querySelector(".validateCommande");
  validateCommande.addEventListener("click", () => {
    if (currentMenu.id_boisson === undefined) {
      errorBoisson.classList.remove("d-none");
      console.log("c'est vide");
      return;
    }
    // Clonez l'objet `currentMenu` avant de l'ajouter au panier
    const menuToAdd = { ...currentMenu };
    currentCart.push(menuToAdd);
    dialog.close();
    dialog.remove();
    createTempalteCart();
    hydratebubble();
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
  const defaultSizeBoisson = "small";
  // creattion de l'objet qui va contenire les infos
  let articles = new Object();
  articles = {
    category: category,
    id_produit: idProduit,
    quantite: count,
  };
  category === "boissons" ? (articles.size = defaultSizeBoisson) : "";

  const datas = await extractDatas(category);
  const datasFiltered = datas.find((dataFind) => dataFind.id === idProduit);
  console.log(datasFiltered);
  // Vérifiez si une modal existe et la supprimer avant d'en créer une nouvelle
  const existDialog = document.querySelector(".dialog-boissons");
  if (existDialog) {
    existDialog.remove();
  }

  // Créer une boîte de dialogue
  const dialogOther = document.createElement("dialog");
  dialogOther.className = `dialog-${category}`;

  let content;
  if (category === "boissons") {
    content = `
            <div class="width40 card-modal card-boissons modal-img-small active flex item-center justify-center margin-autoLR" data-size="small">
                <img src="${datasFiltered.image}" alt="Illustration d'un ${datasFiltered.nom}">
                <p>30 cl</p>
            </div>
            <div class="width40 card-modal card-boissons modal-img-big flex item-center justify-center margin-autoLR" data-size="large">
                <img src="${datasFiltered.image}" alt="Illustration d'un ${datasFiltered.nom}">
                <p>50 cl</p>
            </div>
        `;
  } else {
    content = `
            <div class="width40 card-modal modal-img flex item-center justify-center margin-autoLR">
                <img src="${datasFiltered.image}" alt="Illustration d'un ${datasFiltered.nom}">
            </div>
        `;
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
  cardSelected(".card-boissons");

  //reccuperation du getAttribut en fonction de sa selection
  const choiceSizeBoissons = document.querySelectorAll(".card-boissons");
  choiceSizeBoissons.forEach((choiceSize) => {
    choiceSize.addEventListener("click", () => {
      const size = choiceSize.getAttribute("data-size");
      articles.size = size;
      console.log("Taille sélectionnée:", articles.size);
    });
  });

  // gestion de l'ajout au panier
  const btnAddCart = dialogOther.querySelector(".btn-add");
  btnAddCart.addEventListener("click", () => {
    // creattion de l'objet qui va contenire les infos
    console.log(articles);
    // addCart(category, articles)
    currentCart.push(articles);
    dialogOther.close();
    dialogOther.remove();
    createTempalteCart();
    hydratebubble();
  });
  console.log(currentCart);
  // Appel de la fonction pour fermer la popup
  closeModal(dialogOther);

  // gestion des boutons plus et moins
  const btnMoins = dialogOther.querySelector(".btn-moins");
  const btnPlus = dialogOther.querySelector(".btn-plus");
  const quantityDisplay = dialogOther.querySelector(".quantity-display");
  btnMoins.addEventListener("click", () => {
    if (count > 1) {
      count--;
      quantityDisplay.textContent = count;
      articles.quantite = count;
    }
    console.log("moins", count);
  });

  btnPlus.addEventListener("click", () => {
    count++;
    quantityDisplay.textContent = count;
    articles.quantite = count;
  });
}
/**
 * Fonction pour extraire les données des selon la value
 * @param { string } (cle de ce qu'on veut reccuperer )
 * @returns {Array}
 */
async function extractDatas(value = "") {
  try {
    const reponse = await fetch(
      "http://exam-back.mdaszczynski.mywebecom.ovh/API_wacdo_produits"
    );
    const datas = await reponse.json();
    return datas[value];
  } catch (erreur) {
    console.error(
      "Erreur lors de la récupération des données des produits :",
      erreur
    );
    return [];
  }
}
/********** GESTION DU PANIER **********/
/**
 * afficher les infos dans le header du panier
 */
function refreshOrderInfo() {
  const orderInfo = document.querySelector(".order-info");
  orderInfo.innerHTML = `
    <p>Commande numéro</p>
    ${
      storage.getItem("restauration") === "sur_place"
        ? "<p>Sur place</p>"
        : `<p>${storage.getItem("restauration")}</p>
            <div>
            <p> <span class="font-size42px">${storage.getItem(
              "order"
            )}</span></p>
        </div>
`
    }
    `;
}
/**
 * genere le template du panier
 */
async function createTempalteCart() {
  console.log(currentCart);

  // Sélectionner le container qui va recevoir le template
  const container = document.querySelector(".cart-content");
  // Vider le container
  container.innerHTML = "";

  // Récupération des données des boissons, menus et salades
  let cartBoisson, cartMenu, cartSalade;
  try {
    cartBoisson = await extractDatas("boissons");
    cartMenu = await extractDatas("menus");
    cartSalade = await extractDatas("salades");
  } catch (error) {
    console.error("Erreur  :", error);
    return;
  }
  console.log(cartBoisson);
  console.log(cartMenu);
  console.log(cartSalade);

  // Déclaration du total
  let total = 0;

  // Boucle pour afficher les produits dans le panier
  for (let data of currentCart) {
    let cardCart = document.createElement("div");
    cardCart.className = "menu padding-bottom20px";

    if (data.category.includes("menus")) {
      const menu = cartMenu.find((menuCurrent) => menuCurrent.id === data.id_produit);
      const salade = cartSalade.find((saladeCurrent) => saladeCurrent.id == data.id_side);
      const boisson = cartBoisson.find((boissonCurrent) => boissonCurrent.id == data.id_boisson);

      if (!menu) {
        console.error("Menu non trouvé pour l'id:", data.id_produit);
        continue; // Passer à l'article suivant si le menu n'est pas trouvé
    }

      const prixMenu = parseFloat(menu.prix);
      total += data.taille !== "maxi" ? prixMenu : prixMenu + 0.5;

      let accompagnement = '';
      if (data.side === 'frite' || data.side === 'patatoes') {
          accompagnement = data.side;
      } else if (salade) {
          accompagnement = salade.nom;
      } else {
          accompagnement = 'accompagnement non trouvé';
      }
      cardCart.innerHTML = `
                <div class="flex item-center space-between">
                    <h3>${data.taille === "maxi"? `1 Maxi Best Of ${menu.nom}`: `1 Best Of ${menu.nom}`}</h3>
                    <img src="./public/wacdo/images/trash.png" alt="logo d'une poubelle pour la suppression" class="delete-item-cart" data-id="${data.id_produit}" data-price='${data.price}'>
                </div>
                <ul>
                    <li>${accompagnement}</li>
                    <li>${boisson ? boisson.nom : "Boisson non trouvée"}</li>
                </ul>`;
      container.appendChild(cardCart);
    } else {
      let datas;
      try {
        datas = await extractDatas(data.category);
      } catch (error) {
        console.error(`Erreur  ${data.category} :`, error);
        continue;
      }
      const article = datas.find((article) => article.id == data.id_produit);

      if (!article) {
        console.error("Article non trouvé pour l'id:", data.id_produit);
        continue;
      }

      const prixArticle = parseFloat(article.prix);
      if (data.category === "boissons") {
        total += data.size === "small" ? prixArticle : prixArticle + 0.5;
      } else {
        total += prixArticle * data.quantite;
      }

      cardCart.innerHTML = `
                <div class="flex item-center space-between">
                    <h3>${data.quantite} x ${article.nom} ${data.category === "boissons"? `${data.size === "small" ? "30cl" : "50cl"}`: ""}</h3>
                    <img src="./public/wacdo/images/trash.png" alt="logo d'une poubelle pour la suppression" class="delete-item-cart" data-id="${data.id_produit}" data-price='${data.price}'></div>`;
            container.appendChild(cardCart);
        }
  }

  console.log(total);
  // Affichage du prix total
  const price = document.querySelector(".price");
  price.innerHTML = `<p><span class="font-size42px">${parseFloat(total).toFixed(
    2
  )}</span></p>`;

  // Gestion du bouton de suppression d'article
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-item-cart")) {
      const id = e.target.getAttribute("data-id");
      const price = parseFloat(e.target.getAttribute("data-price"));
        total -= price;
        const priceElement = document.querySelector(".price span");
        priceElement.textContent = parseFloat(total).toFixed(2);
      currentCart = currentCart.filter((item) => item.id != id);
      e.target.closest(".menu").remove();
    }
  });

  // Préparer les données à envoyer lors du paiement
  function prepareJSON() {
    const data = {};
    if (localStorage.getItem("order")) {
      data.order = localStorage.getItem("order");
    }
    if (localStorage.getItem("restauration")) {
      data.restauration = localStorage.getItem("restauration");
    }
    data.composition = currentCart;
    return data;
  }

  // Gestion du bouton payer
  const pay = document.getElementById("pay");
  pay.addEventListener("click", () => {
    const data = prepareJSON();
    console.log(
      `Le json avant la requete ressembel a ca ${JSON.stringify(data)}`
    );
    if (localStorage.getItem("restauration") === "emporter") {
      fetch("http://exam-back.mdaszczynski.mywebecom.ovh/API_wacdo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Erreur de requête");
          }
        })
        .then((data) => {
          console.log("Réponse du serveur:", data);
          window.location.href = 'confirmation.html';
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi de la requête :", error);
        });
    } else {
      window.location.href = 'validation.html';
    }
  });
}
