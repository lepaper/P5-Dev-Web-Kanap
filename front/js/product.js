
//On récupere l'id du produit en question dans l'url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
//?
let article = '';

const colorSelect = document.querySelector('#colors');
const quantitySelect = document.querySelector('#quantity');

//On récupère les produits de l'API

fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => {
    return response.json();
  })
  .then((res) => {
    return getArticle(res);
  })
  .catch((error) => console.error(error));

//Création article des produits
function getArticle(article) {

  let elementImg = document.createElement('img');
  document.querySelector('.item__img').appendChild(elementImg);
  elementImg.src = article.imageUrl;
  elementImg.Alt = article.altTxt;

  let elementTitle = document.getElementById('title');
  elementTitle.textContent = article.name;

  let elementPrice = document.getElementById('price');
  elementPrice.textContent = article.price;

  let elementDescription = document.getElementById('description');
  elementDescription.textContent = article.description;

  for (let colors of article.colors) {
    let elementsColor = document.createElement('option');
    document.querySelector('#colors').appendChild(elementsColor);
    elementsColor.value = colors;
    elementsColor.textContent = colors;
  }
  // Appel de la function onClick
  onClick(article);
}

function onClick(article) {
  //button d'ajout des produits et écouteurs d'événement au click
  const button = document.querySelector('#addToCart');
  button.addEventListener('click', (e) => {

    let selectColor = colorSelect.value;
    let selectQuantity = quantitySelect.value;

    if (
      selectQuantity == 0 ||
      selectQuantity > 100 ||
      selectColor == null ||
      selectColor == ''
    ) {
      alert(
        //alert si l'utilisateur ne sélectionne pas de couleur et|ou de quantité
        'Veuillez renseigner une quantité comprise entre 1 et 100 et une couleur'
      );
      return;
    } else {

      //Récupération des informations de l'article à ajouter au panier
      let info = {
        idProduit: id,
        color: selectColor,
        quantity: Number(selectQuantity),
        nom: article.name,
        description: article.description,
        imageUrl: article.imageUrl,
        imgAlt: article.altTxt,
      };

      //init du localStorage

      let purchaseStorage = JSON.parse(localStorage.getItem('produit'));

      //alerte que l'utilisateur aura quand il ajoutera un article dans le panier

      const alertConfirmation = () => {
        if (
          window.confirm(
            `${selectQuantity} ${article.name} de couleur ${selectColor} bien ajouté à votre panier pour le consulter appuyer sur OK `
          )
        ) {
          //envoie l'utilisateur sur la page panier
          window.location.href = 'cart.html';
        } else {
          location.reload(); 
        }
      };

      if (purchaseStorage) {
        const foundStorage = purchaseStorage.find(
          (p) => p.idProduit === id && p.color === selectColor
        );
        if (foundStorage) {
          //Si dans le panier il y a un produit avec le même id et la même couleur
          let totalQuantity =
            parseInt(info.quantity) + parseInt(foundStorage.quantity);
          foundStorage.quantity = totalQuantity;
          localStorage.setItem('produit', JSON.stringify(purchaseStorage));
          alertConfirmation();
        } else {
          //Sinon (produit different de ceux deja commandé)

          purchaseStorage.push(info);
          localStorage.setItem('produit', JSON.stringify(purchaseStorage));
          alertConfirmation();
        }
      } else {
        //s'il n'y a rien dans le panier création array
        purchaseStorage = [];

        purchaseStorage.push(info);
        localStorage.setItem('produit', JSON.stringify(purchaseStorage));
        alertConfirmation();
      }
    }
  });
}
