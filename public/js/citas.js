$(document).ready(() => {

  /* ============================================================
     UBICACIONES DE COSTA RICA (Provincias → Cantones → Distritos)
     ============================================================ */
  const CR_UBICACION = {
    "San José": {
      "San José": ["Carmen", "Merced", "Hospital", "Catedral", "Zapote", "San Francisco de Dos Ríos", "Uruca", "Mata Redonda", "Pavas", "Hatillo", "San Sebastián"],
      "Escazú": ["Escazú Centro", "San Rafael", "San Antonio"],
      "Desamparados": ["Desamparados", "San Miguel", "San Juan de Dios", "San Rafael Arriba", "San Antonio", "Frailes", "Patarra", "San Cristóbal", "Rosario", "Damas", "San Rafael Abajo", "Gravilias", "Los Guido"],
      "Puriscal": ["Santiago", "Mercedes Sur", "Barbacoas", "Grifo Alto", "San Rafael", "Candelarita", "Desamparaditos", "San Antonio", "Chires"],
      "Tarrazú": ["San Marcos", "San Lorenzo", "San Carlos"]
    },
    "Alajuela": {
      "Alajuela": ["Alajuela", "San José", "Carrizal", "San Antonio", "Guácima", "San Isidro", "Sabanilla", "San Rafael", "Río Segundo", "Desamparados", "Turrúcares", "Tambor", "Garita", "Sarapiquí"],
      "San Ramón": ["San Ramón", "Santiago", "San Juan", "Piedades Norte", "Piedades Sur", "San Rafael", "San Isidro", "Angeles", "Alfaro", "Volio", "Concepción", "Zapotal", "San Isidro de Peñas Blancas"]
    },
    "Cartago": {
      "Cartago": ["Oriental", "Occidental", "Carmen", "San Nicolás", "Aguacaliente", "Guadalupe", "Corralillo", "Tierra Blanca", "Dulce Nombre", "Llano Grande", "Quebradilla"]
    },
    "Heredia": {
      "Heredia": ["Heredia", "Mercedes", "San Francisco", "Ulloa", "Varablanca"]
    },
    "Guanacaste": {
      "Liberia": ["Liberia", "Cañas Dulces", "Mayorga", "Nacascolo", "Curubandé"]
    },
    "Puntarenas": {
      "Puntarenas": ["Puntarenas", "Pitahaya", "Chomes", "Lepanto", "Paquera", "Manzanillo", "Guacimal", "Barranca", "Isla Venado"]
    },
    "Limón": {
      "Limón": ["Limón", "Valle La Estrella", "Río Blanco", "Matama"]
    }
  };

  /* ==========================
     FUNCIÓN: Cargar Provincias
     ========================== */
  function cargarProvincias() {
    $("#provincia").empty().append(`<option value="">Seleccione...</option>`);
    Object.keys(CR_UBICACION).forEach(p =>
      $("#provincia").append(`<option value="${p}">${p}</option>`)
    );
  }

  function cargarCantones(provincia) {
    $("#canton").empty().append(`<option value="">Seleccione...</option>`);
    $("#distrito").empty().append(`<option value="">Seleccione...</option>`);

    if (!provincia) return;

    Object.keys(CR_UBICACION[provincia]).forEach(c =>
      $("#canton").append(`<option value="${c}">${c}</option>`)
    );
  }

  function cargarDistritos(provincia, canton) {
    $("#distrito").empty().append(`<option value="">Seleccione...</option>`);

    if (!canton) return;

    CR_UBICACION[provincia][canton].forEach(d =>
      $("#distrito").append(`<option value="${d}">${d}</option>`)
    );
  }

  // Inicializar selects
  cargarProvincias();

  $("#provincia").change(() =>
    cargarCantones($("#provincia").val())
  );

  $("#canton").change(() =>
    cargarDistritos($("#provincia").val(), $("#canton").val())
  );

  /* ==========================
     CRONÓMETRO
     ========================== */

  let pacienteActual = null;
  let segundos = 0;

  let intervalo = setInterval(() => {
    segundos++;
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    $("#cronometro").text(`Tiempo en sesión: ${h}:${m}:${s}`);
  }, 1000);

  /* ==========================
     BOTONES SUPERIORES
     ========================== */

  $("#salirBtn").click(() =>
    window.location.href = "/index.html"
  );

  $("#btnInstrucciones").click(() =>
    window.open("instrucciones.html", "_blank")
  );

  /* ==========================
     CARGAR DOCTORES
     ========================== */

  $.get("/api/doctores", data => {
    data.forEach(doc =>
      $("#doctor").append(`<option value="${doc.cedula}">${doc.nombre}</option>`)
    );
  });

  /* ==========================
     BUSCAR PACIENTE
     ========================== */

  $("#buscarPacienteBtn").click(() => {
    const cedula = $("#cedula").val().trim();
    if (!cedula) return alert("Ingrese una cédula");

    $.get(`/api/pacientes/${cedula}`, data => {
      if (!data) return alert("Paciente no encontrado");

      pacienteActual = data;
      mostrarDatosPaciente();
      cargarCitas();
    });
  });

  /* ==========================
     NUEVO PACIENTE
     ========================== */

  $("#nuevoPacienteBtn").click(() => {
    pacienteActual = { nuevo: true, cedula: $("#cedula").val().trim() };
    mostrarDatosPaciente();
  });

  /* ==========================
     MOSTRAR DATOS DEL PACIENTE
     ========================== */

  function mostrarDatosPaciente() {
    $("#datosPaciente").removeClass("d-none");
    $("#crearCitaCard").removeClass("d-none");
    $("#citasPacienteCard").removeClass("d-none");

    if (!pacienteActual.nuevo && pacienteActual.direccion) {

      // Rellenar selects dependientes
      const d = pacienteActual.direccion;

      $("#nombre").val(pacienteActual.nombre);
      $("#fechaNacimiento").val(pacienteActual.fechaNacimiento);
      $("#correo").val(pacienteActual.correo);
      $("#telefono").val(pacienteActual.telefono);

      $("#provincia").val(d.provincia).trigger("change");

      setTimeout(() => {
        $("#canton").val(d.canton).trigger("change");
        setTimeout(() => {
          $("#distrito").val(d.distrito);
        }, 200);
      }, 200);

      $("#barrio").val(d.barrio);
      $("#otrasSenas").val(d.otrasSenas);

    } else {
      $("#datosPaciente input").val("");
      cargarProvincias();
    }
  }

  /* ==========================
     CREAR CITA
     ========================== */

  $("#crearCitaBtn").click(() => {
    if (!pacienteActual) return alert("Seleccione o cree un paciente primero");

    const cita = {
      paciente: pacienteActual,
      doctorCedula: $("#doctor").val(),
      fecha: $("#fecha").val(),
      tipoAtencion: $("#tipoAtencion").val(),
      descripcion: $("#descripcion").val(),
      alergias: $("#alergias").val(),
      centro: $("#centro").val(),
      direccion: {
        provincia: $("#provincia").val(),
        canton: $("#canton").val(),
        distrito: $("#distrito").val(),
        barrio: $("#barrio").val(),
        otrasSenas: $("#otrasSenas").val()
      }
    };

    $.ajax({
      url: "/api/citas",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(cita),
      success: res => {
        alert(res.message);
        cargarCitas();
      }
    });
  });

  /* ==========================
     CANCELAR CITA
     ========================== */

  $(document).on("click", ".cancelarCitaBtn", function () {
    const id = $(this).data("id");

    $.ajax({
      url: `/api/citas/${id}`,
      method: "DELETE",
      success: res => {
        alert(res.message);
        cargarCitas();
      }
    });
  });

  /* ==========================
     CARGAR TABLA DE CITAS
     ========================== */

  function cargarCitas() {
    $.get(`/api/citas/paciente/${pacienteActual.cedula}`, data => {
      const tbody = $("#listaCitas").empty();
      data.forEach(cita => {
        tbody.append(`
          <tr>
            <td>${cita.doctor}</td>
            <td>${cita.fecha}</td>
            <td>${cita.centro}</td>
            <td><button class="btn btn-danger btn-sm cancelarCitaBtn" data-id="${cita.id}">Cancelar</button></td>
          </tr>
        `);
      });
    });
  }

  /* ==========================
     FINALIZAR SIMULACIÓN
     ========================== */

  $("#finalizarSimulacionBtn").click(() => {
    clearInterval(intervalo);

    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");

    alert(`Simulación finalizada.\nTiempo total: ${h}:${m}:${s}`);

    // Se mantiene la variable "segundos" por si en el futuro se envía al profesor

    window.location.href = "/index.html";
  });

});