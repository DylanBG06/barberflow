
// Variables globales para agarrar las colecciones del JSON

let servicios = [];
let barberos = [];
let horas = [];
let serviciosSeleccionados = [];

//Agarrar elementos del DOM

const selectServicio = document.getElementById("select-servicio");
const btnAgregarServicio = document.getElementById("btn-agregar-servicio");
const contenedorServiciosCita = document.getElementById("servicios-cita");

// Formulario de datos de la cita
const formCita = document.getElementById("form-cita");
const inputNombre = document.getElementById("nombre");
const inputTelefono = document.getElementById("telefono");
const inputCorreo = document.getElementById("correo");
const selectBarbero = document.getElementById("barbero");
const inputFecha = document.getElementById("fecha");
const selectHora = document.getElementById("hora");

const mensajeFormulario = document.getElementById("mensaje-formulario");
const btnLimpiar = document.getElementById("btn-limpiar");

// errores del formulario

const errorNombre = document.getElementById("error-nombre");
const errorTelefono = document.getElementById("error-telefono");
const errorCorreo = document.getElementById("error-correo");
const errorServicio = document.getElementById("error-servicio");
const errorBarbero = document.getElementById("error-barbero");
const errorFecha = document.getElementById("error-fecha");
const errorHora = document.getElementById("error-hora");


//Variables del resumen

const resumenServicio = document.getElementById("resumen-servicio");
const resumenBarbero = document.getElementById("resumen-barbero");
const resumenFecha = document.getElementById("resumen-fecha");
const resumenHora = document.getElementById("resumen-hora");
const resumenTotal = document.getElementById("resumen-total");

//Lista de citas registradas

const listaCitas = document.getElementById("lista-citas");



// Funcion para cargar el JSON

async function cargarDatosJSON() {

    try {

        const respuesta = await fetch("data/servicios.json");
        const datos = await respuesta.json();

        servicios = datos.servicios;
        barberos = datos.barberos;
        horas = datos.horas;

    } catch (error) {

        console.error("Error al cargar los datos del JSON", error);

    }

}

// Funciones auxiliares para buscar datos dentro de los arreglos

function buscarServicioPorId(idServicio) {
    let servicioEncontrado = null;

    servicios.forEach(function (servicio) {
        if (servicio.id === idServicio) {
            servicioEncontrado = servicio;
        }
    });

    return servicioEncontrado;
}

function obtenerNombreServicio(idServicio) {
    let nombreServicio = "Servicio no encontrado";

    servicios.forEach(function (servicio) {
        if (servicio.id === idServicio) {
            nombreServicio = servicio.nombre;
        }
    });

    return nombreServicio;
}

function obtenerNombreBarbero(idBarbero) {
    let nombreBarbero = "Barbero no encontrado";

    barberos.forEach(function (barbero) {
        if (barbero.id === idBarbero) {
            nombreBarbero = barbero.nombre;
        }
    });

    return nombreBarbero;
}






// FUNCIONES DE LOCALSTORAGE


function cargarCitasGuardadas() {
    return JSON.parse(localStorage.getItem("citas") || "[]");
}



function guardarServiciosSeleccionados() {
    const idsServicios = [];

    serviciosSeleccionados.forEach(function (servicio) {
        idsServicios.push(servicio.id);
    });

    localStorage.setItem("serviciosSeleccionados", JSON.stringify(idsServicios));
}



function cargarServiciosSeleccionados() {
    const idsServicios = JSON.parse(localStorage.getItem("serviciosSeleccionados") || "[]");

    serviciosSeleccionados = servicios.filter(function (servicio) {
        return idsServicios.includes(servicio.id);
    });
}


function guardarCita(cita) {
    const citas = JSON.parse(localStorage.getItem("citas") || "[]");

    citas.push(cita);

    localStorage.setItem("citas", JSON.stringify(citas));
}



function eliminarCita(idCita) {
    let citas = cargarCitasGuardadas();

    citas = citas.filter(function (cita) {
        return cita.id !== idCita;
    });

    localStorage.setItem("citas", JSON.stringify(citas));

    mostrarCitasRegistradas();
    cargarHoras();
}



function actualizarEstadoCita(idCita, nuevoEstado) {
    const citas = cargarCitasGuardadas();

    citas.forEach(function (cita) {
        if (cita.id === idCita) {
            cita.estado = nuevoEstado;
        }
    });

    localStorage.setItem("citas", JSON.stringify(citas));

    mostrarCitasRegistradas();
}





