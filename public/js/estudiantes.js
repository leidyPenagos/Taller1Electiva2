(function(){
  "use strict";

  if (!PanelAPI.requireAuth()) return;
  PanelAPI.initNavbar();

  const $ = (sel) => document.querySelector(sel);
  let maestrosCache = [];
  let deleteHandler = null;

  async function loadMaestrosParaSelect(){
    try {
      const data = await PanelAPI.request("/api/maestros");
      maestrosCache = Array.isArray(data) ? data : (data.maestros || []);
      const select = $("#estudianteMaestro");
      select.innerHTML = '<option value="">Selecciona un maestro…</option>';
      maestrosCache.forEach((m) => {
        const opt = document.createElement("option");
        opt.value = m._id;
        opt.textContent = m.nombre;
        select.appendChild(opt);
      });
    } catch (err){
      PanelAPI.showToast(err.message, true);
    }
  }

  async function loadEstudiantes(){
    try {
      const data = await PanelAPI.request("/api/estudiantes");
      const estudiantes = Array.isArray(data) ? data : (data.estudiantes || []);
      renderEstudiantes(estudiantes);
    } catch (err){
      PanelAPI.showToast(err.message, true);
    }
  }

  function nombreMaestro(maestro){
    if (maestro && typeof maestro === "object") return maestro.nombre;
    const encontrado = maestrosCache.find(m => m._id === maestro);
    return encontrado ? encontrado.nombre : "—";
  }

  function renderEstudiantes(estudiantes){
    const body = $("#estudiantesBody");
    body.innerHTML = "";
    $("#estudiantesEmpty").style.display = estudiantes.length ? "none" : "block";

    estudiantes.forEach((e) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + PanelAPI.escapeHtml(e.nombre) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(e.documento) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(e.correo) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(e.edad) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(e.programa) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(nombreMaestro(e.maestro)) + "</td>" +
        "<td class='text-end'>" +
          "<button class='btn btn-sm btn-outline-secondary me-1 btn-edit'>Editar</button>" +
          "<button class='btn btn-sm btn-outline-danger btn-del'>Eliminar</button>" +
        "</td>";
      tr.querySelector(".btn-edit").addEventListener("click", () => openModal(e));
      tr.querySelector(".btn-del").addEventListener("click", () => confirmDelete(e));
      body.appendChild(tr);
    });
  }

  function openModal(e){
    $("#formEstudianteError").style.display = "none";
    $("#formEstudiante").reset();
    $("#estudianteId").value = e ? e._id : "";
    $("#modalEstudianteTitle").textContent = e ? "Editar estudiante" : "Nuevo estudiante";
    $("#estudianteNombre").value = e ? e.nombre : "";
    $("#estudianteDocumento").value = e ? e.documento : "";
    $("#estudianteEdad").value = e ? e.edad : "";
    $("#estudianteCorreo").value = e ? e.correo : "";
    $("#estudiantePrograma").value = e ? e.programa : "";
    $("#estudianteMaestro").value = e ? (e.maestro && e.maestro._id ? e.maestro._id : e.maestro) : "";
    bootstrap.Modal.getOrCreateInstance($("#modalEstudiante")).show();
  }

  $("#btnNuevoEstudiante").addEventListener("click", () => {
    if (!maestrosCache.length){
      PanelAPI.showToast("Primero registra al menos un maestro.", true);
      return;
    }
    openModal(null);
  });

  $("#formEstudiante").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = $("#estudianteId").value;
    const payload = {
      nombre: $("#estudianteNombre").value.trim(),
      documento: $("#estudianteDocumento").value.trim(),
      correo: $("#estudianteCorreo").value.trim(),
      edad: Number($("#estudianteEdad").value),
      programa: $("#estudiantePrograma").value.trim(),
      maestro: $("#estudianteMaestro").value
    };
    try {
      await PanelAPI.request(id ? "/api/estudiantes/" + id : "/api/estudiantes", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      bootstrap.Modal.getInstance($("#modalEstudiante")).hide();
      PanelAPI.showToast(id ? "Estudiante actualizado." : "Estudiante creado.", false);
      loadEstudiantes();
    } catch (err){
      $("#formEstudianteError").textContent = err.message;
      $("#formEstudianteError").style.display = "block";
    }
  });

  function confirmDelete(e){
    deleteHandler = async () => {
      try {
        await PanelAPI.request("/api/estudiantes/" + e._id, { method: "DELETE" });
        PanelAPI.showToast("Estudiante eliminado.", false);
        loadEstudiantes();
      } catch (err){
        PanelAPI.showToast(err.message, true);
      }
    };
    bootstrap.Modal.getOrCreateInstance($("#modalConfirm")).show();
  }

  $("#btnConfirmDelete").addEventListener("click", async () => {
    bootstrap.Modal.getInstance($("#modalConfirm")).hide();
    if (deleteHandler) await deleteHandler();
  });

  (async function init(){
    await loadMaestrosParaSelect();
    await loadEstudiantes();
  })();
})();
