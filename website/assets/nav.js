/* FR Sportwagen – Mobiles Menü (Burger-Button + Seitenleiste).
   Wird wie der Sprachumschalter zentral auf allen Seiten eingebunden.
   Die Seitenleiste übernimmt die Links aus der Header-Navigation der jeweiligen
   Seite – neue Menüpunkte im Header erscheinen damit automatisch auch mobil.
   Seiten mit abweichendem Umbruchpunkt geben ihn per data-breakpoint am
   Script-Tag an (Standard: 640, Detailseiten: 820). */
(function () {
  var nav = document.querySelector('header nav');
  if (!nav) return;

  var script = document.currentScript;
  var bp = parseInt(script && script.getAttribute('data-breakpoint'), 10) || 640;

  var style = document.createElement('style');
  style.textContent =
    '.frnav-toggle,.frnav-close{display:none;background:none;border:none;color:#ffffff;cursor:pointer;padding:0;align-items:center;justify-content:center;}' +
    '.frnav-panel,.frnav-backdrop{display:none;}' +
    '@media (max-width: ' + bp + 'px){' +
      'header nav{gap:1rem;}' +
      '.frnav-toggle{display:flex;width:2.4rem;height:2.2rem;}' +
      '.frnav-backdrop{display:block;position:fixed;inset:0;background:rgba(0,0,0,0.55);opacity:0;visibility:hidden;transition:opacity 0.3s ease,visibility 0.3s ease;z-index:140;}' +
      '.frnav-panel{display:block;position:fixed;top:0;right:0;bottom:0;width:min(78vw,320px);background:rgba(10,10,10,0.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-left:1px solid rgba(255,255,255,0.1);padding:4.4rem 2rem 2.4rem;transform:translateX(100%);visibility:hidden;transition:transform 0.35s ease,visibility 0.35s ease;z-index:150;overflow-y:auto;outline:none;}' +
      'body.frnav-open .frnav-panel{transform:none;visibility:visible;}' +
      'body.frnav-open .frnav-backdrop{opacity:1;visibility:visible;}' +
      'body.frnav-open{overflow:hidden;}' +
      '.frnav-close{display:flex;position:absolute;top:1rem;right:1.5rem;width:2.4rem;height:2.4rem;color:#b5b5b5;transition:color 0.2s;}' +
      '.frnav-close:hover{color:#ffffff;}' +
      '.frnav-label{font-size:0.72rem;letter-spacing:0.3em;text-transform:uppercase;color:#8a8a8a;margin-bottom:0.6rem;}' +
      '.frnav-panel a{display:block;color:#d8d8d8;text-decoration:none;font-size:1rem;letter-spacing:0.04em;padding:0.85rem 0;border-bottom:1px solid rgba(255,255,255,0.09);transition:color 0.2s;}' +
      '.frnav-panel a:hover,.frnav-panel a.active{color:#ffffff;}' +
      '.frnav-panel a.cta{margin-top:1.8rem;border:1px solid rgba(255,255,255,0.4);border-radius:4px;text-align:center;padding:0.65rem 1.2rem;color:#ffffff;}' +
    '}' +
    /* Sehr schmale Displays: "Kontakt" steckt in der Seitenleiste, im Header wird der Platz knapp */
    '@media (max-width: 350px){header nav a.cta{display:none;}}' +
    '@media (prefers-reduced-motion: reduce){.frnav-panel,.frnav-backdrop{transition:none;}}';
  document.head.appendChild(style);

  /* Seitenleiste mit einer Kopie aller Nav-Links */
  var panel = document.createElement('div');
  panel.className = 'frnav-panel';
  panel.id = 'frnav-panel';
  panel.setAttribute('role', 'navigation');
  panel.setAttribute('aria-label', 'Mobiles Menü');
  panel.setAttribute('tabindex', '-1');

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'frnav-close';
  closeBtn.setAttribute('aria-label', 'Menü schließen');
  closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;"><path d="M6 6l12 12"/><path d="M18 6l-12 12"/></svg>';
  panel.appendChild(closeBtn);

  var label = document.createElement('p');
  label.className = 'frnav-label';
  label.textContent = 'Menü';
  panel.appendChild(label);

  var links = nav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    var a = document.createElement('a');
    a.href = links[i].getAttribute('href');
    a.textContent = links[i].textContent;
    a.className = links[i].className;
    panel.appendChild(a);
  }

  var backdrop = document.createElement('div');
  backdrop.className = 'frnav-backdrop';

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'frnav-toggle';
  toggle.setAttribute('aria-label', 'Menü öffnen');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'frnav-panel');
  toggle.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;"><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></svg>';

  nav.appendChild(toggle);
  document.body.appendChild(backdrop);
  document.body.appendChild(panel);

  function openMenu() {
    document.body.classList.add('frnav-open');
    toggle.setAttribute('aria-expanded', 'true');
    try { panel.focus({ preventScroll: true }); } catch (e) { panel.focus(); }
  }
  function closeMenu(focusToggle) {
    if (!document.body.classList.contains('frnav-open')) return;
    document.body.classList.remove('frnav-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (focusToggle) {
      try { toggle.focus({ preventScroll: true }); } catch (e) { toggle.focus(); }
    }
  }

  toggle.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', function () { closeMenu(true); });
  backdrop.addEventListener('click', function () { closeMenu(false); });
  panel.addEventListener('click', function (e) {
    var t = e.target;
    while (t && t !== panel) {
      if (t.nodeName === 'A') { closeMenu(false); return; }
      t = t.parentNode;
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') closeMenu(true);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > bp) closeMenu(false);
  });

  /* Der Sprachumschalter (i18n.js) hängt sich beim Laden ans Ende der Nav.
     Danach den Burger wieder ganz nach rechts rücken. */
  function toEnd() { nav.appendChild(toggle); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', toEnd);
  } else {
    toEnd();
  }
})();
