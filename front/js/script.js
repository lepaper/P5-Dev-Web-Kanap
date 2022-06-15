const allproducts = document.getElementById('items');
//const productscards = document.querySelector('article');

//let canapData = []

// Récupérer les donnée des canapés

const getallproducts = async () => {

        const res = await fetch('http://localhost:3000/api/products')
        if(!res.ok){
            throw Error(res.statusText)
        }
        canapData = await res.json();
       
        return canapData;
}

// Afficher les canapés sur la page d'acceuil et lien produit

function getHtml(prod){
    return `<a href="product.html?id=${prod._id}">
        <article>
            <img src="${prod.imageUrl}" alt="${prod.altTxt}"/>
             <h3 class="productName">${prod.name}</h3>
             <p class="productDescription">${prod.description}</p>
        </article>       
    </a>`;
}


getallproducts()
    .then(products => {
       let productsHtml="";
        for (const product of products) {
           productsHtml += getHtml(product); 
        }
        allproducts.innerHTML= productsHtml;
       
    })
    .catch(err => console.log(err));