// Funciones para agregar, quitar y mostrar servicios en la cita

function cargarServiciosEnSelect() {
    selectServicio.innerHTML = '<option value="">Seleccione un servicio</option>';

    servicios.forEach(function (servicio) {
        const yaAgregado = serviciosSeleccionados.some(function (servicioSeleccionado) {
            return servicioSeleccionado.id === servicio.id;
        });

        if (servicio.estado === "disponible" && !yaAgregado) {
            const opcion = document.createElement("option");

            opcion.value = servicio.id;
            opcion.textContent = servicio.nombre + " - ₡" + servicio.precio.toLocaleString("es-CR");

            selectServicio.appendChild(opcion);
        }
    });
}


//Funcion para agregar servicio a la cita desde el formulario

function agregarServicioDesdeFormulario() {
    const idServicio = Number(selectServicio.value);

    if (idServicio === 0) {
        errorServicio.textContent = "Debe seleccionar un servicio.";
        return;
    }

    const servicio = buscarServicioPorId(idServicio);

    if (servicio === null) {
        errorServicio.textContent = "El servicio seleccionado no existe.";
        return;
    }

    serviciosSeleccionados.push(servicio);
    guardarServiciosSeleccionados();

    errorServicio.textContent = "";
    selectServicio.value = "";

    renderizarServiciosAgregados();
    mostrarServiciosSeleccionados();
    cargarServiciosEnSelect();
}




function quitarServicioDeCita(idServicio) {
    serviciosSeleccionados = serviciosSeleccionados.filter(function (servicio) {
        return servicio.id !== idServicio;
    });

    guardarServiciosSeleccionados();

    renderizarServiciosAgregados();
    mostrarServiciosSeleccionados();
    cargarServiciosEnSelect();
}



function renderizarServiciosAgregados() {
    contenedorServiciosCita.innerHTML = "";

    if (serviciosSeleccionados.length === 0) {
        contenedorServiciosCita.innerHTML = '<p class="estado-vacio">No hay servicios agregados.</p>';
        return;
    }

    serviciosSeleccionados.forEach(function (servicio) {
        const item = document.createElement("div");
        item.className = "servicio-agregado-item";

        item.innerHTML = `
            <div class="servicio-agregado-info">
                <strong>${servicio.nombre}</strong>
                <span>₡${servicio.precio.toLocaleString("es-CR")}</span>
            </div>

            <button type="button" class="btn-quitar-servicio">
                Quitar
            </button>
        `;

        const btnQuitar = item.querySelector(".btn-quitar-servicio");

        btnQuitar.addEventListener("click", function () {
            quitarServicioDeCita(servicio.id);
        });

        contenedorServiciosCita.appendChild(item);
    });
}


function mostrarServiciosSeleccionados() {
    if (serviciosSeleccionados.length === 0) {
        resumenServicio.innerHTML = "<p>No seleccionado</p>";
        resumenTotal.textContent = "₡0";
        return;
    }

    let htmlServicios = "";
    let total = 0;

    serviciosSeleccionados.forEach(function (servicio) {
        htmlServicios += `
            <div class="resumen-servicio-linea">
                <span>${servicio.nombre}</span>
                <strong>₡${servicio.precio.toLocaleString("es-CR")}</strong>
            </div>
        `;

        total += servicio.precio;
    });

    resumenServicio.innerHTML = htmlServicios;
    resumenTotal.textContent = "₡" + total.toLocaleString("es-CR");
}



function obtenerIdsServiciosSeleccionados() {
    const idsServicios = [];

    serviciosSeleccionados.forEach(function (servicio) {
        idsServicios.push(servicio.id);
    });

    return idsServicios;
}


function calcularTotalServicios() {
    let total = 0;

    serviciosSeleccionados.forEach(function (servicio) {
        total += servicio.precio;
    });

    return total;
}

// Funciones para barberos, validar disponibilidad y horas

function cargarBarberos() {
    selectBarbero.innerHTML = '<option value="">Seleccione un barbero</option>';

    barberos.forEach(function (barbero) {
        if (barbero.estado === "disponible") {
            const opcion = document.createElement("option");

            opcion.value = barbero.id;
            opcion.textContent = barbero.nombre;

            selectBarbero.appendChild(opcion);
        }
    });
}

