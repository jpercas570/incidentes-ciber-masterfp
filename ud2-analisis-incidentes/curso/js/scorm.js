/* Comunicación con la plataforma (SCORM 1.2).
   Si no hay plataforma, el paquete funciona igual y guarda el progreso en el navegador. */
var Plataforma = (function () {
  'use strict';
  var api = null, iniciado = false, terminado = false, inicio = new Date();
  var CLAVE = 'ud2-5021-analisis-incidentes';

  function buscarEn(ventana) {
    var saltos = 0;
    try {
      while (ventana && !ventana.API && ventana.parent && ventana.parent !== ventana && saltos < 50) {
        saltos++; ventana = ventana.parent;
      }
      return ventana && ventana.API ? ventana.API : null;
    } catch (e) { return null; }
  }
  function buscar() {
    var a = buscarEn(window);
    if (!a) { try { if (window.opener) { a = buscarEn(window.opener); } } catch (e) { a = null; } }
    return a;
  }
  function iniciar() {
    api = buscar();
    if (api) {
      try { iniciado = String(api.LMSInitialize('')) === 'true'; } catch (e) { iniciado = false; }
      if (iniciado) {
        var estado = leer('cmi.core.lesson_status');
        if (estado === 'not attempted' || estado === '') { escribir('cmi.core.lesson_status', 'incomplete'); }
      }
    }
    return iniciado;
  }
  function leer(clave) {
    if (!iniciado) { return ''; }
    try { return String(api.LMSGetValue(clave)); } catch (e) { return ''; }
  }
  function escribir(clave, valor) {
    if (!iniciado || terminado) { return false; }
    try { return String(api.LMSSetValue(clave, String(valor))) === 'true'; } catch (e) { return false; }
  }
  function confirmar() {
    if (!iniciado || terminado) { return; }
    try { api.LMSCommit(''); } catch (e) { /* sin plataforma */ }
  }
  function dos(n) { return (n < 10 ? '0' : '') + n; }
  function tiempoSesion() {
    var s = Math.round((new Date() - inicio) / 1000);
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return (h < 1000 ? ('000' + h).slice(-4) : String(h)) + ':' + dos(m) + ':' + dos(r);
  }

  /* Estado: se guarda como texto JSON en cmi.suspend_data o en el navegador. */
  function cargarEstado() {
    var texto = '';
    if (iniciado) { texto = leer('cmi.suspend_data'); }
    else { try { texto = window.localStorage.getItem(CLAVE) || ''; } catch (e) { texto = ''; } }
    if (!texto) { return null; }
    try { return JSON.parse(texto); } catch (e) { return null; }
  }
  function guardarEstado(estado, resumen) {
    var texto = JSON.stringify(estado);
    if (iniciado) {
      escribir('cmi.suspend_data', texto);
      escribir('cmi.core.lesson_location', resumen.pagina);
      escribir('cmi.core.score.min', 0);
      escribir('cmi.core.score.max', 100);
      escribir('cmi.core.score.raw', resumen.nota);
      escribir('cmi.core.lesson_status', resumen.completo ? 'completed' : 'incomplete');
      confirmar();
    } else {
      try { window.localStorage.setItem(CLAVE, texto); } catch (e) { /* almacenamiento no disponible */ }
    }
  }
  function terminar(completo) {
    if (!iniciado || terminado) { return; }
    escribir('cmi.core.session_time', tiempoSesion());
    escribir('cmi.core.exit', completo ? '' : 'suspend');
    confirmar();
    try { api.LMSFinish(''); } catch (e) { /* sin plataforma */ }
    terminado = true;
  }
  return {
    iniciar: iniciar, cargarEstado: cargarEstado, guardarEstado: guardarEstado, terminar: terminar,
    conPlataforma: function () { return iniciado; },
    paginaGuardada: function () { return iniciado ? leer('cmi.core.lesson_location') : ''; }
  };
})();
