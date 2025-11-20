// --- EVENTO LOGIN ---
$("#loginBtn").click(() => {
  $.ajax({
    url: "/login",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      username: $("#user").val(),
      password: $("#pass").val()
    }),
    success: res => {
      if (res.success && res.role === "estudiante") {
        $("#loginCard").addClass("d-none");
        $("#nombreCard").removeClass("d-none");
      } else {
        $("#errorMsg").text(res.message || "Usuario no válido");
      }
    }
  });
});

// --- BOTÓN CONTINUAR ---
$("#continuarBtn").click(() => {
  const nombre = $("#nombreEstudiante").val().trim();
  if (nombre) {
    localStorage.setItem("nombreEstudiante", nombre);
    $("#nombreCard").addClass("d-none");
    $("#menuCard").removeClass("d-none");
    $("#bienvenida").text(`Bienvenido(a), ${nombre}`);
  }
});

// --- LOGOUT Y MÓDULO DE CITAS ---
$(document).ready(function() {
  $("#logoutBtn").on("click", function() {
    window.location.href = "/index.html";
  });

  $("#moduloCitas").on("click", function() {
    window.location.href = "/citas.html";
  });
});