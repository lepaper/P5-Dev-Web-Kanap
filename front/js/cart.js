
//on recupère le localStorage
let purchaseStorage = JSON.parse(localStorage.getItem('produit'));
let article = '';

//RegEx
let nameRegex = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
let emailRegex = new RegExp(
  '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$'
);
let adressRegex = new RegExp(
  '^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+'
);

// on fetch pour récupèrer le prix dans l'api
fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((data) => {
    if (purchaseStorage) {
      for (p of purchaseStorage) {
        const product = data.find((d) => d._id === p.idProduit);
        if (product) {
          p.price = product.price;
        }
      }
    }
    getItem();
    totalItems();
    modifyQuantity();
    deleteItem();
    getForm();
    orderForm();
  })
  .catch((error) => console.error(error));

//Fonction pour la Création de l'article ou l'affichage du panier vide
function getItem() {
  //Affichage si panier vide
  if (purchaseStorage === null || purchaseStorage.length === 0) {
    let emptyStorage = document.createElement('article');
    document.querySelector('#cart__items').appendChild(emptyStorage);
    emptyStorage.textContent = 'Votre panier est vide';
  } else {
    //si le panier n'est pas vide creation des cart article
    for (let p in purchaseStorage) {
      let article = document.createElement('article');
      document.querySelector('#cart__items').appendChild(article);
      article.classList.add('cart__item');
      article.dataset.id = purchaseStorage[p].idProduit;
      article.dataset.color = purchaseStorage[p].color;

      let divImage = document.createElement('div');
      article.appendChild(divImage);
      divImage.classList.add('cart__item__img');

      let imageInDiv = document.createElement('img');
      divImage.appendChild(imageInDiv);
      imageInDiv.src = purchaseStorage[p].imageUrl;
      imageInDiv.alt = purchaseStorage[p].imgAlt;

      let divContent = document.createElement('div');
      article.appendChild(divContent);
      divContent.classList.add('cart__item__content');

      let divContentDescription = document.createElement('div');
      divContent.appendChild(divContentDescription);
      divContentDescription.classList.add('cart__item__content__description');

      let divContentDescriptionH2 = document.createElement('h2');
      divContentDescription.appendChild(divContentDescriptionH2);
      divContentDescriptionH2.textContent = purchaseStorage[p].nom;

      let divContentDescriptionP = document.createElement('p');
      divContentDescription.appendChild(divContentDescriptionP);
      divContentDescriptionP.textContent = purchaseStorage[p].color;

      let divContentDescriptionPrice = document.createElement('p');
      divContentDescription.appendChild(divContentDescriptionPrice);
      divContentDescriptionPrice.textContent = purchaseStorage[p].price + ' €';

      let divContentSettings = document.createElement('div');
      divContent.appendChild(divContentSettings);
      divContentSettings.classList.add('cart__item__content__settings');

      let divContentSettingsQuantity = document.createElement('div');
      divContentSettings.appendChild(divContentSettingsQuantity);
      divContentSettingsQuantity.classList.add(
        'cart__item__content__settings__quantity'
      );

      let divContentSettingsQuantityP = document.createElement('p');
      divContentSettingsQuantity.appendChild(divContentSettingsQuantityP);
      divContentSettingsQuantityP.textContent = 'Qté :';

      let inputQuantity = document.createElement('input');
      divContentSettingsQuantity.appendChild(inputQuantity);
      inputQuantity.setAttribute('type', 'number');
      inputQuantity.classList.add('itemQuantity');
      inputQuantity.setAttribute('name', 'itemQuantity');
      inputQuantity.setAttribute('min', '1');
      inputQuantity.setAttribute('max', '100');
      inputQuantity.value = purchaseStorage[p].quantity; // A REVOIR

      let itemDelete = document.createElement('div');
      divContentSettings.appendChild(itemDelete);
      itemDelete.classList.add('cart__item__content__settings__delete');

      let itemDeleteP = document.createElement('p');
      itemDelete.appendChild(itemDeleteP);
      itemDeleteP.classList.add('deleteItem');
      itemDeleteP.textContent = 'Supprimer';
    }
  }
}

//fonction pour quantité total et prix total des articles
function totalItems() {
  //Calcul de la quantité
  let eltQuantity = document.getElementsByClassName('itemQuantity');

  let totalQuantitySelect = 0;

  for (let i = 0; i < eltQuantity.length; i++) {
    totalQuantitySelect += eltQuantity[i].valueAsNumber;
  }
  let totalQuantityItems = document.getElementById('totalQuantity');
  totalQuantityItems.textContent = totalQuantitySelect;

  //calcul du Prix
  let totalPrice = 0;
  for (let i = 0; i < eltQuantity.length; i++) {
    totalPrice += eltQuantity[i].valueAsNumber * purchaseStorage[i].price;
  }
  let productTotalPrice = document.getElementById('totalPrice');
  productTotalPrice.textContent = totalPrice;
}

