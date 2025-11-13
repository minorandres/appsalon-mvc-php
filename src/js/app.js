let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();

});

function iniciarApp() {
    mostrarSeccion(); // Muestra la sección correspondiendo al paso
    tabs(); // Cambia la sección cuando se presionen los tabs
    botonesPaginador(); // Agrega o quita los botones del paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI(); // Consulta la API en el backend para obtener los servicios

    idCliente(); //
    nombreCliente(); //añade el nombre del cliente al objeto de cita
    seleccionarFecha(); // Añade la fecha de la cita al objeto
    seleccionarHora(); // Añade la hora de la cita al objeto

    mostrarResumen(); // Muestra el resumen de la cita
}

function mostrarSeccion() {
    //ocultar la sección que tenga la clase mostrar
    const seccionMostrar = document.querySelector('.mostrar');
    if (seccionMostrar) {
        seccionMostrar.classList.remove('mostrar');
    }

    //seleccionar la sección con el paso
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //Quitar la clase actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');


}

function tabs() {
    const botones = document.querySelectorAll('.tabs button');

    botones.forEach( boton => {
        boton.addEventListener('click', function(e) {
            paso = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();

        });
    });
}

function botonesPaginador() {
    const botonAnterior = document.querySelector('#anterior');
    const botonSiguiente = document.querySelector('#siguiente');

    if (paso === 1) {
        botonAnterior.classList.add('ocultar');
        botonSiguiente.classList.remove('ocultar');
    } else if (paso === 3) {
        botonAnterior.classList.remove('ocultar');
        botonSiguiente.classList.add('ocultar');
        mostrarResumen();
    } else {
        botonAnterior.classList.remove('ocultar');
        botonSiguiente.classList.remove('ocultar');
    }
}

function paginaAnterior() {
    const botonAnterior = document.querySelector('#anterior');
    botonAnterior.addEventListener('click', function() {
        if(paso <= pasoInicial) return;
        paso--;
        botonesPaginador();
        mostrarSeccion();
    });
}

function paginaSiguiente() {
    const botonSiguiente = document.querySelector('#siguiente');
    botonSiguiente.addEventListener('click', function() {
        if(paso >= pasoFinal) return;
        paso++;
        botonesPaginador();
        mostrarSeccion();
    });
}

async function consultarAPI() {
    try {
        const url = '/api/servicios';
        const respuesta = await fetch(url); // lo puede leer porque cambiamos con el json_encode a un array JS
        const servicios = await respuesta.json();
        mostrarServicios(servicios);
        

    } catch (error) {
        console.log(error);
    }

}

function mostrarServicios(servicios) {
    servicios.forEach( servicio => {
        const { id, nombre, precio } = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$ ${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function() {
            seleccionarServicio(servicio);
        }
        

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        // Seleccionar el contenedor de servicios y agregar el servicio
        const contenedorServicios = document.querySelector('#servicios');
        contenedorServicios.appendChild(servicioDiv);
    });
}

function seleccionarServicio(servicio) {
    const {servicios} = cita;
    const {id} = servicio;

    const divServicio = document.querySelector(`[data-id-servicio="${id}"]`);

    //Comprobar si el servicio fue agregado o quitado
    if( servicios.some(agregado => agregado.id === id)) {
        //Eliminar el servicio
        cita.servicios = servicios.filter( agregado => agregado.id !== id);
        divServicio.classList.remove('seleccionado');
    } else { // Agregarlo
        cita.servicios = [...servicios, servicio];
        divServicio.classList.add('seleccionado');
    }
    // console.log(cita);
}

function idCliente() {
    cita.id = document.querySelector('#id').value; // .value para obtener el id del objeto cita
}

function nombreCliente() {
   cita.nombre = document.querySelector('#nombre').value; // .value para obtener el valor del input
   console.log(nombre); 
}

function seleccionarFecha() {
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input', function(e) {
        const dia = new Date(e.target.value).getUTCDay(); // 0 es domingo y 6 sábado
        if( [6, 0].includes(dia)) {
            e.target.value = '';
            mostrarAlerta('Fines de semana no se atiende', 'error', '.formulario');
        } else {
            cita.fecha = e.target.value;
        }

    });

}

function seleccionarHora() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', function(e) {
        
        const horaCita = e.target.value;
        const hora = horaCita.split(":")[0];
        if (hora < 10 || hora > 18) {
            e.target.value = '';
            mostrarAlerta('Hora no válida', 'error', '.formulario');
        } else {
            cita.hora = e.target.value;
           // console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje, tipo, elemento, desaparece = true) {

    //Si ya hay una alerta, no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        alertaPrevia.remove();
    } 

    //Script para crear la alerta en HTML
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    //Remover alerta en 3 segundos
    const referencia = document.querySelector(elemento);
    referencia.appendChild(alerta);

    if(desaparece) {
    setTimeout(() => {
        alerta.remove();
    }, 3000);
    }

}

function mostrarResumen() {
    //Seleccionar el contenedor de resumen
    const resumen = document.querySelector('.contenido-resumen');

    //Limpiar el contenido de resumen
    while(resumen.firstChild) {
        resumen.removeChild(resumen.firstChild);
    }

    if(Object.values(cita).includes('') || cita.servicios.length === 0) {
        mostrarAlerta('Faltan datos de cita', 'error', '.contenido-resumen', false);
        return;
    } 

    // Formatear el div de resumen
    const { nombre, fecha, hora, servicios } = cita;

    // Heading de servicios en el resumen
    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span>Nombre:</span> ${nombre}`;

    //Formatear la fecha en español
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate() + 2; // Ajuste porque el objeto Date resta un día y son 2
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date( Date.UTC(year, mes, dia));
    const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // console.log(fechaFormateada);
    

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const totalPrecios = servicios.reduce((acumulador, servicio) => acumulador + parseFloat(servicio.precio), 0); // suma los precios de los servicios escogidos.

    const serviciosNombre = document.createElement('P');
    serviciosNombre.innerHTML = `<span>Servicios:</span> ${servicios.map(servicio => `${servicio.nombre} ($${servicio.precio})`).join('<br>')}
    <hr>
    <strong>TOTAL:</strong> $${totalPrecios}`;

    //Boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita; // no se ponen () porque sino ejecuta al cargar la página

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);
    resumen.appendChild(serviciosNombre);
    resumen.appendChild(botonReservar);

} 

async function reservarCita() {
    const {id, fecha, hora } = cita; // extrae del array de cita
    // console.log(cita);
    const idServicios = cita.servicios.map( servicio => servicio.id )

    const datos = new FormData();
    datos.append('fecha', fecha);
    datos.append('hora', hora);
    datos.append('usuarioId', id);
    datos.append('servicios', idServicios);
   

    try {
        //Peticion hacia la api
        const url = '/api/citas';

        const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
        });
        
        const resultado = await respuesta.json();

        console.log(datos);

        // Verificar si la operación fue exitosa
        if(resultado.resultado) {
            Swal.fire({
                icon: "success",
                title: "Cita Reservada",
                text: "La cita ha sido reservada correctamente.",
                button: 'OK'
            }).then(() => {
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            });
        } else {
            // Si resultado es false, mostrar error
            Swal.fire({
                icon: "error",
                title: "Error al Reservar",
                text: "No se pudo guardar la cita. Verifica que el usuario existe."
            });
        }
    } catch (error) {
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error al guardar la cita."
        });
    }



    //console.log([...datos]); // ... sirve para ver los datos que se guardan
}