function cargarHoras() {
    selectHora.innerHTML = '<option value="">Seleccione una hora</option>';

    const barberoId = Number(selectBarbero.value);
    const fecha = inputFecha.value;

    let horasOcupadas = [];

    if (barberoId !== 0 && fecha !== "") {
        horasOcupadas = obtenerHorasOcupadas(barberoId, fecha);
    }

    horas.forEach(function (hora) {
        const option = document.createElement("option");

        option.value = hora;
        option.textContent = hora;

        if (horasOcupadas.includes(hora)) {
            option.disabled = true;
            option.textContent = hora + " - Ocupada";
        }

        selectHora.appendChild(option);
    });
}

function obtenerHorasOcupadas(barberoId, fecha) {
    const citas = cargarCitasGuardadas();
    const horasOcupadas = [];

    citas.forEach(function (cita) {
        if (cita.barberoId === barberoId && cita.fecha === fecha) {
            horasOcupadas.push(cita.hora);
        }
    });

    return horasOcupadas;
}

function existeCitaMismaHora() {
    const citas = cargarCitasGuardadas();

    const barberoId = Number(selectBarbero.value);
    const fecha = inputFecha.value;
    const hora = selectHora.value;

    let existe = false;

    citas.forEach(function (cita) {
        if (
            cita.barberoId === barberoId &&
            cita.fecha === fecha &&
            cita.hora === hora
        ) {
            existe = true;
        }
    });

    return existe;
}

function validarDisponibilidadCita() {
    if (existeCitaMismaHora()) {
        mostrarError(selectHora, errorHora, "Ese barbero ya tiene una cita registrada en esa fecha y hora.");
        return false;
    }

    mostrarExito(selectHora, errorHora);
    return true;
}

// Funciones para manejar las citas registradas y crear las tarjetas de citas

function crearObjetoCita() {
    const cita = {
        id: Date.now(),
        nombre: inputNombre.value.trim(),
        telefono: inputTelefono.value.trim(),
        correo: inputCorreo.value.trim(),
        servicios: obtenerIdsServiciosSeleccionados(),
        barberoId: Number(selectBarbero.value),
        fecha: inputFecha.value,
        hora: selectHora.value,
        total: calcularTotalServicios(),
        estado: "pendiente"
    };

    return cita;
}

function mostrarCitasRegistradas() {
    const citas = cargarCitasGuardadas();

    listaCitas.innerHTML = "";

    if (citas.length === 0) {
        listaCitas.innerHTML = '<p class="estado-vacio">No hay citas registradas.</p>';
        return;
    }

    citas.forEach(function (cita) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "cita-card";

        let nombresServicios = "";

        cita.servicios.forEach(function (idServicio) {
            nombresServicios += obtenerNombreServicio(idServicio) + ", ";
        });

        nombresServicios = nombresServicios.slice(0, -2);

        tarjeta.innerHTML = `
    <div class="cita-card__encabezado">
    <div>
        <h3>${cita.nombre}</h3>
        <p>${cita.fecha} · ${cita.hora}</p>
    </div>

    <div class="cita-card__resumen">
        <strong>₡${cita.total.toLocaleString("es-CR")}</strong>
        <span class="estado-cita estado-cita--${cita.estado}">
            ${cita.estado}
        </span>
    </div>
</div>

    <div class="cita-card__detalle">
        <p><strong>Teléfono:</strong> ${cita.telefono}</p>
        <p><strong>Correo:</strong> ${cita.correo}</p>
        <p><strong>Servicios:</strong> ${nombresServicios}</p>
        <p><strong>Barbero:</strong> ${obtenerNombreBarbero(cita.barberoId)}</p>
        <p><strong>Fecha:</strong> ${cita.fecha}</p>
        <p><strong>Hora:</strong> ${cita.hora}</p>
        <p class="detalle-total"><strong>Total:</strong> ₡${cita.total.toLocaleString("es-CR")}</p>
        <div class="cita-estado-control">
    <label>Estado:</label>

    <select class="select-estado-cita">
    <option value="pendiente" ${cita.estado === "pendiente" ? "selected" : ""}>Pendiente</option>
    <option value="terminado" ${cita.estado === "terminado" ? "selected" : ""}>Terminado</option>
    <option value="cancelada" ${cita.estado === "cancelada" ? "selected" : ""}>Cancelada</option>
</select>
</div>

        <button type="button" class="btn-eliminar-cita">
            Eliminar cita
        </button>
    </div>
`;

        tarjeta.addEventListener("click", function () {
            tarjeta.classList.toggle("cita-card--abierta");
        });
        const btnEliminar = tarjeta.querySelector(".btn-eliminar-cita");

        btnEliminar.addEventListener("click", function (event) {
            event.stopPropagation();

            const confirmar = confirm("¿Desea eliminar esta cita?");

            if (confirmar) {
                eliminarCita(cita.id);
            }
        });

        const selectEstado = tarjeta.querySelector(".select-estado-cita");

        selectEstado.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        selectEstado.addEventListener("change", function (event) {
            event.stopPropagation();

            actualizarEstadoCita(cita.id, selectEstado.value);
        });

        listaCitas.appendChild(tarjeta);
    });
}





