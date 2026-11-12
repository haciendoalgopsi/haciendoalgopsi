(function(){
  var mapa = {porque:"nosotros.html",servicios:"servicios.html",analistas:"analistas.html",actividades:"actividades.html",material:"actividades.html#material",publicaciones:"escritos.html",seminarios:"actividades.html#seminarios",contacto:"contacto.html"};
  var h = (location.hash||"").replace("#","");
  if (mapa[h]) location.replace(mapa[h]);
})();

  document.getElementById('navToggle').addEventListener('click', () =>
    document.getElementById('navLinks').classList.toggle('open'));
  document.querySelectorAll('#navLinks a').forEach(a =>
    a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open')));

  window.addEventListener('scroll', () => { document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 8); }, {passive:true});
  document.getElementById('waToggle').addEventListener('click', () =>
    document.getElementById('waMenu').classList.toggle('open'));

  function toggleServicio(card) {
    const panel = card.querySelector('.servicio-analistas');
    const arrow = card.querySelector('.servicio-arrow');
    const isOpen = panel.classList.contains('open');
    document.querySelectorAll('.servicio-analistas').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.servicio-arrow').forEach(a => a.textContent = 'Ver analistas ↓');
    if (!isOpen) { panel.classList.add('open'); arrow.textContent = 'Ocultar ↑'; }
  }

  function togglePubs(btn) {
    const panel = btn.closest('.analista-card').querySelector('.analista-pubs');
    const isOpen = panel.classList.contains('open');
    panel.classList.toggle('open');
    btn.textContent = isOpen ? 'Escritos ↓' : 'Ocultar ↑';
  }

  function actualizarBoton() {
    const ok = document.getElementById('f-analista').value && document.getElementById('f-motivo').value;
    document.getElementById('btnContacto').disabled = !ok;
  }
  document.getElementById('f-motivo').addEventListener('change', actualizarBoton);

  function trackWA(origen, analista) {
    try {
      const k = 'wa_clicks_' + origen + '_' + (analista || 'general');
      const n = parseInt(localStorage.getItem(k) || '0', 10) + 1;
      localStorage.setItem(k, String(n));
      if (window.gtag) window.gtag('event', 'whatsapp_click', {origen: origen, analista: analista || ''});
    } catch(e) {}
  }
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a[href*="wa.me/"]');
    if (!a) return;
    let origen = 'general';
    if (a.closest('.wa-menu')) origen = 'menu-flotante';
    else if (a.closest('.analista-card')) {
      const nm = a.closest('.analista-card').querySelector('.analista-name');
      origen = 'tarjeta-' + (nm ? nm.textContent.trim() : 'analista');
    }
    else if (a.closest('.contacto-dato')) origen = 'lista-contacto';
    else if (a.closest('.servicio-card') || a.closest('.servicio-analistas')) origen = 'servicio';
    const m = (a.href.match(/wa\.me\/(\d+)/) || [])[1] || '';
    trackWA(origen, m);
  });
  function enviarContactoWA() {
    const val = document.getElementById('f-analista').value;
    if (!val) return;
    const [numero, nombre] = val.split('|');
    const n = document.getElementById('f-nombre').value.trim() || 'sin nombre';
    const m = document.getElementById('f-motivo').value || 'no indicado';
    const msg = document.getElementById('f-mensaje').value.trim();
    if (!m) { alert("Elige el tipo de terapia (motivo) para que tu analista sepa cómo orientarte."); return; }
    let txt = `Hola ${nombre}, vengo de la página Haciendo Algo (Cancún).\n\n*Tipo de terapia que me interesa:* ${m}\n*Nombre:* ${n}`;
    if (msg) txt += `\n*Mensaje:* ${msg}`;
    trackWA('formulario-contacto', numero);
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(txt + '\n\n(Origen: página Haciendo Algo / formulario contacto)')}`, '_blank');
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  document.getElementById('yr').textContent = new Date().getFullYear();
  window.addEventListener('load', () => {
    const raw = window.location.href;
    const url = raw.split('?')[0].split('#')[0].replace(/\/colectivo-psa\.html$/, '/').replace(/\/$/, '') + '/';
    const qrUrl = url;
    document.getElementById('qrImg').src =
      'https://api.qrserver.com/v1/create-qr-code/?size=220x220&color=2E2925&bgcolor=F2EBE0&margin=10&data=' + encodeURIComponent(qrUrl);
    document.getElementById('qrUrl').textContent = qrUrl;
  });

  // origen incluye la página actual
  document.addEventListener('click', (ev) => {
    const pg = (location.pathname.split('/').pop() || 'index.html');
    const a = ev.target.closest && ev.target.closest('a[href*="wa.me/"]');
    if (!a || !a.href.includes('Origen')) {
      try {
        const m2 = a ? (a.href.match(/wa\.me\/(\d+)/)||[])[1] : '';
        if (a) { const k='wa_click_nolabel_'+pg; localStorage.setItem(k, String(parseInt(localStorage.getItem(k)||'0',10)+1)); }
      } catch(e) {}
    }
  });
  // estado activo del nav por si acaso
  (function(){ const p=(location.pathname.split('/').pop()||'index.html'); document.querySelectorAll('.nav-links a').forEach(a=>{ if(a.getAttribute('href')===p) a.classList.add('active'); }); })();