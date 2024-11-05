document.getElementById("product-form").addEventListener("submit", function(event) {
    event.preventDefault(); 

    // Captura los valores de los campos
    const productName = document.getElementById("product-name").value;
    const productMarca = document.getElementById("product-marca").value;
    const productDate = document.getElementById("product-date").value;
    const productQuantity = document.getElementById("product-quantity").value;

    if (productName && productQuantity) {
        // Crea un nuevo elemento para el producto
        const productItem = document.createElement("div");
        productItem.textContent = `${productName} - Marca: ${productMarca} - Cantidad: ${productQuantity} - Fecha Vencimiento ${productDate}`;
        
        // Agrega el producto a la lista
        document.getElementById("product-list").appendChild(productItem);

        // Limpia el formulario
        document.getElementById("product-form").reset();
    } else {
        alert("Por favor, ingrese un nombre y cantidad para el producto.");
    }
});