// Funcion para el resumen de la cita



function actualizarResumenCita() {
    if (selectBarbero.value === "") {
        resumenBarbero.textContent = "No seleccionado";
    } else {
        resumenBarbero.textContent = selectBarbero.options[selectBarbero.selectedIndex].textContent;
    }

    if (inputFecha.value === "") {
        resumenFecha.textContent = "No seleccionada";
    } else {
        resumenFecha.textContent = inputFecha.value;
    }

    if (selectHora.value === "") {
        resumenHora.textContent = "No seleccionada";
    } else {
        resumenHora.textContent = selectHora.value;
    }
}








//Funciones para mostrar error o exito y limpiar errores

function mostrarError(input, elementoError, mensaje) {

    elementoError.textContent = mensaje;

    input.classList.remove("input-success");
    input.classList.add("input-error");


}

function mostrarExito(input, elementoError) {

    elementoError.textContent = "";

    input.classList.remove("input-error");
    input.classList.add("input-success");


}


//Funcion para limpiar los mensajes de error
function limpiarErrores() {

    errorNombre.textContent = "";
    errorTelefono.textContent = "";
    errorCorreo.textContent = "";
    errorServicio.textContent = "";
    errorBarbero.textContent = "";
    errorFecha.textContent = "";
    errorHora.textContent = "";
    mensajeFormulario.textContent = "";

}

function limpiarClasesValidacion() {
    inputNombre.classList.remove("input-error", "input-success");
    inputTelefono.classList.remove("input-error", "input-success");
    inputCorreo.classList.remove("input-error", "input-success");
    selectBarbero.classList.remove("input-error", "input-success");
    inputFecha.classList.remove("input-error", "input-success");
    selectHora.classList.remove("input-error", "input-success");
}





//Funciones para validar campos del formulario

//Nombre
function validarNombre() {

    const nombre = inputNombre.value.trim();

    if (nombre === "") {
        mostrarError(inputNombre, errorNombre, "El nombre es obligatorio.")

        return false;
    }

    if (nombre.length < 3) {
        mostrarError(inputNombre, errorNombre, "El nombre debe contener 3 caracteres o más.")
        return false;
    }

    mostrarExito(inputNombre, errorNombre)
    return true;
}

// validar correo
function validarCorreo() {

    const correo = inputCorreo.value.trim();

    if (correo === "") {
        mostrarError(inputCorreo, errorCorreo, "El correo es obligatorio.")
        return false;
    }

    if (!correo.includes("@") || !correo.includes(".")) {

        mostrarError(inputCorreo, errorCorreo, "El correo no es válido.");

        return false;
    }

    mostrarExito(inputCorreo, errorCorreo);
    return true;
}

// Validar telefono
function validarTelefono() {

    const telefono = inputTelefono.value.trim();

    if (telefono === "") {
        mostrarError(inputTelefono, errorTelefono, "El teléfono es obligatorio.")
        return false;
    }

    if (telefono.length !== 8) {
        mostrarError(inputTelefono, errorTelefono, "El telefono debe contener exactamente 8 dígitos.");
        return false;
    }

    if (isNaN(telefono)) {
        mostrarError(inputTelefono, errorTelefono, "El teléfono solo debe contener números.");
        return false;
    }

    mostrarExito(inputTelefono, errorTelefono);
    return true;
}

function validarServicios() {
    if (serviciosSeleccionados.length === 0) {
        errorServicio.textContent = "Debe agregar al menos un servicio.";
        return false;
    }

    errorServicio.textContent = "";
    return true;
}

// validar barbero

function validarBarbero() {

    const barbero = selectBarbero.value;

    if (barbero === "") {
        mostrarError(selectBarbero, errorBarbero, "Debe seleccionar un barbero.");
        return false;
    }

    mostrarExito(selectBarbero, errorBarbero);
    return true;
}

// Validar fecha

