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