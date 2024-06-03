let productos = JSON.parse(localStorage.getItem('productos')) || []; /*Obtiene el string almacenado en localStorage bajo la clave 'productos' y lo convierte de nuevo en un objeto JavaScript. Si no hay ningún dato almacenado (es null).  || []: Si productos es null (no hay datos en localStorage), se asigna un array vacío [] a productos.*/ 

$(document).ready(function() { //Asegura que el código dentro de esta función se ejecute solo después de que el documento HTML esté completamente cargado.                           

    $("#registroProductoForm").submit(function(event) {  //Añade un manejador de eventos al formulario con id registroProductoForm que se ejecutará cuando el formulario sea enviado.
        event.preventDefault();  //Previene el comportamiento por defecto del formulario de recargar la página.
        
        let nombre = $("#nombreProducto").val(); //Obtiene el valor del campo de entrada con id nombreProducto.
        if (typeof nombre !== 'string' || nombre.length > 20) {   //Comprueba que el nombre es una cadena y que no excede los 20 caracteres. typeof nombre devuelve una cadena de texto que representa el tipo de la variable 
            alert("El nombre del producto debe ser una cadena de texto no superior a 20 caracteres."); 
            window.location.href = 'indicaciones.html';//Si la validación falla, muestra una alerta y redirige a la página indicaciones.html, deteniendo el envío del formulario.
            return;
        }

        let codigo = $("#codigoProducto").val(); //Obtiene el valor del campo de entrada con el id codigoProducto.
        if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(codigo)) { //Comprueba que el código del producto cumple con los requisitos del proyecto (mínimo una minúscula, una mayúscula, dos números y longitud de al menos 8 caracteres).
            alert("El código del producto debe tener al menos una minúscula, una mayúscula y dos números.");
            window.location.href = 'indicaciones.html';//Si la validación falla, muestra una alerta y redirige a la página indicaciones.html, deteniendo el envío del formulario.
            return;
        }

        let producto = {   // Crea un objeto producto con los valores de los campos del formulario.
            nombre: $("#nombreProducto").val(),
            categoria: $("#categorias").val(),
            imagen: $("#imagenProducto").val(),
            codigo: $("#codigoProducto").val(),
            precio: $("#precioProducto").val(),
            marca: $("#marca").val(),
            proveedor: $("#proveedor").val().split('\\').pop()
        };

        productos.push(producto);//Añade el nuevo producto al array productos.
        localStorage.setItem('productos', JSON.stringify(productos));//Guarda el array productos en localStorage,

        alert("Producto registrado con éxito");
        window.location.href = 'producto.html'; //Muestra un mensaje de éxito y redirige a la página producto.html.
    });

 
    if (window.location.pathname.endsWith('producto.html')) { //Solo ejecuta el código dentro del bloque si la página actual es producto.html.
        let paginActual = 1; //inicializa la variable pagina actual en 1
        const ProdcutosPorPagina = 15; // define la cantidad de productos por pagina
        const totalPages = Math.ceil(productos.length / ProdcutosPorPagina);//Calcula el número total de páginas necesarias para mostrar todos los productos.

        function ActualizarBotonesNav() { //.prop se usa para modificar la propiedad disabled 
            $("#paginaAnt").prop('disabled', paginActual === 1);//Esta línea establece el atributo disabled del botón con el ID prevPage dependiendo de si currentPage es igual a 1. Si currentPage es 1, significa que el usuario está en la primera página y el botón para ir a la página se deshabilita.
            $("#nextPage").prop('disabled', paginActual === totalPages || productos.length === 0);   // si la pagina actual es = total paginas entonces el usuario esta en la ultima pagina y el boton siguiente se deshabilita
            $("#paginaAnt").toggleClass("button-disabled", paginActual === 1);    //la propiedad toggleClass modifica la clase button-disabled si se cumple la condicion 
            $("#nextPage").toggleClass("button-disabled", paginActual === totalPages || productos.length === 0);    // si pagina actual es igual a 1, la clase button-disabled se agrega al elemento con el ID nextPage; de lo contrario, se elimina si ya está presente.
            $("#paginaAnt").toggleClass("button-enabled", paginActual !== 1);   //si pagina actual es diferente  a 1, la clase button-disabled se agrega al elemento con el ID pagAnt; de lo contrario, se elimina si ya está presente.
            $("#nextPage").toggleClass("button-enabled", paginActual !== totalPages && productos.length > 0);   //En esta línea, si pagina actual es igual a 1, la clase button-disabled se agrega al elemento con el ID pagAnt; de lo contrario, se elimina si ya está presente.
        }

        function cargarProductos(page) {
            $("#productList").empty();
            for (let i = (page - 1) * ProdcutosPorPagina; i < page * ProdcutosPorPagina && i < productos.length; i++) {//El ciclo for itera sobre los productos que deben mostrarse en la página actual. La variable i se inicializa en (page - 1) * ProductsPerPage para determinar el índice inicial del primer producto en esa página, y la iteración continúa hasta que i alcance (page * ProductsPerPage) o el final de la lista de productos, lo que ocurra primero
                let producto = productos[i];// se accede a cada producto utilizando el índice i y se agregan elementos HTML al contenedor #productList utilizando el método .append(). Estos elementos contienen información sobre cada producto, como su imagen, nombre, categoría, código, precio, marca y proveedor.
                $("#productList").append(`  
                    <div class="product-card" data-index="${i}">
                        <img class="imgProductos" src="${producto.imagen}" alt="${producto.nombre}">
                        <p class="detallesProductos">Nombre: ${producto.nombre}</p>
                        <p class="detallesProductos">Categoría: ${producto.categoria}</p>
                        <p class="detallesProductos">Código: ${producto.codigo} </p>
                        <p class="pesos">Precio: $${producto.precio}</p>
                        <p class="detallesProductos">Marca: ${producto.marca}</p>
                        <p class="detallesProductos">Proveedor: ${producto.proveedor}</p>
                    </div>
                `);
            }
            $("#pageIndicator").text(`Página ${page}`);//Esto actualiza el texto del elemento con ID pageIndicator para mostrar el número de página actual.
            ActualizarBotonesNav();
        }

        function BuscarProductos(term) {
            $("#productList").empty();//Esto vacía el contenido del contenedor #productList para que los nuevos resultados de búsqueda se agreguen sin duplicados.
            for (let i = 0; i < productos.length; i++) { // el ciclo for recorre todo el arreglo de productos
                if (productos[i].nombre.toLowerCase().includes(term)) {  //term se usa para buscar coincidencias en los nombres de los productos
                    let producto = productos[i]; //Si un producto coincide con el término de búsqueda, se agrega un bloque HTML que representa el producto al contenedor #productList utilizando el método .append(). Este bloque contiene información sobre el producto, como su imagen, nombre, categoría, código, precio, marca y proveedor.
                    $("#productList").append(`  
                        <div class="product-card" data-index="${i}">
                            <img class="imgProductos" src="${producto.imagen}" alt="${producto.nombre}">
                            <p>Nombre: ${producto.nombre}</p>
                            <p>Categoría: ${producto.categoria}</p>
                            <p>Código: ${producto.codigo}</p>
                            <p class="pesos">Precio: $${producto.precio}</p>
                            <p>Marca: ${producto.marca}</p>
                            <p>Proveedor: ${producto.proveedor}</p>
                        </div>
                    `);
                }
            }
            $("#pageIndicator").text(`Resultados para "${term}"`);//se actualiza el texto del elemento con ID pageIndicator para indicar que se han mostrado resultados .
        }


        $("#productList").on("click", ".product-card", function() {
            $(this).toggleClass("selected"); // hace el evento de seleccionar los productos del array 
        });

        // Eliminar productos seleccionados
        $("#deleteButton").click(function() { 
            $(".product-card.selected").each(function() {  // se seleccionan todos los elementos con la clase .product-card y la clase .selected. solo se considerarán los elementos de la lista de productos que hayan sido seleccionados
                let index = $(this).data("index"); // each(fuction) itera sobre todos los elementos que cumplen con la selección .product-card.selected
                //se obtiene el índice de cada elemento seleccionado. el método data("index") de jQuery, que recupera el valor del atributo data-index del elemento.
                productos.splice(index, 1);  //se utiliza el método splice() para eliminar ese elemento del array productos. splice() elimina el elemento en el índice obtenido.
                localStorage.setItem('productos', JSON.stringify(productos));//se actualiza el almacenamiento local (localStorage) con el nuevo contenido del array
                cargarProductos(paginActual); //muestra los prodcutos actualizados
            });
        });

        $("#nextPage").click(function() { // si la pagina actual es menor al total de paginas, se cumple la condicion y se cargan los productos de la pagina correspondiente 
            if (paginActual < totalPages) {
                paginActual++;
                cargarProductos(paginActual);
            }
        });

        $("#paginaAnt").click(function() { // si la pagina actual es mayor a 1 se cumple la funcion cargarProductos y se cargan los pordcutos de la pagina correspondiente 
            if (paginActual > 1) {
                paginActual--;
                cargarProductos(paginActual);
            }
        });

        $("#searchButton").click(function() { 
            const searchTerm = $("#search").val().toLowerCase();
            if (searchTerm) {
                console.log("ME HAS PRESIONADO"); 
                BuscarProductos(searchTerm);
            } else {
                console.log("ME HAS PRESIONADO"); 
                cargarProductos(paginActual);
            }
        });

        cargarProductos(paginActual);
    }
});