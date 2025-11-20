$(document).ready(() => {
  let pacienteActual = null;

  // Cargar doctores disponibles al iniciar
  $.get("/api/doctores", data => {
    data.forEach(doc => {
      $("#doctor").append(`<option value="${doc.cedula}">${doc.nombre}</option>`);
    });
  });

  // Buscar paciente por cédula
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

  // Crear nuevo paciente
  $("#nuevoPacienteBtn").click(() => {
    pacienteActual = {
      nuevo: true,
      cedula: $("#cedula").val().trim()
    };
    mostrarDatosPaciente();
  });

  // Crear cita
  $("#crearCitaBtn").click(() => {
    if (!pacienteActual) return alert("Seleccione o cree un paciente primero");

    const cita = {
      paciente: pacienteActual,
      doctorCedula: $("#doctor").val(),
      fecha: $("#fecha").val(),
      sintomas: $("#sintomas").val(),
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