function validarFecha() {

    const fecha = inputFecha.value;

    if (fecha === "") {
        mostrarError(inputFecha, errorFecha, "Debe seleccionar una fecha.");
        return false;
    }

    const fechaSeleccionada = new Date(fecha + "T00:00:00")
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < fechaActual) {
        mostrarError(inputFecha, errorFecha, "La fecha no puede ser anterior al día actual.");
        return false;
    }

    mostrarExito(inputFecha, errorFecha);
    return true;


}

// Validar hora

function validarHora() {
    const hora = selectHora.value;

    if (hora === "") {
        mostrarError(selectHora, errorHora, "Debe seleccionar una hora para su cita.");
        return false;
    }

    mostrarExito(selectHora, errorHora);
    return true;
}

// Validar el formulario general

function validarFormularioCita() {
    const nombreValido = validarNombre();
    const telefonoValido = validarTelefono();
    const correoValido = validarCorreo();
    const serviciosValidos = validarServicios();
    const barberoValido = validarBarbero();
    const fechaValida = validarFecha();
    const horaValida = validarHora();

    return nombreValido &&
        telefonoValido &&
        correoValido &&
        serviciosValidos &&
        barberoValido &&
        fechaValida &&
        horaValida;
}





//Funcion para limpiar TODO el formulario

function limpiarFormularioCompleto() {
    formCita.reset();

    serviciosSeleccionados = [];
    localStorage.removeItem("serviciosSeleccionados");

    limpiarErrores();
    limpiarClasesValidacion();

    renderizarServiciosAgregados();
    mostrarServiciosSeleccionados();
    cargarServiciosEnSelect();

    resumenBarbero.textContent = "No seleccionado";
    resumenFecha.textContent = "No seleccionada";
    resumenHora.textContent = "No seleccionada";
    resumenTotal.textContent = "₡0";

    cargarHoras();
}




//Funciones para usar sweetAlert


// Mensajes con SweetAlert

function mostrarAlertaExito(titulo, mensaje) {
    Swal.fire({
        icon: "success",
        title: titulo,
        text: mensaje,
        confirmButtonText: "Aceptar"
    });
}

function mostrarAlertaAdvertencia(titulo, mensaje) {
    Swal.fire({
        icon: "warning",
        title: titulo,
        text: mensaje,
        confirmButtonText: "Aceptar"
    });
}

function mostrarAlertaError(titulo, mensaje) {
    Swal.fire({
        icon: "error",
        title: titulo,
        text: mensaje,
        confirmButtonText: "Aceptar"
    });
}




//EVENTOS DEL FORMULARIO


//=========================

formCita.addEventListener("submit", function (event) {
    event.preventDefault();

    const formularioValido = validarFormularioCita();

    if (!formularioValido) {
        mensajeFormulario.textContent = "Revise los datos del formulario antes de continuar.";
        return;
    }

    if (!validarDisponibilidadCita()) {
        mensajeFormulario.textContent = "Seleccione otra hora disponible.";
        return;
    }

    const cita = crearObjetoCita();

    guardarCita(cita);

    mostrarCitasRegistradas();

    limpiarFormularioCompleto();

    mostrarAlertaExito("Cita registrada", "La cita fue guardada correctamente.");
});




//EventsListener de cada campo del formulario, para que valide mientras se escribe.

inputNombre.addEventListener("input", validarNombre);

inputTelefono.addEventListener("input", validarTelefono);

inputCorreo.addEventListener("input", validarCorreo);

btnAgregarServicio.addEventListener("click", agregarServicioDesdeFormulario);

btnLimpiar.addEventListener("click", function (event) {
    event.preventDefault();

    limpiarFormularioCompleto();
});

selectBarbero.addEventListener("change", function () {
    validarBarbero();
    selectHora.value = "";
    cargarHoras();
    actualizarResumenCita();
});

inputFecha.addEventListener("change", function () {
    validarFecha();
    selectHora.value = "";
    cargarHoras();
    actualizarResumenCita();
});

selectHora.addEventListener("change", function () {
    validarHora();
    actualizarResumenCita();
});







//INICIALIZACION DE LA PÁGINA


document.addEventListener("DOMContentLoaded", async function () {
    await cargarDatosJSON();

    cargarServiciosSeleccionados();
    cargarServiciosEnSelect();
    renderizarServiciosAgregados();
    mostrarServiciosSeleccionados();
    cargarBarberos();
    cargarHoras();
    actualizarResumenCita();
    mostrarCitasRegistradas();
});

