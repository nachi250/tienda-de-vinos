//CARGAR PRODUCTOS A LA LISTA DE PRODUCTOS
$.getJSON("js/misProductos.json", (response, status) => {
    if (status === "success") {
        misProductos = response
        for (let producto of misProductos) {
            let div = `
                        <div class="producto">
                            <img class="producto-img" src="${producto.img}" alt="Imagen de vino" width="150">
                            <p class="producto-nombre">${producto.nombre}</p>
                            <p class="producto-precio">$ ${producto.precio}</p>
                            <p class="producto-id">${producto.productoId}</p>
                            <button type="button" class="btn btn-primary">Añadir</button>
                        </div>
                        `
                        $('#contenedorProductos').append(div)

                // EJECUTAR EL CODIGO SI EL SITIO ESTA CARGADO: EJECUTA READY()
                if (document.readyState == 'loading') {
                    document.addEventListener('DOMContentLoaded', ready)
                } else {
                    ready()
                }
            }       
        } else {
            let error = `<div><h1>Error</h1></div>`
            $('#contenedorProductos').append(error)
        }
    }
)

// READY(): CONTIENE LAS VARIABLES DE:
// LOS BOTONES PARA ELIMINAR PRODUCTOS DEL LA LISTA DEL CARRITO
function ready() {
    let botonEliminarProductoDelCarrito = $('.btn-danger');
    for (let i = 0; i < botonEliminarProductoDelCarrito.length; i++) {
        const boton = botonEliminarProductoDelCarrito[i];
        boton.addEventListener('click', eliminarProductoDelCarrito)   
    }
// ESCUCHA SI HAY CAMBIOS EN LOS INPUT DE CANTIDAD
    let itemCantidadInput = $('.item-cantidad-input')
    for (let i = 0; i < itemCantidadInput.length; i++) {
    let cantidad = itemCantidadInput[i];
    cantidad.addEventListener('change', cantidadDeProductos)   
    }
// AGREGA LOS PRODUCTOS A LA LISTA DEL CARRITO
    let botonAñadirProductoAlCarrito = $('.btn-primary')
    for (let i = 0; i < botonAñadirProductoAlCarrito.length; i++) {
        boton = botonAñadirProductoAlCarrito[i];
        boton.addEventListener('click', añadirProductoSeleccionado)
    }
} // ACA TERMINA READY()

// LAS VARIABLES EN READY() LLAMAN LAS SIGUIENTES FUNCIONES
// ELIMINAR PRODUCTOS DE LA LISTA DEL CARRITO
function eliminarProductoDelCarrito(event) {
    let botonCliqueado = event.target
            botonCliqueado.parentElement.parentElement.remove()
            actualizarTotalDelCarrito() // ACTUALIZA EL TOTAL DE LA COMPRA $$
}
// MANTIENE EL INPUT DE CANTIDAD EN 1 ó > 1
function cantidadDeProductos(event) {
    let input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    actualizarTotalDelCarrito() // ACTUALIZA EL TOTAL DE LA COMPRA $$
}

// GENERA LA FUNCION CON LOS PARAMETROS NECESARIOS PARA CREAR LOS ITEM DEL CARRITO
function añadirProductoSeleccionado(event) {
    let boton = event.target
    let itemProducto = boton.parentElement
    let nombre = itemProducto.getElementsByClassName('producto-nombre')[0].innerText
    let precio = itemProducto.getElementsByClassName('producto-precio')[0].innerText
    let id = itemProducto.getElementsByClassName('producto-id')[0].innerText
    let img = itemProducto.getElementsByClassName('producto-img')[0].src
        console.warn('Se añadio '+nombre+' al carrito, valor: '+precio)
   cargarProductoAlCarrito(nombre, precio, img, id)
   actualizarTotalDelCarrito()
}

