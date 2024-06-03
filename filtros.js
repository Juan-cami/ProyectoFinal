$(document).ready(function() { // Esto asegura que el código dentro de esta se ejecute cuando el DOM (Document Object Model) esté completamente cargado.
    $("#searchForm").submit(function(event) {
        event.preventDefault();// Esto agrega un controlador de eventos para el evento de envío del formulario con el id searchForm. Cuando se envía el formulario, se ejecuta la función anónima.
        //event.preventDefault evite que la pagina se recargue al enviar el formulario

        $("#productList").html('<p>Cargando...</p>');

        obtenerDatos()// esta funcion devuelve una promesa donde se muestran los datos despues de 2 segundos
            .then(function(productos) {//Cuando la promesa se resuelve con éxito, esta función se ejecuta y toma los productos obtenidos como argumento.
                let nombre = $("#nombre").val().toLowerCase();
                let precio = parseFloat($("#precio").val());
                let categoria = $("#categoria").val().toLowerCase();

                // Filtrar productos basados en los criterios de búsqueda
                let resultados = productos.filter(function(producto) { //Aquí se filtran los productos basados en la búsqueda . Se comprueba si el nombre, el precio y la categoría de cada producto coinciden con los criterios de búsqueda.
                    return (!nombre || producto.nombre.toLowerCase().includes(nombre)) &&
                    //Aquí se verifica si el nombre del producto coincide con el término de búsqueda nombre. Si nombre es una cadena vacía o null, o si el nombre del producto contiene el término de búsqueda (ignorando las diferencias de mayúsculas y minúsculas), entonces el producto pasa el filtro.
                           (!isNaN(precio) ? parseFloat(producto.precio) <= precio : true) &&
                    //Aqui se filtra los productos por precio. Si precio no es un número o no se digita, o si el precio del producto es menor o igual al precio especificado, entonces el producto pasa el filtro.
                           (!categoria || producto.categoria.toLowerCase().includes(categoria));
                    //Esaqui se verifica si la categoría del producto coincide con el término de búsqueda categoria. Si categoria es una cadena vacía o null, o si la categoría del producto contiene el término de búsqueda , entonces el producto pasa el filtro.
                });

                // muestra los  resultados de búsqueda con paginación
                mostrarResultados(resultados);


                // muestra los controles de paginación solo si hay resultados
                if (resultados.length > 0) {
                    $("#paginacion").show();
                } else {
                    $("#paginacion").hide();
                }
            })
            .catch(function(error) {
                console.error('Error al obtener los datos:', error);
                $("#productList").html('<p>Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.</p>');
            });
    });

    $("#Refrescar").click(function(){ {

        document.getElementById("inputNombre").value = "";
        document.getElementById("inputCategoria").value = "";
        document.getElementById("inputPrecio").value = "";
      }});

    
    function obtenerDatos() {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {

                resolve(productos);
            }, 2000);
        });
    }

    function mostrarResultados(resultados) {
        const productosPorPagina = 10;
        let currentPage = 1;

        function mostrarPagina(page) {
            let startIndex = (page - 1) * productosPorPagina;
            let endIndex = startIndex + productosPorPagina;
            let paginaResultados = resultados.slice(startIndex, endIndex);

            let resultadoHTML = '';

            if (paginaResultados.length === 0) {
                resultadoHTML = '<p>No se encontraron resultados.</p>';
            } else {
                resultadoHTML = '<h2>Resultados de la búsqueda:</h2>';
                paginaResultados.forEach(function(producto) {
                    resultadoHTML += ` <br>
                        <div class="product-card">
                            <img class="imgProductos" src="${producto.imagen}" alt="${producto.nombre}">
                            <p class="detallesProductos">Nombre: ${producto.nombre}</p>
                            <p class="detallesProductos">Categoría: ${producto.categoria}</p>
                            <p class="detallesProductos">Código: ${producto.codigo}</p>
                            <p class="pesos">Precio: $${producto.precio}</p>
                            <p class="detallesProductos">Marca: ${producto.marca}</p>
                            <p class="detallesProductos">Proveedor: ${producto.proveedor}</p>
                        </div>
                    `;
                });
            }

            $("#productList").html(resultadoHTML);
        }

        // Manejar la paginación
        $("#prevPage").click(function() {
            if (currentPage > 1) {
                currentPage--;
                mostrarPagina(currentPage);
            }
        });

        $("#nextPage").click(function() {
            if (currentPage < Math.ceil(resultados.length / productosPorPagina)) {
                currentPage++;
                mostrarPagina(currentPage);
            }
        });

        // Mostrar la primera página por defecto
        mostrarPagina(currentPage);
    }
});

function limpiarCampos() {
    document.getElementById("nombre").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("categoria").value = "";
}