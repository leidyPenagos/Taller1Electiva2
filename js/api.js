window.PanelAPI = (function () {
  "use strict";

  const TOKEN_KEY = "panel_token";
  const USER_KEY  = "panel_user";

  function getToken(){ return localStorage.getItem(TOKEN_KEY); }

  function getUser(){
    try { return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); }
    catch(e){ return {}; }
  }

  function setSession(token){
    localStorage.setItem(TOKEN_KEY, token);
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem(USER_KEY, JSON.stringify(payload));
  }

  function clearSession(){
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function logout(){
    clearSession();
    window.location.href = "/panel/login";
  }

  // Llamar al inicio de cada página protegida (maestros, estudiantes, etc.)
  function requireAuth(){
    if (!getToken()){
      window.location.href = "/panel/login";
      return false;
    }
    return true;
  }

  // Llamar al inicio de la página de login: si ya hay sesión, salta directo al panel.
  function redirectIfAuth(){
    if (getToken()){
      window.location.href = "/panel/maestros";
      return true;
    }
    return false;
  }

  async function request(path, options={}){
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      options.headers || {}
    );
    const token = getToken();
    if (token) headers.Authorization = "Bearer " + token;

    const res = await fetch(path, Object.assign({}, options, { headers }));

    if (res.status === 401){
      clearSession();
      window.location.href = "/panel/login";
      throw new Error("Tu sesión expiró.");
    }

    let data = null;
    try { data = await res.json(); } catch(e){ /* respuesta vacía */ }

    if (!res.ok){
      throw new Error((data && data.mensaje) || "Ocurrió un error inesperado.");
    }
    return data;
  }

  function showToast(msg, isError){
    const toastEl = document.getElementById("appToast");
    if (!toastEl) return;
    toastEl.classList.remove("bg-success","bg-danger");
    toastEl.classList.add(isError ? "bg-danger" : "bg-success");
    document.getElementById("appToastBody").textContent = msg;
    new bootstrap.Toast(toastEl, { delay: 3200 }).show();
  }

  function escapeHtml(v){
    return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
    }[c]));
  }

  // Llena el nombre de usuario y activa el botón de salir en la navbar.
  function initNavbar(){
    const user = getUser();
    const nameEl = document.getElementById("navUserName");
    if (nameEl && user.nombre) nameEl.textContent = "Hola, " + user.nombre;
    const btn = document.getElementById("btnLogout");
    if (btn) btn.addEventListener("click", logout);
  }

  return {
    getToken, getUser, setSession, clearSession, logout,
    requireAuth, redirectIfAuth, request, showToast, escapeHtml, initNavbar
  };
})();
