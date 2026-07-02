document.addEventListener('DOMContentLoaded', function () {
    const contenedor = document.getElementById("servicios-destacados-grid");

    let barberos = [];

    async function cargarServicios() {
        const respuesta = await fetch('data/servicios.json');
        const datos = await respuesta.json();

        barberos = datos.barberos;

        const serviciosDestacados = datos.servicios.slice(0, 6);
        
        serviciosDestacados.forEach(function (servicio) {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'servicio-card';

            const nombreBarbero = buscarBarberoPorId(servicio.barberoSugeridoId);

            tarjeta.innerHTML = `
                <div class="servicio-card__image">
                    <img src="${servicio.imagen}" alt="${servicio.nombre}">
                </div>

                <div class="servicio-card__body">
                    <h3 class="servicio-card__nombre">${servicio.nombre}</h3>

                    <p class="servicio-card__meta">
                        👤 ${nombreBarbero} · ⏱ ${servicio.duracion} min
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

            contenedor.appendChild(tarjeta);
        });
    }

    function buscarBarberoPorId(idBarbero) {
        let nombreBarbero = "Sin barbero asignado";

        barberos.forEach(function (barbero) {
            if (barbero.id === idBarbero) {
                nombreBarbero = barbero.nombre;
            }
        });

        return nombreBarbero;
    }

    cargarServicios();
});