(function () {
  'use strict';
  var PAGES = {
    gerant: null, // toutes les pages
    praticien: ['Accueil', 'M', 'L', 'K'],
    secretaire: ['Accueil', 'H', 'J', 'K']
  };
  var ROLE_LABEL = { gerant: 'Gérant', praticien: 'Praticien', secretaire: 'Secrétariat' };
  var KEY = 'lk-session';
  var cur = (location.pathname.split('/').pop() || 'Accueil.dc.html').replace('.dc.html', '') || 'Accueil';
  var A = window.LKACCES || { iter: 120000, comptes: [] };

  function getS() { try { var s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); return s && A.comptes[s.i] ? s : null; } catch (e) { return null; } }
  function setS(i) { try { sessionStorage.setItem(KEY, JSON.stringify({ i: i, t: Date.now() })); } catch (e) {} }
  function clearS() { try { sessionStorage.removeItem(KEY); } catch (e) {} }
  function fails() { try { return JSON.parse(sessionStorage.getItem('lk-fails') || '{"n":0,"t":0}'); } catch (e) { return { n: 0, t: 0 }; } }
  function setFails(f) { try { sessionStorage.setItem('lk-fails', JSON.stringify(f)); } catch (e) {} }

  var sess = getS();
  var acc = sess ? A.comptes[sess.i] : null;
  function allowed(page) { if (!acc) { return false; } var l = PAGES[acc.role]; return l === null || l.indexOf(page) >= 0; }

  window.LKAUTH = {
    allowed: allowed,
    user: function () { return acc; },
    prIndex: function () { return acc && acc.role === 'praticien' ? acc.pr : -1; },
    logout: function () { clearS(); location.href = 'Accueil.dc.html'; }
  };

  var css = 'html.lk-lock body{visibility:hidden!important}' +
    '#lk-gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(ellipse at 50% 40%,#0c3a35 0%,#07201d 45%,#050a09 85%);font-family:"DM Sans",system-ui,sans-serif;color:#fff;overflow:auto}' +
    '#lk-gate form,#lk-gate .box{width:100%;max-width:400px;background:#fff;color:#14201D;border-radius:18px;padding:28px 26px;box-shadow:0 30px 90px rgba(0,0,0,.55);display:flex;flex-direction:column;gap:14px}' +
    '#lk-gate img{width:56px;height:56px;border-radius:14px;align-self:center}' +
    '#lk-gate h1{margin:0;font-size:22px;text-align:center}#lk-gate p{margin:0;font-size:14px;color:#4A5B57;line-height:1.5;text-align:center}' +
    '#lk-gate label{font-size:13px;font-weight:700;color:#33433F;display:flex;flex-direction:column;gap:6px}' +
    '#lk-gate input{min-height:46px;box-sizing:border-box;border:1px solid #C9D6D2;border-radius:10px;padding:0 14px;font-size:16px;font-family:inherit}' +
    '#lk-gate input:focus{outline:2px solid #0F766E;border-color:#0F766E}' +
    '#lk-gate button,#lk-gate a.b{min-height:46px;border:0;border-radius:10px;background:#0F766E;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;text-decoration:none}' +
    '#lk-gate a.b.s,#lk-gate button.s{background:#EFF3F2;color:#14201D}' +
    '#lk-gate button:disabled{opacity:.6;cursor:default}' +
    '#lk-err{min-height:20px;font-size:13px;color:#A3231A;text-align:center}' +
    '#lk-gate .note{font-size:12px;color:#6B7B77}' +
    '#lk-who{position:fixed;right:12px;bottom:12px;z-index:9500;background:#14201D;color:#fff;border-radius:999px;padding:6px 8px 6px 14px;font:500 13px "DM Sans",system-ui,sans-serif;display:flex;align-items:center;gap:10px;box-shadow:0 6px 20px rgba(0,0,0,.3)}' +
    '#lk-who button{background:#0F766E;color:#fff;border:0;border-radius:999px;min-height:32px;padding:0 12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}';

  function style() { var s = document.createElement('style'); s.textContent = css; (document.head || document.documentElement).appendChild(s); }
  function el(html) { var d = document.createElement('div'); d.id = 'lk-gate'; d.innerHTML = html; document.documentElement.appendChild(d); return d; }
  function hex(b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function unhex(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) { a[i] = parseInt(h.substr(i * 2, 2), 16); } return a; }
  var enc = new TextEncoder();
  function sha256(t) { return crypto.subtle.digest('SHA-256', enc.encode(t)).then(hex); }
  function derive(email, code, c) {
    return crypto.subtle.importKey('raw', enc.encode(email + '\n' + code), 'PBKDF2', false, ['deriveBits']).then(function (k) {
      return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(c.s), iterations: A.iter }, k, 256);
    }).then(hex);
  }

  function showLogin() {
    style();
    document.documentElement.classList.add('lk-lock');
    var g = el('<form id="lk-form" autocomplete="on"><img src="icon-512.png" alt=""><h1>Dental Clinic Laeken</h1><p>Accès réservé : gérant, praticiens et secrétariat. Entrez votre e-mail et votre code secret.</p>' +
      '<label>Adresse e-mail<input id="lk-mail" type="email" name="email" autocomplete="username" required inputmode="email"></label>' +
      '<label>Code secret<input id="lk-code" type="password" name="password" autocomplete="current-password" required></label>' +
      '<div id="lk-err" role="alert"></div><button id="lk-go" type="submit">Se connecter</button>' +
      '<div class="note">Maquette à données fictives. Code oublié : demandez-en un nouveau au gérant.</div></form>');
    var f = g.querySelector('#lk-form'); var err = g.querySelector('#lk-err'); var btn = g.querySelector('#lk-go');
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fl = fails(); var wait = fl.n >= 5 ? Math.ceil((fl.t + 30000 - Date.now()) / 1000) : 0;
      if (wait > 0) { err.textContent = 'Trop d\'essais. Patientez ' + wait + ' secondes.'; return; }
      if (fl.n >= 5) { fl = { n: 0, t: 0 }; setFails(fl); }
      if (!window.crypto || !crypto.subtle) { err.textContent = 'Ce navigateur ne permet pas la connexion sécurisée (HTTPS requis).'; return; }
      var email = g.querySelector('#lk-mail').value.trim().toLowerCase();
      var code = g.querySelector('#lk-code').value.trim().toUpperCase();
      btn.disabled = true; btn.textContent = 'Vérification…'; err.textContent = '';
      sha256(email).then(function (e) {
        var idx = -1; A.comptes.forEach(function (c, i) { if (c.e === e.slice(0, 12)) { idx = i; } });
        if (idx < 0) { return derive(email, code, { s: '00' }).then(function () { return -1; }); }
        return derive(email, code, A.comptes[idx]).then(function (h) { return h === A.comptes[idx].h ? idx : -1; });
      }).then(function (idx) {
        if (idx >= 0) { setFails({ n: 0, t: 0 }); setS(idx); location.reload(); return; }
        var n = fails(); n.n += 1; n.t = Date.now(); setFails(n);
        err.textContent = 'E-mail ou code secret incorrect.'; btn.disabled = false; btn.textContent = 'Se connecter';
      }).catch(function () { err.textContent = 'Connexion impossible dans ce navigateur.'; btn.disabled = false; btn.textContent = 'Se connecter'; });
    });
    setTimeout(function () { var m = document.getElementById('lk-mail'); if (m) { m.focus(); } }, 50);
  }

  function showDenied() {
    style();
    document.documentElement.classList.add('lk-lock');
    el('<div class="box"><img src="icon-512.png" alt=""><h1>Accès non autorisé</h1><p>Cette page n\'est pas prévue pour votre profil (' + ROLE_LABEL[acc.role] + ').</p><a class="b" href="Accueil.dc.html">Retour à l\'accueil</a><button class="s" id="lk-out">Se déconnecter</button></div>');
    document.getElementById('lk-out').onclick = window.LKAUTH.logout;
  }

  function badge() {
    var b = document.createElement('div'); b.id = 'lk-who';
    b.innerHTML = '<span></span><button type="button">Se déconnecter</button>';
    b.firstChild.textContent = acc.n;
    b.lastChild.onclick = window.LKAUTH.logout;
    document.body.appendChild(b);
  }

  function filterLinks() {
    var a = document.querySelectorAll('a[href$=".dc.html"]');
    for (var i = 0; i < a.length; i++) {
      var p = (a[i].getAttribute('href') || '').split('/').pop().replace('.dc.html', '');
      if (p && !allowed(p) && a[i].style.display !== 'none') { a[i].style.display = 'none'; }
    }
    var sec = document.querySelectorAll('section');
    for (var j = 0; j < sec.length; j++) {
      var links = sec[j].querySelectorAll('a[href$=".dc.html"]');
      if (links.length && Array.prototype.every.call(links, function (x) { return x.style.display === 'none'; }) && !sec[j].querySelector('table,svg')) { sec[j].style.display = 'none'; }
    }
  }

  if (!acc) { showLogin(); return; }
  if (!allowed(cur)) { showDenied(); return; }
  function ready() {
    badge(); filterLinks();
    if (window.MutationObserver) { var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(filterLinks, 80); }).observe(document.body, { childList: true, subtree: true }); }
  }
  if (document.body) { ready(); } else { document.addEventListener('DOMContentLoaded', ready); }
})();
