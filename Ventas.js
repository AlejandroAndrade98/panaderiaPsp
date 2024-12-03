document.addEventListener('DOMContentLoaded', function () {
    const productos = JSON.parse(localStorage.getItem('productList')) || [];
    const selectProducto = document.getElementById('producto');
    const carritoTabla = document.getElementById('tablaCarrito').querySelector('tbody');
    const dineroRecibidoInput = document.getElementById('dineroRecibido');
    const cambioInput = document.getElementById('cambio');
    let carrito = [];

    // Cargar los productos al dropdown del formulario
    if (productos.length === 0) {
        alert('No hay productos disponibles.');
    } else {
        productos.forEach((producto, index) => {
            if (producto.quantity > 0) {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${producto.name} ${producto.content ? `- ${producto.content}` : ''} - $${producto.price} (${producto.quantity} disponibles)`;
                selectProducto.appendChild(option);
            }
        });
    }

    // Agregar producto al carrito
    document.getElementById('agregarCarrito').addEventListener('click', function () {
        const indexProducto = parseInt(selectProducto.value);
        const cantidad = parseInt(document.getElementById('cantidad').value);

        if (!isNaN(indexProducto) && cantidad > 0) {
            const productoSeleccionado = productos[indexProducto];
            if (cantidad <= productoSeleccionado.quantity) {
                const total = productoSeleccionado.price * cantidad;
                carrito.push({
                    nombre: productoSeleccionado.name,
                    cantidad: cantidad,
                    precio: productoSeleccionado.price,
                    total: total,
                    imagen: productoSeleccionado.image,
                    index: indexProducto,
                    content: productoSeleccionado.content || 'Contenido desconocido' // Usamos 'content' aquí
                });

                actualizarTablaCarrito();
                actualizarTotal();
            } else {
                alert(`Cantidad no disponible. Solo hay ${productoSeleccionado.quantity} disponibles.`);
            }
        } else {
            alert('Seleccione un producto y una cantidad válida.');
        }
    });

    // Actualizar tabla del carrito
    function actualizarTablaCarrito() {
        carritoTabla.innerHTML = '';
        carrito.forEach((item, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><img src="images/${item.imagen}" alt="${item.nombre}" class="img-carrito"></td>
                <td>${item.nombre} ${item.content ? `- ${item.content}` : ''} - $${item.precio} (${item.cantidad} disponibles)</td> <!-- Cambié el orden aquí -->
                <td>${item.cantidad}</td>
                <td>$${item.precio}</td>
                <td>$${item.total}</td>
                <td><button onclick="eliminarDelCarrito(${index})">Eliminar</button></td>
            `;
            carritoTabla.appendChild(fila);
        });
    }

    // Eliminar un producto del carrito
    window.eliminarDelCarrito = function (index) {
        carrito.splice(index, 1);
        actualizarTablaCarrito();
        actualizarTotal();
    };

    // Calcular y mostrar el total
    function actualizarTotal() {
        const total = carrito.reduce((acc, item) => acc + item.total, 0);
        document.getElementById('totalCompra').textContent = `$${total}`;
    }

    // Calcular el cambio
    dineroRecibidoInput.addEventListener('input', function () {
        const total = carrito.reduce((acc, item) => acc + item.total, 0);
        const dineroRecibido = parseInt(dineroRecibidoInput.value);
        if (!isNaN(dineroRecibido)) {
            cambioInput.value = `$${dineroRecibido - total}`;
        } else {
            cambioInput.value = '';
        }
    });

    // Finalizar la compra
    document.getElementById('finalizarCompra').addEventListener('click', function () {
        const total = carrito.reduce((acc, item) => acc + item.total, 0);
        const dineroRecibido = parseInt(dineroRecibidoInput.value);
        const nombreCliente = document.getElementById('nombreCliente').value;
        const cedulaCliente = document.getElementById('cedulaCliente').value;
        const correoCliente = document.getElementById('correoCliente').value;

        if (!nombreCliente || !cedulaCliente || !correoCliente || isNaN(dineroRecibido) || dineroRecibido < total) {
            alert('Verifique los datos del cliente y el dinero recibido.');
            return;
        }

        // Guardar la venta en localStorage
        const venta = {
            fecha: new Date().toLocaleString(),
            cliente: {
                nombre: nombreCliente,
                cedula: cedulaCliente,
                correo: correoCliente
            },
            productos: carrito,
            total: total
        };
        const ventasRealizadas = JSON.parse(localStorage.getItem('ventasRealizadas')) || [];
        ventasRealizadas.push(venta);
        localStorage.setItem('ventasRealizadas', JSON.stringify(ventasRealizadas));

        // Actualizar el inventario de productos
        carrito.forEach((item) => {
            productos[item.index].quantity -= item.cantidad;
        });

        localStorage.setItem('productList', JSON.stringify(productos));
        alert(`Compra finalizada. Cambio: $${dineroRecibido - total}`);

        // Reiniciar formulario y carrito
        carrito = [];
        actualizarTablaCarrito();
        actualizarTotal();
        
        // Limpiar formulario de productos
        document.getElementById('ventaForm').reset();  // Limpiar campos del formulario de productos

        // Limpiar formulario de cliente
        document.getElementById('nombreCliente').value = '';  // Limpiar el nombre del cliente
        document.getElementById('cedulaCliente').value = '';  // Limpiar la cédula del cliente
        document.getElementById('correoCliente').value = '';  // Limpiar el correo del cliente
        document.getElementById('dineroRecibido').value = '';  // Limpiar el dinero recibido
        document.getElementById('cambio').value = '';  // Limpiar el campo de cambio
    });
});