// CREA EL HTML QUE CONTIENE EL PRODUCTO ELEGIDO Y VERIFICA SI YA SE AÑADIO PREVIAMENTE
function cargarProductoAlCarrito(nombre, precio, img, id) {
    let fila = document.createElement('tr')
    fila.classList.add('item-carrito')
    let tablaCarrito = document.getElementsByClassName('tabla-carrito')[0]
    let itemCarritoNombre = document.getElementsByClassName('item-carrito-nombre')
    for (let i = 0; i < itemCarritoNombre.length; i++) {
        if (itemCarritoNombre[i].innerText == nombre) {
            alert('Este producto ya se encuentra en el carrito')
            return
        }
    }
    let itemFila = `
        <td class="align-middle"><img class="" src="${img}" alt="" width="50"><p class="item-carrito-nombre">${nombre}</p></td>
        <td class="align-middle item-carrito-precio">${precio}</td>
        <td class="align-middle"><input class="cart-quantity-input item-cantidad-input" type="number" value="1">
        <button type="button" class="btn btn-danger" onclick="eliminarLS(${id})">Quitar</button></td>
        `
        fila.innerHTML = itemFila
    tablaCarrito.append(fila)
    // ASIGNA A LOS NUEVOS ELEMENTOS CREADOS, LOS EVENTOS
    fila.getElementsByClassName('btn-danger')[0].addEventListener('click', eliminarProductoDelCarrito)
    fila.getElementsByClassName('item-cantidad-input')[0].addEventListener('change', cantidadDeProductos)
    // AÑADE EL PRODUCTO SELECCIONADO DEL CARRITO[] AL LOCALSTORAGE
    let r = misProductos.find(p => p.productoId == id)
        carrito.push(r)
        console.log(r)
        guardoCarrito()
}

// ACTUALIZA EL TOTAL DE LA COMPRA $$     
function actualizarTotalDelCarrito() {
    let tablaCarrito = document.getElementsByClassName('tabla-carrito')[0]
    let itemsCarrito = document.getElementsByClassName('item-carrito')
    let c = document.getElementById('leyendaProductosCarrito')
    let total = 0 // TOTAL $$
    let y = 0 // NOTIFICACIÓN DE CANTIDAD DE PRODUCTOS EN EL CARRITO
    for (let i = 0; i < itemsCarrito.length; i++) {
         let itemCarrito = itemsCarrito[i];
         let itemCarritoPrecio = itemCarrito.getElementsByClassName('item-carrito-precio')[0]
         let itemCantidadInput = itemCarrito.getElementsByClassName('item-cantidad-input')[0]
         let precio = parseFloat(itemCarritoPrecio.innerText.replace('$', ''))
         let cantidad = itemCantidadInput.value
         total = total + (precio * cantidad)
         let n = parseInt(itemCantidadInput.value)
         y = y += n
         console.log(y)
    }
    document.getElementsByClassName('carrito-total')[0].innerText = '$ '+total+',00' // MUESTRA EL TOTAL $$
    c.innerHTML = y // NOTIFICACIÓN CANTIDAD DE PRODUCTOS EN EL CARRITO
    let position = document.getElementById('position')
    if (y > 0) {
        position.classList.add('position')   
        } else {
            position.classList.remove ('position')
        }
}

// CREO AL ARRAY CARRITO PARA LUEGO GUARDARLO EN LOCALSTORAGE
let carrito = []
// GUARDO EL CARRITO EN LOCALSTORAGE
const guardoCarrito = () => { 
        localStorage.carrito = JSON.stringify(carrito)
}
// BORRO LOS PRODUCTOS DEL ARRAY CARRITO [] Y LUEGO ACTUALIZO EL LOCAL STORAGE
function eliminarLS(id) { 
    let p = carrito.findIndex(p => p.productoId == id)
    carrito.splice(p, 1)
    console.warn('¡Se eliminó el producto')
    guardoCarrito()
}

// FINALIZA LA COMPRA SE RECARGA LA PAGINA
function finalizarCompra() {
    alert("Muchas gracias por su compra!") 
    setTimeout(() => {
        document.location.reload()
        carrito = []
        guardoCarrito()
    }, 1000);
}
// BOTON SEGUIR COMPRANDO => ANIMADO
$('.btn-secondary').click( function(e) { 
    e.preventDefault();
    //Animamos sus propiedades CSS con animate
    $('html, body').animate({
        scrollTop: $("#contenedorProductos").offset().top  
    }, 500);
} );



 












    















