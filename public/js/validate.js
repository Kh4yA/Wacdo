import addCart from "./addCart.js";

// Console.log pour vérifier localStorage
console.log(localStorage);

// Références aux éléments DOM
const easelForm = document.getElementById('easelForm');
const num1 = document.getElementById('num1');
const num2 = document.getElementById('num2');
const num3 = document.getElementById('num3');
const valideEasel = document.getElementById('btnEasel');

// Gérer les entrées des champs
easelForm.addEventListener('input', (event) => {
    if (event.target.name === "num1" && event.target.value.length === 1) {
        num2.focus();
    } else if (event.target.name === "num2" && event.target.value.length === 1) {
        num3.focus();
    } else if (event.target.name === "num3" && event.target.value.length === 1) {
        valideEasel.focus();
    }
});

// Gérer le clic sur le bouton de validation
valideEasel.addEventListener('click', (e) => {
    e.preventDefault();
    const easelNumber = num1.value + num2.value + num3.value;
    const result = {
        easel: easelNumber
    };
localStorage.setItem('chevalet', result);
    window.location.href = 'confirmation.html'
});

