(function(){
  "use strict";

  if (PanelAPI.redirectIfAuth()) return;

  const $ = (sel) => document.querySelector(sel);

  function showAuthMessage(msg, isError){
    const err = $("#authError");
    const ok = $("#authSuccess");
    err.style.display = "none";
    ok.style.display = "none";
    if (isError){ err.textContent = msg; err.style.display = "block"; }
    else if (msg) { ok.textContent = msg; ok.style.display = "block"; }
  }

  $("#formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    showAuthMessage("");
    try {
      const data = await PanelAPI.request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: $("#loginEmail").value.trim(),
          password: $("#loginPassword").value
        })
      });
      PanelAPI.setSession(data.token);
      window.location.href = "/panel/maestros";
    } catch (err){
      showAuthMessage(err.message, true);
    }
  });

  $("#formRegister").addEventListener("submit", async (e) => {
    e.preventDefault();
    showAuthMessage("");
    try {
      await PanelAPI.request("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          nombre: $("#regNombre").value.trim(),
          email: $("#regEmail").value.trim(),
          password: $("#regPassword").value
        })
      });
      $("#formRegister").reset();
      bootstrap.Tab.getOrCreateInstance($("#tabLoginBtn")).show();
      showAuthMessage("Cuenta creada. Ahora inicia sesión.", false);
    } catch (err){
      showAuthMessage(err.message, true);
    }
  });
})();
