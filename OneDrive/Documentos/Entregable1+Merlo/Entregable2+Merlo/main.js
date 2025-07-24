document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos HTML
  const form = document.getElementById("formSigno");
  const selectSigno = document.getElementById("signo");
  const resultado = document.getElementById("resultado");
  const otroSignoBtn = document.getElementById("otroSigno");
  const borrarHistorialBtn = document.getElementById("borrarHistorial");
  const historialDiv = document.getElementById("historial");

  let datosSignos = []; // Array para guardar los datos de signos cargados desde JSON

  // Cargar datos desde el archivo datos.json de forma asíncrona
  fetch("data/datos.json")
    .then(res => {
      if (!res.ok) {
        throw new Error("No se pudo cargar el archivo datos.json");
      }
      return res.json();
    })
    .then(data => {
      datosSignos = data;

      // Crear opciones dinámicas para el select según los signos cargados
      data.forEach(signo => {
        const option = document.createElement("option");
        option.value = signo.signo;
        option.textContent = `${signo.signo} (${signo.fecha})`;
        selectSigno.appendChild(option);
      });
    })
    .catch(error => {
      // Mostrar mensaje de error si falla la carga del JSON
      resultado.innerHTML = `<p style="color:red; text-align:center;">Error al cargar los datos: ${error.message}</p>`;
      form.style.display = "none"; // Ocultar formulario si no se pueden cargar datos
    });

  // Evento al enviar el formulario
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const signoSeleccionado = selectSigno.value;
    if (!signoSeleccionado) return; // Si no se seleccionó nada, no hacer nada

    // Buscar el objeto del signo en el array datosSignos
    const signo = datosSignos.find(s => s.signo === signoSeleccionado);
    if (!signo) return; // Si no se encuentra, no hacer nada

    // Mostrar la predicción usando SweetAlert2
    Swal.fire({
      title: `Horóscopo de ${signo.signo}`,
      html: `
        <p><strong>Elemento:</strong> ${signo.elemento}</p>
        <p><strong>Predicción:</strong><br>${signo.mensaje}</p>
      `,
      icon: "info",
      confirmButtonText: "Gracias ✨"
    });

    // Guardar consulta en localStorage y actualizar el historial mostrado
    guardarEnLocalStorage(signo.signo, signo.mensaje);
    mostrarHistorial();

    // Ocultar el formulario y mostrar el botón para consultar otro signo
    form.style.display = "none";
    otroSignoBtn.style.display = "inline-block";
  });

  // Botón para consultar otro signo: reinicia formulario y muestra nuevamente
  otroSignoBtn.addEventListener("click", () => {
    form.reset();
    form.style.display = "block";
    otroSignoBtn.style.display = "none";
    resultado.innerHTML = "";
  });

  // Botón para borrar el historial almacenado
  borrarHistorialBtn.addEventListener("click", () => {
    localStorage.removeItem("horoscopos");
    mostrarHistorial();
  });

  // Función para guardar una consulta en localStorage
  function guardarEnLocalStorage(signo, mensaje) {
    const historial = JSON.parse(localStorage.getItem("horoscopos")) || [];
    historial.push({ signo, mensaje, fecha: new Date().toLocaleString() });
    localStorage.setItem("horoscopos", JSON.stringify(historial));
  }

  // Función para mostrar el historial guardado en el HTML
  function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("horoscopos")) || [];
    historialDiv.innerHTML = "";

    if (historial.length === 0) {
      historialDiv.innerHTML = `<p style="text-align:center; font-style: italic;">No hay consultas realizadas aún.</p>`;
      return;
    }

    historial.forEach(item => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${item.signo}</strong> (${item.fecha}):<br>${item.mensaje}<hr>`;
      historialDiv.appendChild(div);
    });
  }

  // Mostrar el historial cuando se carga la página
  mostrarHistorial();
});
