let canapData = [];

//  Récupérer les données du local storage

let itemInCart = JSON.parse(localStorage.getItem("product"));
console.table(itemInCart);



//  Récupérer les données des canapés hors lS 

const getCanapData = async () => {

    const res = await fetch(`http://localhost:3000/api/products`);
    canapData = await res.json();


    // Si l'id est le même dans canapData et le localStorage sinon appliquer la fonction pour afficher les éléments :


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

            // + calcul du prix total directement à chaque boucle.

            totalPrice += itemInCart[i].quantity * realCanap.price;
            let totalPriceElement = document.getElementById('totalPrice');
            totalPriceElement.textContent = totalPrice;
            console.log(totalPrice)

            displayBasket(canap, realCanap);



        }
        // Calcul prix

    }

}