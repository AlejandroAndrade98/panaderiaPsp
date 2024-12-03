let currentEditIndex = null;  // Variable para almacenar el índice del producto que se está editando

// Cargar productos desde el localStorage al inicio
let productList = JSON.parse(localStorage.getItem('productList')) || [];

// Mostrar productos cuando la página se carga
window.onload = function() {
    displayProducts();
};

// Evento al enviar el formulario para registrar o editar un producto
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById('productName').value,
        brand: document.getElementById('brand').value,
        content: document.getElementById('netContent').value,
        price: document.getElementById('price').value,
        quantity: document.getElementById('quantity').value,
        // Usar la imagen cargada solo si hay una nueva imagen, si no, mantener la imagen actual
        image: document.getElementById('productImage').files[0] ? document.getElementById('productImage').files[0].name : (currentEditIndex !== null ? productList[currentEditIndex].image : "default.jpg"),
        // Mantener la fecha existente si no se edita
        expiryDate: document.getElementById('expiryDate').value || (currentEditIndex !== null ? productList[currentEditIndex].expiryDate : "")
    };

    if (currentEditIndex === null) {
        // Agregar nuevo producto al listado
        productList.push(newProduct);
    } else {
        // Actualizar el producto existente
        productList[currentEditIndex] = newProduct;
        currentEditIndex = null;  // Resetear el índice de edición
    }

    // Guardar el listado de productos en localStorage
    localStorage.setItem('productList', JSON.stringify(productList));

    // Actualizar la vista de productos
    displayProducts();

    // Limpiar el formulario
    document.getElementById('productForm').reset();
});

// Función para mostrar los productos en la vista
function displayProducts() {
    const productListDiv = document.getElementById('productList');
    productListDiv.innerHTML = ''; // Limpiar antes de renderizar

    productList.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="images/${product.image}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p>Marca: ${product.brand}</p>
            <p>Contenido: ${product.content}</p>
            <p>Precio: $${product.price}</p>
            <p>Cantidad: ${product.quantity}</p>
            <p>Fecha de Vencimiento: ${product.expiryDate}</p>
            <button class="edit-btn" onclick="editProduct(${index})">Editar</button>
            <button class="delete-btn" onclick="deleteProduct(${index})">Eliminar</button>
        `;
        productListDiv.appendChild(productCard);
    });
}

// Función para editar un producto
function editProduct(index) {
    const product = productList[index];
    document.getElementById('productName').value = product.name;
    document.getElementById('brand').value = product.brand;
    document.getElementById('netContent').value = product.content;
    document.getElementById('price').value = product.price;
    document.getElementById('quantity').value = product.quantity;
    document.getElementById('expiryDate').value = product.expiryDate || '';  // Si tiene fecha, mostrarla, si no, dejar en blanco
    document.getElementById('productImage').value = '';  // No cambiar la imagen si no se selecciona una nueva

    // Establecer el índice del producto que se está editando
    currentEditIndex = index;
}

// Función para eliminar un producto
function deleteProduct(index) {
    // Confirmar antes de eliminar
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
        productList.splice(index, 1);  // Eliminar el producto de la lista
        localStorage.setItem('productList', JSON.stringify(productList));  // Guardar la lista actualizada en localStorage
        displayProducts();  // Actualizar la vista
    }
}