function modifyQuantity() {
  const modifQuantity = document.querySelectorAll('.itemQuantity');

  for (let i = 0; i < modifQuantity.length; i++) {
    modifQuantity[i].addEventListener('change', function (event) {
      event.preventDefault();

      purchaseStorage[i].quantity = event.target.value;

      if (
        purchaseStorage[i].quantity == 0 ||
        purchaseStorage[i].quantity > 100
      ) {
        alert('Veuillez sélectionner une quantité comprise entre 1 et 100');
        location.reload();
      } else {
        localStorage.setItem('produit', JSON.stringify(purchaseStorage));
        totalItems();
      }
    });
  }
}

function deleteItem() {
  const delItem = document.querySelectorAll('.deleteItem');
  for (let d = 0; d < delItem.length; d++) {
    delItem[d].addEventListener('click', (e) => {
      e.preventDefault();
      //demande de confirmation de la suppression de l'article
      if (
        window.confirm(
          `Êtes- vous sur de vouloir supprimer ${purchaseStorage[d].quantity} ${purchaseStorage[d].nom} de couleur ${purchaseStorage[d].color} ?`
        )
      ) {
        let idDelItem = purchaseStorage[d].idProduit;
        let colorDelItem = purchaseStorage[d].color;

        purchaseStorage = purchaseStorage.filter(
          (element) =>
            element.idProduit !== idDelItem || element.color !== colorDelItem
        );
        localStorage.setItem('produit', JSON.stringify(purchaseStorage));
        location.reload();
      }
    });
  }
}

//Validation du formulaire

function getForm() {

  let firstName = document.getElementById('firstName');
  firstName.addEventListener('input', function () {
    if (nameRegex.test(firstName.value) === false) {
      document.getElementById('firstNameErrorMsg').textContent =
        'Format du prénom incorrect';
    } else {
      document.getElementById('firstNameErrorMsg').textContent = '';
    }
  });

  let lastName = document.getElementById('lastName');
  lastName.addEventListener('input', function () {
    if (nameRegex.test(lastName.value) === false) {
      document.getElementById('lastNameErrorMsg').textContent =
        'Format du nom incorrect';
    } else {
      document.getElementById('lastNameErrorMsg').textContent = '';
    }
  });

  let address = document.getElementById('address');
  address.addEventListener('input', function () {
    if (adressRegex.test(address.value) === false) {
      document.getElementById('addressErrorMsg').textContent =
        "Format de l'adresse incorrect";
    } else {
      document.getElementById('addressErrorMsg').textContent = '';
    }
  });

  let city = document.getElementById('city');
  city.addEventListener('input', function () {
    if (nameRegex.test(city.value) === false) {
      document.getElementById('cityErrorMsg').textContent =
        'Format de la ville incorrecte';
    } else {
      document.getElementById('cityErrorMsg').textContent = '';
    }
  });

  let email = document.getElementById('email');
  email.addEventListener('input', function () {
    if (emailRegex.test(email.value) === false) {
      document.getElementById('emailErrorMsg').textContent =
        "Format de l'email incorrect";
    } else {
      document.getElementById('emailErrorMsg').textContent = '';
    }
  });
}

function orderForm() {
  const orderButton = document.getElementById('order');

  orderButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!purchaseStorage) {
      alert(
        'Votre panier est vide, veuillez sélectionner un article pour passer une commande'
      );
      
    }

    else if (
      !nameRegex.test(firstName.value) ||
      !nameRegex.test(lastName.value) ||
      !emailRegex.test(email.value) ||
      !nameRegex.test(city.value) ||
      !adressRegex.test(address.value)
    ) {
      alert('Veuillez remplir correctement tous les champs du formulaire');
    } else {
      //création d'un tableau pour recuperer les ID produits
      let productId = [];
      for (let i = 0; i < purchaseStorage.length; i++) {
        productId.push(purchaseStorage[i].idProduit);
      }

      let buyOrder = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: productId,
      };
      console.log(buyOrder);
      //option de la method post fetch
      const postOptions = {
        method: 'POST',
        body: JSON.stringify(buyOrder),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      };
      //Appel de l'API pour post les informations order
      fetch('http://localhost:3000/api/products/order', postOptions)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const orderId = data.orderId;
          window.location.href = 'confirmation.html' + '?orderId=' + orderId;
        })
        .catch((error) => {
          alert(error);
        });
    }
  });
}