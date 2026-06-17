let todoslosServicios = [];
let filtroActivo = 'todos';
let busquedaActual = '';

async function inicializar() {
    const respuesta = await fetch('data/servicios.json')
    const datos = await respuesta.json();
    todoslosServicios = datos.servicios;
    renderizarServicios(todoslosServicios);
    configurarBusqueda();
    configurarFiltros();
    cargarProductos(datos.productos);
}

const grid = document.getElementById("servicios-grid");

function renderizarServicios(lista){
    grid.innerHTML = '';

    lista.forEach(function(servicio) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'servicio-card';
        
        tarjeta.innerHTML = `
                <div class="servicio-card__image">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}">
                </div>
                <div class="servicio-card__body">
                    <h3 class="servicio-card__nombre">${servicio.nombre}</h3>
                    <button class="favorito-btn" data-id="${servicio.id}">♡</button>
                    <p class="servicio-card__meta">
                        👤 ${servicio.barbero} · ⏱ ${servicio.duracion} min
                    </p>
                    <div class="servicio-card__footer">
                        <span class="servicio-card__precio">
                            ₡${servicio.precio.toLocaleString('es-CR')}
                        </span>
                        <span class="${servicio.estado === 'disponible' ? 'estado-disponible' : 'estado-no-disponible'}">
                            ${servicio.estado}
                        </span>
                    </div>
                </div>
            `;
            grid.appendChild(tarjeta);
            
            const btnFav = tarjeta.querySelector('.favorito-btn');
            const favoritos = cargarFavoritos();

            if(favoritos.includes(servicio.id)){
                btnFav.textContent = '♥'
                btnFav.classList.add('favorito-activo');
            }

            btnFav.addEventListener('click', function(){
                toggleFavorito(servicio.id);

                const favoritosActualizados = cargarFavoritos();

                if(favoritosActualizados.includes(servicio.id)){
                    this.textContent = '♥';
                    this.classList.add('favorito-activo');
                }else{
                    this.textContent = '♡'
                    this.classList.remove('favorito-activo');
                }

                actualizarEstaditicas(lista);

            })

        });
        actualizarEstaditicas(lista);
} 

function cargarFavoritos(){
    return JSON.parse(localStorage.getItem('favoritos') || '[]');
}

function toggleFavorito(id){
    const favoritos = cargarFavoritos();
    const indice = favoritos.indexOf(id)

    if(indice === -1){
        favoritos.push(id);
    }
    else{
        favoritos.splice(indice, 1);
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));

}

function actualizarEstaditicas(lista){
    const total = lista.length;

    const suma = lista.reduce(function(acumulador, servicio){
        return acumulador + servicio.precio;
    } , 0);

    const serviciosTotales = document.getElementById("stat-total");
    const favoritos = document.getElementById("stat-favoritos");
    const promedio = document.getElementById("stat-promedio")
    
    const promedioCalculado = suma / total;
    promedio.textContent = '₡' + Math.round(promedioCalculado).toLocaleString('es-CR');
    serviciosTotales.textContent = total;
    favoritos.textContent = cargarFavoritos().length;

}

function configurarBusqueda(){
    const inputBusqueda = document.getElementById("campo-busqueda")

    inputBusqueda.addEventListener('input', function(){
        busquedaActual = this.value.toLowerCase().trim();

        const resultado = todoslosServicios.filter(function(servicio){
            return servicio.nombre.toLowerCase().includes(busquedaActual);
        })
        renderizarServicios(resultado)
    })
}

function configurarFiltros(){
    const botones = document.querySelectorAll('.filtro-btn');

    botones.forEach(function(boton) {
        boton.addEventListener('click', function (){
            botones.forEach(function(b) {
                b.classList.remove('filtro-btn--activo');
            });

            this.classList.add('filtro-btn--activo');

            filtroActivo = this.dataset.categoria;

            if (filtroActivo === 'todos') {
                renderizarServicios(todoslosServicios);
            } else {
                const resultado = todoslosServicios.filter(function(servicio) {
                    return servicio.categoria === filtroActivo;
            });
                renderizarServicios(resultado);
            }

        })
    });
}

function cargarProductos(lista){
    const gridProductos = document.getElementById("productos-grid");

    lista.forEach(function(producto) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-card';

        tarjeta.innerHTML = `
    <div class="producto-card__imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="producto-card__body">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <span class="producto-card__precio">
            ₡${producto.precio.toLocaleString('es-CR')}
        </span>
    </div>
    `;
    gridProductos.appendChild(tarjeta);
    });
}



inicializar();