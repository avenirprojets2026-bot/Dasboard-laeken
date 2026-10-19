(function () {
  'use strict';
  var PAGES = {
    admin: null, // toutes les pages, plus la gestion des accès
    gerant: null, // toutes les pages
    praticien: ['Accueil', 'M', 'L', 'K'],
    secretaire: ['Accueil', 'H', 'J', 'K']
  };
  var ROLE_LABEL = { admin: 'Administrateur', gerant: 'Gérant', praticien: 'Praticien', secretaire: 'Secrétariat' };
  var KEY = 'lk-session';
  var cur = (location.pathname.split('/').pop() || 'Accueil.dc.html').replace('.dc.html', '') || 'Accueil';
  var A = window.LKACCES || { iter: 120000, comptes: [] };

  function getS() { try { var s = JSON.parse(sessionStorage.getItem(KEY) || 'null'); return s && A.comptes[s.i] ? s : null; } catch (e) { return null; } }
  function setS(i) { try { sessionStorage.setItem(KEY, JSON.stringify({ i: i, t: Date.now() })); } catch (e) {} }
  function clearS() { try { sessionStorage.removeItem(KEY); } catch (e) {} }
  function fails() { try { return JSON.parse(sessionStorage.getItem('lk-fails') || '{"n":0,"t":0}'); } catch (e) { return { n: 0, t: 0 }; } }
  function setFails(f) { try { sessionStorage.setItem('lk-fails', JSON.stringify(f)); } catch (e) {} }

  function ovKey(c) { return 'lk-ov-' + c.e; }
  function getOv(c) { try { var o = JSON.parse(localStorage.getItem(ovKey(c)) || 'null'); if (o && o.s && o.h && o.base === c.h) { return o; } if (o) { localStorage.removeItem(ovKey(c)); } return null; } catch (e) { return null; } }
  function setOv(c, o) { try { localStorage.setItem(ovKey(c), JSON.stringify(o)); return true; } catch (e) { return false; } }
  function currentCred(c) { return getOv(c) || c; }

  var sess = getS();
  var acc = sess ? A.comptes[sess.i] : null;
  function allowed(page) { if (!acc) { return false; } var l = PAGES[acc.role]; return l === null || l.indexOf(page) >= 0; }

  window.LKAUTH = {
    allowed: allowed,
    roles: function () { return JSON.parse(JSON.stringify(PAGES)); },
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
    '#lk-who{position:fixed;right:16px;bottom:16px;z-index:9500;background:rgba(15,30,27,.88);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);color:#fff;border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:6px 6px 6px 16px;font:500 13px "DM Sans",system-ui,sans-serif;display:flex;align-items:center;gap:8px;box-shadow:0 12px 32px -8px rgba(0,0,0,.35)}' +
    '@media(max-width:700px){#lk-who{right:10px;bottom:10px;padding:5px;gap:6px}#lk-who span{display:none}#lk-who button{min-height:34px;padding:0 12px;font-size:12.5px}body{padding-bottom:64px!important}}' +
    '#lk-who button.chg{background:rgba(255,255,255,.10)}#lk-who button{background:#0F766E;color:#fff;border:0;border-radius:999px;min-height:32px;padding:0 12px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}';

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
    var g = el('<form id="lk-form" autocomplete="on"><img src="icon-512.png?v=2" alt=""><h1>Dental Clinic Laeken</h1><p>Accès réservé : gérant, praticiens et secrétariat. Entrez votre e-mail et votre code secret.</p>' +
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
        var cr = currentCred(A.comptes[idx]);
        return derive(email, code, cr).then(function (h) { return h === cr.h ? idx : -1; });
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
    el('<div class="box"><img src="icon-512.png?v=2" alt=""><h1>Accès non autorisé</h1><p>Cette page n\'est pas prévue pour votre profil (' + ROLE_LABEL[acc.role] + ').</p><a class="b" href="Accueil.dc.html">Retour à l\'accueil</a><button class="s" id="lk-out">Se déconnecter</button></div>');
    document.getElementById('lk-out').onclick = window.LKAUTH.logout;
  }

  function randHex(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return hex(a); }

  function showChange() {
    style();
    var g = el('<form id="lk-form2"><img src="icon-512.png?v=2" alt=""><h1>Changer mon code secret</h1><p>Choisissez un nouveau code de 6 caractères (lettres et chiffres).</p>' +
      '<label>Adresse e-mail<input id="lk-m2" type="email" autocomplete="username" required inputmode="email"></label>' +
      '<label>Code actuel<input id="lk-c0" type="password" autocomplete="current-password" required></label>' +
      '<label>Nouveau code (6 caractères)<input id="lk-c1" type="password" autocomplete="new-password" required maxlength="6" minlength="6" pattern="[A-Za-z0-9]{6}"></label>' +
      '<label>Répétez le nouveau code<input id="lk-c2" type="password" autocomplete="new-password" required maxlength="6" minlength="6" pattern="[A-Za-z0-9]{6}"></label>' +
      '<div id="lk-err" role="alert"></div><button id="lk-go2" type="submit">Enregistrer le nouveau code</button><button type="button" class="s" id="lk-cancel">Annuler</button>' +
      '<div class="note">Le nouveau code est enregistré dans cet appareil et ce navigateur. Sur un autre appareil, le code d\'origine reste valable tant que le gérant n\'a pas fait régénérer les accès.</div></form>');
    g.querySelector('#lk-cancel').onclick = function () { g.remove(); };
    var err = g.querySelector('#lk-err'); var btn = g.querySelector('#lk-go2');
    g.querySelector('#lk-form2').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = g.querySelector('#lk-m2').value.trim().toLowerCase();
      var c0 = g.querySelector('#lk-c0').value.trim().toUpperCase();
      var c1 = g.querySelector('#lk-c1').value.trim().toUpperCase();
      var c2 = g.querySelector('#lk-c2').value.trim().toUpperCase();
      if (!/^[A-Z0-9]{6}$/.test(c1)) { err.textContent = 'Le nouveau code doit faire exactement 6 lettres ou chiffres.'; return; }
      if (c1 !== c2) { err.textContent = 'Les deux nouveaux codes ne sont pas identiques.'; return; }
      if (c1 === c0) { err.textContent = 'Choisissez un code différent de l\'actuel.'; return; }
      btn.disabled = true; err.textContent = '';
      var c = acc; var cr = currentCred(c);
      sha256(email).then(function (e) {
        if (e.slice(0, 12) !== c.e) { throw 'mail'; }
        return derive(email, c0, cr);
      }).then(function (h) {
        if (h !== cr.h) { throw 'code'; }
        var salt = randHex(16);
        return derive(email, c1, { s: salt }).then(function (nh) { if (!setOv(c, { s: salt, h: nh, base: c.h })) { throw 'store'; } });
      }).then(function () {
        err.style.color = '#0B6B3A'; err.textContent = 'Code modifié. Utilisez-le à la prochaine connexion.';
        setTimeout(function () { g.remove(); }, 1500);
      }).catch(function (x) {
        err.style.color = ''; btn.disabled = false;
        err.textContent = x === 'store' ? 'Impossible d\'enregistrer dans ce navigateur.' : 'E-mail ou code actuel incorrect.';
      });
    });
    setTimeout(function () { var m = document.getElementById('lk-m2'); if (m) { m.focus(); } }, 50);
  }

  function badge() {
    var b = document.createElement('div'); b.id = 'lk-who';
    b.innerHTML = '<span></span><button type="button" class="chg">Mon code</button><button type="button">Se déconnecter</button>';
    b.firstChild.textContent = acc.n + ' · ' + ROLE_LABEL[acc.role];
    b.querySelector('.chg').onclick = showChange;
    b.lastChild.onclick = window.LKAUTH.logout;
    document.body.appendChild(b);
  }

  function welcome() {
    var k = 'lk-welcome-' + acc.e;
    try { if (getOv(acc) || localStorage.getItem(k)) { return; } } catch (e) { return; }
    var done = function () { try { localStorage.setItem(k, '1'); } catch (e) {} };
    var g = el('<div class="box"><img src="icon-512.png?v=2" alt=""><h1>Bienvenue</h1><p>Vous êtes connecté avec le code qui vous a été remis. Pour plus de sécurité, vous pouvez choisir votre propre code de 6 caractères (lettres et chiffres).</p>' +
      '<button type="button" id="lk-wy">Choisir mon code</button><button type="button" class="s" id="lk-wn">Plus tard</button>' +
      '<div class="note">Vous pourrez le faire à tout moment avec le bouton « Mon code », en bas à droite.</div></div>');
    g.querySelector('#lk-wy').onclick = function () { done(); g.remove(); showChange(); };
    g.querySelector('#lk-wn').onclick = function () { done(); g.remove(); };
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
    style(); badge(); filterLinks(); welcome();
    if (window.MutationObserver) { var t; new MutationObserver(function () { clearTimeout(t); t = setTimeout(filterLinks, 80); }).observe(document.body, { childList: true, subtree: true }); }
  }
  if (document.body) { ready(); } else { document.addEventListener('DOMContentLoaded', ready); }
})();
