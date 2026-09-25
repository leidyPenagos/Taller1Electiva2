(function(){
  "use strict";

  if (!PanelAPI.requireAuth()) return;
  PanelAPI.initNavbar();

  const $ = (sel) => document.querySelector(sel);
  let deleteHandler = null;

  async function loadMaestros(){
    try {
      const data = await PanelAPI.request("/api/maestros");
      const maestros = Array.isArray(data) ? data : (data.maestros || []);
      renderMaestros(maestros);
    } catch (err){
      PanelAPI.showToast(err.message, true);
    }
  }

  function renderMaestros(maestros){
    const body = $("#maestrosBody");
    body.innerHTML = "";
    $("#maestrosEmpty").style.display = maestros.length ? "none" : "block";

    maestros.forEach((m) => {
      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + PanelAPI.escapeHtml(m.nombre) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(m.documento) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(m.correo) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(m.telefono) + "</td>" +
        "<td>" + PanelAPI.escapeHtml(m.especialidad) + "</td>" +
        "<td class='text-end'>" +
          "<button class='btn btn-sm btn-outline-secondary me-1 btn-edit'>Editar</button>" +
          "<button class='btn btn-sm btn-outline-danger btn-del'>Eliminar</button>" +
        "</td>";
      tr.querySelector(".btn-edit").addEventListener("click", () => openModal(m));
      tr.querySelector(".btn-del").addEventListener("click", () => confirmDelete(m));
      body.appendChild(tr);
    });
  }

  function openModal(m){
    $("#formMaestroError").style.display = "none";
    $("#formMaestro").reset();
    $("#maestroId").value = m ? m._id : "";
    $("#modalMaestroTitle").textContent = m ? "Editar maestro" : "Nuevo maestro";
    $("#maestroNombre").value = m ? m.nombre : "";
    $("#maestroDocumento").value = m ? m.documento : "";
    $("#maestroTelefono").value = m ? m.telefono : "";
    $("#maestroCorreo").value = m ? m.correo : "";
    $("#maestroEspecialidad").value = m ? m.especialidad : "";
    bootstrap.Modal.getOrCreateInstance($("#modalMaestro")).show();
  }

  $("#btnNuevoMaestro").addEventListener("click", () => openModal(null));

  $("#formMaestro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = $("#maestroId").value;
    const payload = {
      nombre: $("#maestroNombre").value.trim(),
      documento: $("#maestroDocumento").value.trim(),
      correo: $("#maestroCorreo").value.trim(),
      telefono: $("#maestroTelefono").value.trim(),
      especialidad: $("#maestroEspecialidad").value.trim()
    };
    try {
      await PanelAPI.request(id ? "/api/maestros/" + id : "/api/maestros", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      bootstrap.Modal.getInstance($("#modalMaestro")).hide();
      PanelAPI.showToast(id ? "Maestro actualizado." : "Maestro creado.", false);
      loadMaestros();
    } catch (err){
      $("#formMaestroError").textContent = err.message;
      $("#formMaestroError").style.display = "block";
    }
  });

  function confirmDelete(m){
    deleteHandler = async () => {
      try {
        await PanelAPI.request("/api/maestros/" + m._id, { method: "DELETE" });
        PanelAPI.showToast("Maestro eliminado.", false);
        loadMaestros();
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

  loadMaestros();
})();
