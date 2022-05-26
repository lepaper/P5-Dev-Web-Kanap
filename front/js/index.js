const allproducts = document.getElementById('items');
const productscards = document.querySelector('article');



let canapData = []

// Récupérer les donnée des canapés

const getallproducts = async () => {
    try {
        const res = await fetch('http://localhost:3000/api/products')
        canapData = await res.json();
        console.log(canapData);
    }
    catch {
        alert('erreur avec fetch')
    }


}
getallproducts();

// Afficher les canapés sur la page d'accueil et lien page produit (?id=)

const allproductsdisplay = async () => {

    await getallproducts();

    allproducts.innerHTML = canapData.map((canap) =>
