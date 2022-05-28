let canapData = [];

//  Récupérer les données du local storage

let itemInCart = JSON.parse(localStorage.getItem("product"));
console.table(itemInCart);

//  Récupérer les données des canapés  

const getCanapData = async () => {

    const res = await fetch(`http://localhost:3000/api/products`);
    canapData = await res.json();


    if (itemInCart.length === 0) {
        document.getElementById('cart__items').insertAdjacentHTML('beforeend', `<p>Votre panier est vide.</p>`);
        document.getElementById('cart__items').style.textAlign = "center";
        return
    }

    else {
        let totalPrice = 0;
        for (let i = 0; i < itemInCart.length; i++) {
            const canap = itemInCart[i];
            const realCanap = canapData.find(data => data._id === canap.id);


            totalPrice += itemInCart[i].quantity * realCanap.price;
            let totalPriceElement = document.getElementById('totalPrice');
            totalPriceElement.textContent = totalPrice;
            console.log(totalPrice)

            displayBasket(canap, realCanap);
        }

    }
}
getCanapData()


// Afficher le tableau récapitulatif des achats 

const displayBasket = (id, realId) => {


    let cartArticle = document.createElement("article");
    document.getElementById('cart__items').appendChild(cartArticle);
    cartArticle.className = "cart__item";
    cartArticle.setAttribute('data-id', id.id);
    cartArticle.setAttribute('data-color', id.color);

    let divCartImg = document.createElement("div");
    cartArticle.appendChild(divCartImg);
    divCartImg.className = "cart__item__content";
    let cartImg = document.createElement("img");
    divCartImg.appendChild(cartImg);
    cartImg.src = realId.imageUrl;
    cartImg.alt = realId.altTxt;

    let divItemContent = document.createElement("div");
    divItemContent.className = 'cart__item__content';
    cartArticle.appendChild(divItemContent);
    let divItemDescription = document.createElement('div');
    divItemContent.appendChild(divItemDescription);
    divItemDescription.className = 'cart__item__content__description';

    let productName = document.createElement("h2");
    productName.textContent = id.name;
    divItemDescription.appendChild(productName);

    let productColor = document.createElement('p');
    productColor.textContent = id.color;
    divItemDescription.appendChild(productColor);

    let productPrice = document.createElement('p');
    productPrice.textContent = realId.price + ' ' + '€';
    divItemDescription.appendChild(productPrice);


    let settingsBloc = document.createElement('div');
    settingsBloc.className = 'cart__item__content__settings';
    divItemContent.appendChild(settingsBloc);
    let settingsQuantity = document.createElement('div');
    settingsQuantity.className = 'cart__item__content__settings__quantity';
    settingsBloc.appendChild(settingsQuantity);

    let quantityTxt = document.createElement('p');
    quantityTxt.textContent = 'Qte : ';
    settingsQuantity.appendChild(quantityTxt);
    let inputQuantity = document.createElement('input');
    inputQuantity.setAttribute("type", "number");
    inputQuantity.setAttribute("name", "itemQuantity");
    inputQuantity.setAttribute("min", 1);
    inputQuantity.setAttribute("max", 100);
    inputQuantity.setAttribute("value", id.quantity);
    inputQuantity.classname = 'itemQuantity';
    settingsQuantity.appendChild(inputQuantity);
    inputQuantity.addEventListener('change', function (q) {
        id.quantity = inputQuantity.value;
        if (id.quantity <= 0 || id.quantity > 100) {
            return alert('Veuillez choisir une quantité comprise entre 1 et 100')
        }
        {
            localStorage.setItem("product", JSON.stringify(itemInCart));
            location.reload();

            console.log(itemInCart);
        }
    })
    let removeQuantity = document.createElement('div');
    removeQuantity.className = 'cart__item__content__settings__delete';
    settingsBloc.appendChild(removeQuantity);
    let removeQuantityButton = document.createElement('p');
    removeQuantityButton.className = 'deleteItem';
    removeQuantityButton.textContent = 'Supprimer';
    removeQuantityButton.setAttribute("id", `${id.id && id.color}`)
    removeQuantity.appendChild(removeQuantityButton);
    removeQuantityButton.addEventListener('click', function (e) {
        e.preventDefault();

        let idToRemove = id.id;
        let colorToRemove = id.color;
        console.log(idToRemove);
        console.log(colorToRemove)

        itemInCart = itemInCart.filter(element => element.id !== idToRemove || element.color !== colorToRemove);
        localStorage.setItem("product", JSON.stringify(itemInCart));
        e.target.closest('.cart__item').remove();
        alert(`${id.quantity} ${id.name} ${id.color} à été retiré du panier !`);
        location.reload();
        console.log(itemInCart)
    })
    getTotals()
}

async function getTotals() {
    // Qte

    let productQte = itemInCart;
    let totalQte = 0

    for (let product of productQte) {
        totalQte += Number(product.quantity);

    }

    let totalQuantity = document.getElementById('totalQuantity');
    totalQuantity.textContent = totalQte
    console.log(totalQte);
}

let emailReg = new RegExp('^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-z]{2,10}$');
let textRegExp = new RegExp("^[a-zA-Z-àâäéèêëïîôöùûüç ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

// Validation du formulaire  

function getForm() {

    const form = document.querySelector('.cart__order__form');


    form.firstName.addEventListener('change', function () {
        validFirstName(this);
    })

    const validFirstName = function (inputFirstName) {
        let firstNameErrorMsg = inputFirstName.nextElementSibling;


        if (textRegExp.test(inputFirstName.value)) {
            firstNameErrorMsg.innerHTML = '';
        }
        else {
            firstNameErrorMsg.innerHTML = 'Merci de renseigner votre prénom';
        }

    };

    form.lastName.addEventListener('change', function () {
        validLastName(this)
    })

    const validLastName = function (inputLastName) {
        let lastNameErrorMsg = inputLastName.nextElementSibling;

        if (textRegExp.test(inputLastName.value)) {
            lastNameErrorMsg.innerHTML = '';
        }
        else {
            lastNameErrorMsg.innerHTML = 'Merci de renseigner votre nom';
        }
    }

    form.address.addEventListener('change', function () {
        validAddress(this);

    })

    const validAddress = function (inputAddress) {
        let addressErrorMsg = inputAddress.nextElementSibling;

        if (addressRegExp.test(inputAddress.value)) {
            addressErrorMsg.innerHTML = '';
        }
        else {
            addressErrorMsg.innerHTML = 'Merci de renseigner votre adresse'
        }
    }

    form.city.addEventListener('change', function () {
        validCity(this);
    })

    const validCity = function (inputCity) {
        let cityErrorMsg = inputCity.nextElementSibling;

        if (textRegExp.test(inputCity.value)) {
            cityErrorMsg.innerHTML = '';
        }
        else {
            cityErrorMsg.innerHTML = 'Merci de renseigner une ville'
        }
    }

    form.email.addEventListener('change', function () {
        validEmail(this);
    })

    const validEmail = function (inputEmail) {
        let emailErrorMsg = inputEmail.nextElementSibling;

        if (emailReg.test(inputEmail.value)) {
            emailErrorMsg.innerHTML = '';
        }
        else {
            emailErrorMsg.innerHTML = 'Merci de renseigner votre email'
        }
    }
} getForm();
