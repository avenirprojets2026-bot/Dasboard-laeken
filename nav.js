(function () {
  var G = [
    ['Gérant', [['Vue cabinet', 'Main'], ['Résultat du gérant', 'D'], ['Rémunérations et paiements', 'E'], ['Fauteuils et coût par patient', 'F'], ['Mutuelles et labo', 'C'], ['Tableau interactif', 'G']]],
    ['Accueil et caisse', [['Patients et paiements', 'H'], ['Import et export', 'J']]],
    ['Praticien', [['Casier praticien', 'B'], ['Espace praticien', 'M'], ['Patients vus par praticien', 'L'], ['Actes par praticien', 'I']]],
    ['Références', [['Nomenclature INAMI', 'K']]]
  ];
  var cur = (location.pathname.split('/').pop() || '').replace('.dc.html', '');
  var curName = 'Menu';
  var html = '<a class="lk-i" href="Accueil.dc.html">Accueil</a>';
  var okp = function (p) { return !window.LKAUTH || window.LKAUTH.allowed(p); };
  G.forEach(function (g) {
    var vis = g[1].filter(function (it) { return okp(it[1]); });
    if (!vis.length) { return; }
    html += '<div class="lk-g">' + g[0] + '</div>';
    vis.forEach(function (it) {
      var on = it[1] === cur; if (on) curName = it[0];
      html += '<a class="lk-i' + (on ? ' on' : '') + '" href="' + it[1] + '.dc.html">' + it[0] + '</a>';
    });
  });
  var css = 'nav[aria-label="Vues"]{display:none!important}' +
    '#lk-side{position:fixed;top:0;left:0;bottom:0;width:250px;background:#14201D;color:#fff;overflow-y:auto;z-index:9000;padding:20px 14px;box-sizing:border-box;font-family:"DM Sans",sans-serif}' +
    '#lk-side .lk-t{display:flex;align-items:center;gap:10px;font-weight:700;font-size:15px;margin:0 6px 18px;line-height:1.2}' +
    '#lk-side .lk-t img{width:36px;height:36px;border-radius:9px}' +
    '#lk-side .lk-g{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8FB3AB;margin:18px 8px 6px}' +
    '#lk-side .lk-i{display:block;color:#DCE8E5;text-decoration:none;font-size:14px;padding:11px 12px;border-radius:10px;margin-bottom:2px}' +
    '#lk-side .lk-i:hover{background:#22332F}#lk-side .lk-i.on{background:#0F766E;color:#fff;font-weight:700}' +
    '#lk-bar{display:none;position:fixed;top:0;left:0;right:0;height:56px;background:#14201D;color:#fff;align-items:center;gap:12px;padding:0 14px;z-index:9001;font-family:"DM Sans",sans-serif;box-sizing:border-box}' +
    '#lk-bar img{width:32px;height:32px;border-radius:8px}#lk-bar b{flex:1;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '#lk-bar button{background:#0F766E;color:#fff;border:0;border-radius:10px;min-height:40px;padding:0 16px;font-size:14px;font-weight:700;cursor:pointer}' +
    '@media(min-width:1000px){body{padding-left:250px!important}}' +
    '@media(max-width:999px){#lk-bar{display:flex}#lk-side{display:none;top:56px;width:100%;max-width:340px;box-shadow:6px 0 24px rgba(0,0,0,.35)}#lk-side.open{display:block}#lk-side .lk-t{display:none}body{padding-top:56px!important}}';
  function init() {
    var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
    var side = document.createElement('aside'); side.id = 'lk-side'; side.innerHTML = '<div class="lk-t"><img src="icon-512.png" alt="">Dental Clinic Laeken</div>' + html;
    var bar = document.createElement('div'); bar.id = 'lk-bar'; bar.innerHTML = '<img src="icon-512.png" alt=""><b>' + curName + '</b><button type="button">Menu</button>';
    bar.querySelector('button').onclick = function () { side.classList.toggle('open'); };
    document.body.appendChild(side); document.body.appendChild(bar);
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
