/* UD2. Navegación, actividades y registro del progreso. */
(function () {
  'use strict';
  var $ = function (sel, raiz) { return (raiz || document).querySelector(sel); };
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  var paginas = $$('main > section.pagina');
  var enlaces = $$('#indice a[data-idx]');
  var actividades = $$('.actividad[data-id]');
  var estado = { v: 1, vis: '', act: {}, pos: 0 };
  var actual = -1;

  /* ---------- Estado ---------- */
  function vista(i) { return estado.vis.charAt(i) === '1'; }
  function marcarVista(i) {
    var v = estado.vis;
    while (v.length < paginas.length) { v += '0'; }
    estado.vis = v.substring(0, i) + '1' + v.substring(i + 1);
  }
  function resumen() {
    var vistas = 0, hechas = 0, puntos = 0, i;
    for (i = 0; i < paginas.length; i++) { if (vista(i)) { vistas++; } }
    actividades.forEach(function (a) {
      var r = estado.act[a.getAttribute('data-id')];
      if (r) { hechas++; puntos += r.n; }
    });
    var nota = actividades.length ? Math.round(puntos / actividades.length * 100) : 0;
    return {
      vistas: vistas, hechas: hechas, puntos: puntos, nota: nota,
      completo: vistas === paginas.length && hechas === actividades.length,
      pagina: actual >= 0 ? paginas[actual].id : ''
    };
  }
  function guardar() {
    estado.pos = actual;
    Plataforma.guardarEstado(estado, resumen());
    pintarProgreso();
  }

  /* ---------- Navegación ---------- */
  function ir(i, opciones) {
    if (i < 0 || i >= paginas.length) { return; }
    opciones = opciones || {};
    if (actual >= 0) { paginas[actual].classList.remove('activa'); }
    actual = i;
    var pag = paginas[i];
    pag.classList.add('activa');
    marcarVista(i);
    enlaces.forEach(function (a) {
      var idx = Number(a.getAttribute('data-idx'));
      if (idx === i) {
        a.setAttribute('aria-current', 'page');
        var grupo = a.closest('details');
        if (grupo) { grupo.open = true; }
        if (!opciones.silencio && a.scrollIntoView) { a.scrollIntoView({ block: 'nearest' }); }
      } else { a.removeAttribute('aria-current'); }
    });
    $('#btn-ant').disabled = i === 0;
    $('#btn-sig').disabled = i === paginas.length - 1;
    $('#btn-ant').title = i > 0 ? paginas[i - 1].getAttribute('data-titulo') : '';
    $('#btn-sig').title = i < paginas.length - 1 ? paginas[i + 1].getAttribute('data-titulo') : '';
    $('#pie-donde').textContent = pag.getAttribute('data-titulo');
    document.title = pag.getAttribute('data-titulo') + ' | UD2. Análisis de incidentes de ciberseguridad';
    try { window.history.replaceState(null, '', '#' + pag.id); } catch (e) { /* sin historial */ }
    window.scrollTo(0, 0);
    $('#indice').classList.remove('abierto');
    $('#btn-indice').setAttribute('aria-expanded', 'false');
    if (!opciones.silencio) { $('#contenido').focus({ preventScroll: true }); }
    if (pag.id === 'progreso') { pintarPaginaProgreso(); }
    guardar();
  }
  function indiceDe(id) {
    for (var i = 0; i < paginas.length; i++) { if (paginas[i].id === id) { return i; } }
    return -1;
  }

  function pintarProgreso() {
    var r = resumen();
    $('#prog-texto').textContent = r.vistas + ' de ' + paginas.length + ' páginas vistas';
    $('#prog-barra').value = Math.round(r.vistas / paginas.length * 100);
    enlaces.forEach(function (a) {
      a.classList.toggle('vista', vista(Number(a.getAttribute('data-idx'))));
    });
    $$('#indice details').forEach(function (d) {
      var hijos = $$('a[data-idx]', d), n = 0;
      hijos.forEach(function (a) { if (vista(Number(a.getAttribute('data-idx')))) { n++; } });
      var c = $('.cuenta', d);
      if (c) { c.textContent = n + '/' + hijos.length; }
    });
  }

  function pintarPaginaProgreso() {
    var r = resumen();
    $('#res-paginas').innerHTML = r.vistas + ' <small>de ' + paginas.length + '</small>';
    $('#res-actividades').innerHTML = r.hechas + ' <small>de ' + actividades.length + '</small>';
    $('#res-nota').innerHTML = r.nota + ' <small>sobre 100</small>';
    var filas = $$('#prog-tabla tr[data-modulo]');
    filas.forEach(function (tr) {
      var m = tr.getAttribute('data-modulo');
      var pags = paginas.filter(function (p) { return p.getAttribute('data-modulo') === m; });
      var vistas = pags.filter(function (p) { return vista(paginas.indexOf(p)); }).length;
      var acts = actividades.filter(function (a) { return a.getAttribute('data-modulo') === m; });
      var hechas = 0, puntos = 0;
      acts.forEach(function (a) { var x = estado.act[a.getAttribute('data-id')]; if (x) { hechas++; puntos += x.n; } });
      $('.c-pag', tr).textContent = vistas + ' de ' + pags.length;
      $('.c-act', tr).textContent = acts.length ? hechas + ' de ' + acts.length : 'No tiene';
      $('.c-pun', tr).textContent = !acts.length ? '' : (hechas ? (Math.round(puntos * 100) / 100).toString().replace('.', ',') + ' de ' + acts.length : 'Sin responder');
    });
    var e = $('#res-estado');
    if (r.completo) {
      e.innerHTML = '<strong class="estado-ok">Unidad completada.</strong> Has visto todas las páginas y has respondido todas las actividades.';
    } else {
      var faltan = [];
      if (r.vistas < paginas.length) { faltan.push((paginas.length - r.vistas) + ' páginas por ver'); }
      if (r.hechas < actividades.length) { faltan.push((actividades.length - r.hechas) + ' actividades por responder'); }
      e.innerHTML = '<strong>Unidad en curso.</strong> Te quedan ' + faltan.join(' y ') + '.';
    }
    $('#res-donde').textContent = Plataforma.conPlataforma()
      ? 'Tu progreso y tu nota se guardan en la plataforma del curso.'
      : 'Estás viendo la unidad fuera de la plataforma: el progreso se guarda solo en este navegador.';
  }

  /* ---------- Actividades de test ---------- */
  function prepararTest(act) {
    var id = act.getAttribute('data-id');
    var opciones = $$('.opcion', act);
    var boton = $('.comprobar', act), salida = $('.act-resultado', act), aviso = $('.act-aviso', act);
    function mostrar(elegida, guardarla) {
      act.classList.add('respondida');
      opciones.forEach(function (o, i) {
        var correcta = o.getAttribute('data-correcta') === '1';
        o.classList.add(correcta ? 'es-correcta' : 'es-incorrecta');
        var inp = $('input', o);
        inp.disabled = true;
        if (i === elegida) { o.classList.add('elegida'); inp.checked = true; }
      });
      var bien = opciones[elegida].getAttribute('data-correcta') === '1';
      salida.textContent = bien ? 'Respuesta correcta. Repasa también por qué fallan las demás opciones.'
        : 'Respuesta incorrecta. Lee la retroalimentación de tu opción y la de la opción correcta.';
      boton.hidden = true;
      if (aviso) { aviso.textContent = ''; }
      if (guardarla) { estado.act[id] = { n: bien ? 1 : 0, r: String(elegida) }; guardar(); }
    }
    boton.addEventListener('click', function () {
      var elegida = -1;
      opciones.forEach(function (o, i) { if ($('input', o).checked) { elegida = i; } });
      if (elegida < 0) { if (aviso) { aviso.textContent = 'Elige una opción antes de comprobar.'; } return; }
      mostrar(elegida, true);
    });
    var previo = estado.act[id];
    if (previo) { mostrar(Number(previo.r), false); }
  }

  /* ---------- Actividades de clasificar y emparejar ---------- */
  function prepararAsignar(act) {
    var id = act.getAttribute('data-id');
    var origen = $('.fichas', act);
    var fichas = $$('.ficha', act);
    var destinos = $$('.destino', act);
    var unico = act.getAttribute('data-tipo') === 'emparejar';
    var comprobar = $('.comprobar', act), reiniciar = $('.reiniciar', act), solucion = $('.solucion', act);
    var salida = $('.act-resultado', act), retro = $('.retro-lista', act);
    var elegida = null, bloqueada = false;

    function hueco(d) { return $('.destino-hueco', d); }
    function soltarSeleccion() {
      if (elegida) { elegida.setAttribute('aria-pressed', 'false'); }
      elegida = null;
      destinos.forEach(function (d) { d.classList.remove('listo'); });
      origen.classList.remove('listo');
    }
    function elegir(f) {
      if (bloqueada) { return; }
      if (elegida === f) { soltarSeleccion(); return; }
      soltarSeleccion();
      elegida = f; f.setAttribute('aria-pressed', 'true');
      destinos.forEach(function (d) { d.classList.add('listo'); });
    }
    function colocar(f, d) {
      if (bloqueada) { return; }
      if (d) {
        var h = hueco(d);
        if (unico && h.firstElementChild && h.firstElementChild !== f) { origen.appendChild(h.firstElementChild); }
        h.appendChild(f);
      } else { origen.appendChild(f); }
      soltarSeleccion();
      comprobar.disabled = $$('.ficha', origen).length > 0;
    }
    function colocacion() {
      return fichas.map(function (f) {
        var d = f.closest('.destino');
        return d ? Number(d.getAttribute('data-d')) : -1;
      });
    }
    function corregir(guardarla) {
      var aciertos = 0;
      fichas.forEach(function (f) {
        var d = f.closest('.destino');
        var bien = d && d.getAttribute('data-d') === f.getAttribute('data-destino');
        f.classList.remove('bien', 'mal');
        f.classList.add(bien ? 'bien' : 'mal');
        f.disabled = true; f.draggable = false;
        var li = $('li[data-i="' + f.getAttribute('data-i') + '"]', retro);
        if (li) { li.classList.remove('bien', 'mal'); li.classList.add(bien ? 'bien' : 'mal'); }
        if (bien) { aciertos++; }
      });
      bloqueada = true;
      retro.hidden = false;
      comprobar.hidden = true; reiniciar.hidden = false; solucion.hidden = aciertos === fichas.length;
      var primero = estado.act[id];
      if (guardarla && !primero) {
        estado.act[id] = { n: Math.round(aciertos / fichas.length * 1000) / 1000, r: colocacion().join(',') };
        guardar();
        salida.textContent = aciertos + ' de ' + fichas.length + ' en su sitio. Este es el intento que puntúa.';
      } else if (guardarla) {
        salida.textContent = aciertos + ' de ' + fichas.length + ' en este intento de práctica. La nota registrada es la del primer intento.';
      } else {
        salida.textContent = 'Tu primer intento: ' + aciertos + ' de ' + fichas.length + ' en su sitio.';
      }
    }
    function restablecer() {
      bloqueada = false;
      fichas.forEach(function (f) { f.classList.remove('bien', 'mal'); f.disabled = false; f.draggable = true; origen.appendChild(f); });
      retro.hidden = true; comprobar.hidden = false; comprobar.disabled = true; reiniciar.hidden = true; solucion.hidden = true;
      salida.textContent = '';
    }

    fichas.forEach(function (f) {
      f.addEventListener('click', function () {
        if (bloqueada) { return; }
        if (f.parentNode !== origen && !elegida) { colocar(f, null); return; }
        elegir(f);
      });
      f.addEventListener('dragstart', function (e) {
        if (bloqueada) { e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', f.getAttribute('data-i'));
        e.dataTransfer.effectAllowed = 'move';
        elegir(f);
      });
    });
    function alSoltar(zona, d) {
      zona.addEventListener('dragover', function (e) { if (!bloqueada) { e.preventDefault(); zona.classList.add('encima'); } });
      zona.addEventListener('dragleave', function () { zona.classList.remove('encima'); });
      zona.addEventListener('drop', function (e) {
        e.preventDefault(); zona.classList.remove('encima');
        var i = e.dataTransfer.getData('text/plain');
        var f = $('.ficha[data-i="' + i + '"]', act);
        if (f) { colocar(f, d); }
      });
    }
    destinos.forEach(function (d) {
      d.addEventListener('click', function (e) {
        if (bloqueada || !elegida) { return; }
        if (e.target.closest('.ficha')) { return; }
        colocar(elegida, d);
      });
      d.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && elegida && e.target === d) { e.preventDefault(); colocar(elegida, d); }
      });
      alSoltar(d, d);
    });
    alSoltar(origen, null);
    comprobar.addEventListener('click', function () { corregir(true); });
    reiniciar.addEventListener('click', restablecer);
    solucion.addEventListener('click', function () {
      bloqueada = false;
      fichas.forEach(function (f) {
        var d = destinos[Number(f.getAttribute('data-destino'))];
        hueco(d).appendChild(f);
        f.classList.remove('mal'); f.classList.add('bien');
      });
      bloqueada = true; solucion.hidden = true;
      salida.textContent = 'Esta es la solución. La nota registrada es la del primer intento.';
    });

    var previo = estado.act[id];
    if (previo && previo.r) {
      previo.r.split(',').forEach(function (d, i) {
        if (Number(d) >= 0 && fichas[i] && destinos[Number(d)]) { hueco(destinos[Number(d)]).appendChild(fichas[i]); }
      });
      comprobar.disabled = false;
      corregir(false);
    }
  }

  /* ---------- Utilidades de la interfaz ---------- */
  function prepararCopia() {
    $$('.codigo-barra button').forEach(function (b) {
      b.addEventListener('click', function () {
        var pre = b.closest('.codigo-caja').querySelector('pre');
        var texto = pre.textContent;
        var hecho = function () { b.textContent = 'Copiado'; window.setTimeout(function () { b.textContent = 'Copiar'; }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(texto).then(hecho, function () { copiaClasica(texto); hecho(); });
        } else { copiaClasica(texto); hecho(); }
      });
    });
  }
  function copiaClasica(texto) {
    var t = document.createElement('textarea');
    t.value = texto; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch (e) { /* sin portapapeles */ }
    document.body.removeChild(t);
  }

  /* ---------- Arranque ---------- */
  function arrancar() {
    Plataforma.iniciar();
    var previo = Plataforma.cargarEstado();
    if (previo && previo.v === 1) {
      estado.vis = typeof previo.vis === 'string' ? previo.vis.substring(0, paginas.length) : '';
      estado.act = previo.act && typeof previo.act === 'object' ? previo.act : {};
      estado.pos = typeof previo.pos === 'number' ? previo.pos : 0;
    }
    actividades.forEach(function (a) {
      if (a.getAttribute('data-tipo') === 'test') { prepararTest(a); } else { prepararAsignar(a); }
    });
    prepararCopia();

    enlaces.forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); ir(Number(a.getAttribute('data-idx'))); });
    });
    $$('[data-ir]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); ir(indiceDe(b.getAttribute('data-ir'))); });
    });
    $('#btn-ant').addEventListener('click', function () { ir(actual - 1); });
    $('#btn-sig').addEventListener('click', function () { ir(actual + 1); });
    $('#btn-indice').addEventListener('click', function () {
      var abierto = $('#indice').classList.toggle('abierto');
      $('#btn-indice').setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { $('#indice').classList.remove('abierto'); $('#btn-indice').setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('click', function (e) {
      var nav = $('#indice');
      if (nav.classList.contains('abierto') && !e.target.closest('#indice') && !e.target.closest('#btn-indice')) {
        nav.classList.remove('abierto'); $('#btn-indice').setAttribute('aria-expanded', 'false');
      }
    });
    var imp = $('#btn-imprimir');
    if (imp) { imp.addEventListener('click', function () { window.open('imprimir.html', '_blank'); }); }
    window.addEventListener('hashchange', function () {
      var i = indiceDe(window.location.hash.replace('#', ''));
      if (i >= 0 && i !== actual) { ir(i); } else if (i >= 0) { window.scrollTo(0, 0); }
    });

    var destino = indiceDe(window.location.hash.replace('#', ''));
    if (destino < 0) { destino = indiceDe(Plataforma.paginaGuardada()); }
    if (destino < 0 && estado.pos > 0 && estado.pos < paginas.length) { destino = estado.pos; }
    ir(destino < 0 ? 0 : destino, { silencio: true });

    var salir = function () { guardar(); Plataforma.terminar(resumen().completo); };
    window.addEventListener('pagehide', salir);
    window.addEventListener('beforeunload', salir);
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', arrancar); } else { arrancar(); }
})();
