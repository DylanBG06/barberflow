let todoslosServicios = [];
let filtroActivo = 'todos';
let busquedaActual = '';

async function inicializar() {
    const respuesta = await fetch('data/servicios.json')
    const datos = await respuesta.json();
    todoslosServicios = datos.servicios;
    renderizarServicios(todoslosServicios);
    configurarBusqueda();
    
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
        });
        actualizarEstaditicas(lista);
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
    favoritos.textContent = 0;

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



inicializar();