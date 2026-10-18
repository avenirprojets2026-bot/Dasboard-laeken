(function () {
  var G = [
    ['Gérant', [['Vue cabinet', 'Main'], ['Résultat du gérant', 'D'], ['Rémunérations et paiements', 'E'], ['Fauteuils et coût par patient', 'F'], ['Mutuelles et labo', 'C'], ['Envoi aux praticiens', 'N'], ['Corilus', 'O'], ['Accès et rôles', 'P'], ['Tableau interactif', 'G']]],
    ['Accueil et caisse', [['Patients et paiements', 'H'], ['Import et export', 'J']]],
    ['Praticien', [['Casier praticien', 'B'], ['Espace praticien', 'M'], ['Patients vus par praticien', 'L'], ['Actes par praticien', 'I']]],
    ['Références', [['Nomenclature INAMI', 'K']]]
  ];
  var IC = {
    Accueil: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>',
    Main: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    D: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15l4-4 3 3 5-6"/>',
    E: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    F: '<path d="M6 4v9a4 4 0 0 0 4 4h4"/><path d="M14 17v3"/><path d="M10 20h8"/><path d="M6 8h6"/>',
    C: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
    N: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    O: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
    P: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    G: '<path d="M4 6h16M4 12h10M4 18h6"/><circle cx="18" cy="15" r="3"/>',
    H: '<path d="M4 7h16v10H4z"/><path d="M4 11h16"/><path d="M8 15h3"/>',
    J: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/>',
    B: '<path d="M4 4h16v16H4z"/><path d="M4 9h16"/><path d="M9 9v11"/>',
    M: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    L: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    I: '<path d="M9 5h11M9 12h11M9 19h11"/><circle cx="4.5" cy="5" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="19" r="1"/>',
    K: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h11"/>'
  };
  var ic = function (k) { return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[k] || '') + '</svg>'; };
  var cur = (location.pathname.split('/').pop() || '').replace('.dc.html', '');
  var curName = (cur === 'Accueil' || cur === '' || cur === 'index') ? 'Accueil' : 'Menu';
  var html = '<a class="lk-i' + (cur === 'Accueil' || cur === '' || cur === 'index' ? ' on' : '') + '" href="Accueil.dc.html">' + ic('Accueil') + '<span>Accueil</span></a>';
  var okp = function (p) { return !window.LKAUTH || window.LKAUTH.allowed(p); };
  G.forEach(function (g) {
    var vis = g[1].filter(function (it) { return okp(it[1]); });
    if (!vis.length) { return; }
    html += '<div class="lk-g">' + g[0] + '</div>';
    vis.forEach(function (it) {
      var on = it[1] === cur; if (on) curName = it[0];
      html += '<a class="lk-i' + (on ? ' on' : '') + '" href="' + it[1] + '.dc.html"' + (on ? ' aria-current="page"' : '') + '>' + ic(it[1]) + '<span>' + it[0] + '</span></a>';
    });
  });
  var css = 'nav[aria-label="Vues"]{display:none!important}' +
    '#lk-side{position:fixed;top:0;left:0;bottom:0;width:256px;background:linear-gradient(180deg,#0E1C19 0%,#122421 55%,#0F1F1C 100%);color:#fff;overflow-y:auto;z-index:9000;padding:22px 14px 90px;box-sizing:border-box;font-family:"DM Sans",sans-serif;border-right:1px solid rgba(255,255,255,.06);scrollbar-width:thin;scrollbar-color:#2A3D39 transparent}' +
    '#lk-side .lk-t{display:flex;align-items:center;gap:12px;margin:0 6px 22px;line-height:1.2}' +
    '#lk-side .lk-t img{width:38px;height:38px;border-radius:10px;outline:1px solid rgba(243,221,166,.35);box-shadow:0 6px 18px -6px rgba(0,0,0,.6)}' +
    '#lk-side .lk-t b{display:block;font-family:Fraunces,Georgia,serif;font-weight:600;font-size:16px;letter-spacing:-.01em}' +
    '#lk-side .lk-t small{display:block;font-size:11.5px;color:#8FB3AB;margin-top:2px}' +
    '#lk-side .lk-g{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#6F948C;margin:20px 10px 6px}' +
    '#lk-side .lk-i{position:relative;display:flex;align-items:center;gap:11px;color:#C9DBD7;text-decoration:none;font-size:14px;padding:9px 12px;border-radius:10px;margin-bottom:1px;transition:background .15s,color .15s}' +
    '#lk-side .lk-i svg{flex:none;opacity:.75}' +
    '#lk-side .lk-i:hover{background:rgba(255,255,255,.06);color:#fff}' +
    '#lk-side .lk-i.on{background:linear-gradient(90deg,rgba(20,150,138,.32),rgba(20,150,138,.10));color:#fff;font-weight:700}' +
    '#lk-side .lk-i.on svg{opacity:1;color:#5EE0CF}' +
    '#lk-side .lk-i.on:before{content:"";position:absolute;left:-14px;top:8px;bottom:8px;width:3px;border-radius:0 3px 3px 0;background:#2DD4BF}' +
    '#lk-bar{display:none;position:fixed;top:0;left:0;right:0;height:58px;background:rgba(14,28,25,.94);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#fff;align-items:center;gap:12px;padding:0 14px;z-index:9001;font-family:"DM Sans",sans-serif;box-sizing:border-box;border-bottom:1px solid rgba(255,255,255,.06)}' +
    '#lk-bar img{width:32px;height:32px;border-radius:8px}#lk-bar b{flex:1;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#lk-bar button{background:#0F766E;color:#fff;border:0;border-radius:10px;min-height:40px;padding:0 16px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit}' +
    '@media(min-width:1000px){body{padding-left:256px!important}}' +
    '@media(max-width:999px){#lk-bar{display:flex}#lk-side{display:none;top:58px;width:100%;max-width:340px;box-shadow:12px 0 40px rgba(0,0,0,.4)}#lk-side.open{display:block}#lk-side .lk-t{display:none}body{padding-top:58px!important}}';
  function init() {
    var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    var side = document.createElement('aside'); side.id = 'lk-side'; side.innerHTML = '<div class="lk-t"><img src="icon-512.png?v=2" alt=""><div><b>Dental Clinic Laeken</b><small>Comptabilité du cabinet</small></div></div>' + html;
    var bar = document.createElement('div'); bar.id = 'lk-bar'; bar.innerHTML = '<img src="icon-512.png?v=2" alt=""><b>' + curName + '</b><button type="button">Menu</button>';
    bar.querySelector('button').onclick = function () { side.classList.toggle('open'); };
    document.body.appendChild(side); document.body.appendChild(bar);
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
