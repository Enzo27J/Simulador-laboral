$(document).ready(() => {
  let pacienteActual = null;

  // ========== CRONÓMETRO ==========
  let segundos = 0;
  let intervalo = setInterval(() => {
    segundos++;
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    $("#cronometro").text(`Tiempo en sesión: ${h}:${m}:${s}`);
  }, 1000);

  // Botón salir
  $("#salirBtn").click(() => window.location.href = "/index.html");

  // Botón instrucciones
  $("#btnInstrucciones").click(() => window.open("instrucciones.html", "_blank"));

  // Cargar doctores
  $.get("/api/doctores", data => {
    data.forEach(doc => $("#doctor").append(`<option value="${doc.cedula}">${doc.nombre}</option>`));
  });

  // Buscar paciente
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

  // Nuevo paciente
  $("#nuevoPacienteBtn").click(() => {
    pacienteActual = { nuevo: true, cedula: $("#cedula").val().trim() };
    mostrarDatosPaciente();
  });

  // Crear cita
  $("#crearCitaBtn").click(() => {
    if (!pacienteActual) return alert("Seleccione o cree un paciente primero");

    const cita = {
      paciente: pacienteActual,
      doctorCedula: $("#doctor").val(),
      fecha: $("#fecha").val(),
      tipoAtencion: $("#tipoAtencion").val(),
      descripcion: $("#descripcion").val(),
      alergias: $("#alergias").val(),
      centro: $("#centro").val()
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

  // Cancelar cita
  $(document).on("click", ".cancelarCitaBtn", function() {
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

  // Finalizar simulación
  $("#finalizarSimulacionBtn").click(() => {
    clearInterval(intervalo); // detener cronómetro
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");

    alert(`Simulación finalizada. Tiempo total: ${h}:${m}:${s}`);
    // Aquí se puede enviar `segundos` a un profesor en el futuro

    window.location.href = "/index.html"; // redirigir al login
  });

  function mostrarDatosPaciente() {
    $("#datosPaciente").removeClass("d-none");
    $("#crearCitaCard").removeClass("d-none");
    $("#citasPacienteCard").removeClass("d-none");

    if (!pacienteActual.nuevo) {
      $("#nombre").val(pacienteActual.nombre);
      $("#fechaNacimiento").val(pacienteActual.fechaNacimiento);
      $("#correo").val(pacienteActual.correo);
      $("#telefono").val(pacienteActual.telefono);
      $("#direccion").val(pacienteActual.direccion);
    } else {
      $("#datosPaciente input").val("");
    }
  }

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
});