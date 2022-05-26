const product = document.getElementById('item');
const productcontenair = document.querySelector('article');

// Lien entre page accueil et produit

let params = new URL(document.location).searchParams;
let canapId = params.get('id');


let canapData = [];

// Chercher les info de l'API
const getproductbyID = async () => {
    try {

        const res = await fetch(`http://localhost:3000/api/products/${canapId}`)
        canapData = await res.json()

        console.log(canapData);
    }
    catch {
        alert('Problème avec fetch')
    }
} 
getproductbyID();

//  Afficher les produit en fonction de l'ID

const DisplayById = async () => {

    await getproductbyID();

    let productImg = document.querySelector('.item__img');
    productImg.innerHTML = `<img src="${canapData.imageUrl}" alt="${canapData.altTxt}">`;

    let productTitle = document.getElementById('title');
    productTitle.innerText = canapData.name;

    let productPrice = document.getElementById('price');
    productPrice.innerText = canapData.price;

    let productDescription = document.getElementById('description');
    productDescription.innerHTML = canapData.description;

    // Mapping pour choix de la couleur (plusieurs éléments)
    document.querySelector("#colors").insertAdjacentHTML
        ("beforeend", canapData.colors.map(colors => `<option value="${colors}">${colors}</option>`)
            .join());

}

DisplayById()


document.querySelector('#addToCart').addEventListener('click', function () {

    // Récupération des options du produits : 

    let optionProduct = {
        name: canapData.name,
        id: canapId,
        color: document.getElementById('colors').value,
        quantity: Number(document.getElementById('quantity').value),

    }
})
