/* Jeu de données unique (fictif) : octobre 2026 (mois en cours, projection complète), tel que le modèle du cabinet.
   Total honoraires 173 100 €, 963 patients (pause de midi 12 h à 13 h déduite), frais de labo 28 600 €. */
(function () {
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var mul = function (a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  var WD = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  var MONTH = { m: 9, y: 2026, days: 31, label: 'Octobre 2026', today: 17 };
  var HOL = ['01/01', '06/04', '01/05', '14/05', '25/05', '21/07', '15/08', '01/11', '11/11', '25/12'];

  // Actes de la nomenclature INAMI : [code, libellé, honoraires, intervention préférentielle, intervention ordinaire]
  var ACT = {
    exam: function (a) { return a < 18 ? ['371615', 'Examen buccal préventif', 57.52, 57.52, 57.52] : (a < 19 ? ['371593', 'Examen buccal annuel', 82, 82, 82] : ['301593', 'Examen buccal annuel', 82, 82, 78]); },
    consult: function (a) { return a < 19 ? ['371011', 'Consultation au cabinet', 31.84, 31.84, 31.84] : ['301011', 'Consultation au cabinet', 31.84, 31.84, 25.84]; },
    consultO: function (a) { return a < 19 ? ['371092', 'Consultation orthodontiste', 32.87, 32.87, 32.87] : ['301092', 'Consultation orthodontiste', 32.87, 32.87, 26.87]; },
    obt: function (a) { return a < 15 ? ['373833', 'Obturation dent de lait, 2 faces', 78.07, 78.07, 78.07] : (a < 19 ? ['374393', 'Obturation, 2 faces', 59.58, 59.58, 59.58] : ['304393', 'Obturation, 2 faces', 59.58, 59.58, 50.08]); },
    detart: function (a) { return a < 19 ? ['372153', 'Détartrage, 4 quadrants', 71.92, 71.92, 71.92] : ['302153', 'Détartrage, 4 quadrants', 71.92, 71.92, 55.92]; },
    canal: function (a) { return a < 19 ? ['374555', 'Traitement de canal, 3 canaux', 201.84, 201.84, 201.84] : ['304555', 'Traitement de canal, 3 canaux', 201.84, 201.84, 189.34]; },
    extr: function (a) { return a < 19 ? ['374975', 'Extraction simple', 68.82, 68.82, 68.82] : ['304975', 'Extraction simple', 68.82, 68.82, 61.32]; },
    extrS: function (a) { return a < 19 ? ['371195', 'Extraction chirurgicale', 141.75, 141.75, 141.75] : ['301195', 'Extraction chirurgicale', 141.75, 119.75, 97.25]; },
    pano: function (a) { return a < 19 ? ['377311', 'Panoramique numérique', 67.8, 67.8, 67.8] : ['307311', 'Panoramique numérique', 67.8, 67.8, 67.8]; }
  };
  // Actes hors nomenclature : [libellé, prix de base, poids des frais de labo]
  var FREE = {
    couronne: ['Couronne céramique', 600, 1], bridge: ['Bridge 3 éléments', 1150, 1], facette: ['Facette', 420, 1],
    goutt: ['Gouttière', 190, 1], blanch: ['Blanchiment', 250, 0], implant: ['Pose d\'implant', 1100, 0.3],
    greffe: ['Greffe osseuse', 650, 0], couronneImpl: ['Couronne sur implant', 950, 1], appareil: ['Pose d\'appareil orthodontique', 1400, 0.5],
    ortho: ['Contrôle orthodontique', 70, 0], prothese: ['Prothèse amovible', 720, 1]
  };
  var MUT = ['Mutualités Chrétiennes', 'Solidaris', 'Partenamut', 'Mutualité Libérale', 'Mutualia', 'CAAMI', 'HR Rail'];

  // supRate = supplément d'honoraires appliqué sur les actes de la nomenclature (dentiste non conventionné) ; leaves = date de départ du praticien
  // N = patients du mois, T = honoraires facturés, LAB = frais de labo (modèle du cabinet), rate = taux de rétrocession (60 % par défaut, 50 % pour Touil)
  // Rémunération du praticien = (T − LAB) × rate ; part du cabinet = (T − LAB) × (1 − rate)
  var PR = [
    { name: 'Dr Aya Turkieh', short: 'Aya Turkieh', spec: 'Chirurgienne dentaire, implantologue et chirurgie orale', days: [1, 2, 3, 4, 5], N: 325, T: 50500, LAB: 7800, young: 0,
      mix: { exam: 3, consult: 2, obt: 4, canal: 2, extr: 1, extrS: 1, pano: 2, detart: 2, couronne: 1.5, implant: 0.45, greffe: 0.2, goutt: 0.3, blanch: 0.5, couronneImpl: 0.3 } },
    { name: 'Dr Mohamed Bochouari', short: 'Mohamed Bochouari', spec: 'Orthodontiste', days: [1, 4, 0], N: 210, T: 47900, LAB: 7500, supRate: 0.35, young: 1,
      mix: { consultO: 3, exam: 1, pano: 2, consult: 1, ortho: 8, appareil: 1.3, goutt: 0.5, blanch: 0.3 } },
    { name: 'Dr Abde-Ssadic Bochouari', short: 'Abde-Ssadic Bochouari', spec: 'Chirurgien dentaire', days: [1, 2], N: 116, T: 19200, LAB: 3100, young: 0,
      mix: { extr: 3, extrS: 0.6, obt: 4, detart: 3, consult: 2, exam: 2, couronne: 2.2, bridge: 0.5, prothese: 0.5 } },
    { name: 'Dr Daoud Bouchouari', short: 'Daoud Bouchouari', spec: 'Endodontiste et chirurgie orale', days: [4, 0], N: 130, T: 18300, LAB: 2900, young: 0,
      mix: { canal: 1.0, extrS: 0.3, obt: 1.6, pano: 1.0, consult: 2, exam: 0.8, couronne: 1.1, facette: 0.5 } },
    { name: 'Dr Julien Cabaz', short: 'Julien Cabaz', spec: 'Implantologue', days: [5, 6], step: 60, end: 1200, fridayStart: 900, N: 70, T: 18900, LAB: 3000, young: 0,
      mix: { implant: 0.55, greffe: 0.15, consult: 1.5, pano: 1.5, couronneImpl: 0.35, couronne: 0.1, exam: 0.7 } },
    { name: 'Dr Nabila Touil', short: 'Nabila Touil', spec: 'Praticienne (spécialité à confirmer)', days: [5], end: 900, N: 46, T: 9300, LAB: 1600, rate: 0.5, leaves: '01/12/2026', young: 0,
      mix: { detart: 3, exam: 2, obt: 3, consult: 1.5, blanch: 1.4, facette: 1.0, couronne: 1.5 } },
    { name: '7e praticien (à confirmer)', short: '7e praticien', spec: 'jours à confirmer', days: [6], N: 66, T: 9000, LAB: 2700, young: 0,
      mix: { consult: 3, obt: 3, detart: 3, extr: 2, exam: 2, couronne: 1.8, bridge: 0.5, prothese: 0.5 } }
  ];

  // Actes associés fréquents lors d'une même visite : [acte, probabilité]
  var COMP = {
    consult: [['exam', 0.2], ['pano', 0.2]], consultO: [['pano', 0.2]], exam: [['pano', 0.25], ['detart', 0.15]], detart: [['exam', 0.2]],
    obt: [['pano', 0.06], ['obt', 0.12]], canal: [['pano', 0.35]], extr: [['pano', 0.25], ['consult', 0.12]], extrS: [['pano', 0.25], ['consult', 0.12]],
    pano: [['consult', 0.15]], ortho: [['pano', 0.06]], appareil: [['pano', 0.2]]
  };
  var FREEKEYS = ['couronne', 'bridge', 'facette', 'goutt', 'blanch', 'implant', 'greffe', 'couronneImpl', 'prothese'];
  var rows = []; var visits = [];
  PR.forEach(function (P, pi) {
    P.dates = [];
    for (var d = 1; d <= MONTH.days; d += 1) { if (P.days.indexOf(new Date(MONTH.y, MONTH.m, d).getDay()) >= 0) { P.dates.push(d); } }
    // horaires : 9 h à 18 h 30 (Cabaz : rendez-vous d'une heure, 9 h à 20 h, le vendredi de 15 h à 20 h après Touil ; Touil : 9 h à 15 h), pause de midi 12 h à 13 h sans rendez-vous
    var step = P.step || 30;
    P.win = function (wd) { return [(P.fridayStart && wd === 5) ? P.fridayStart : 540, P.end || 1110]; };
    P.openHours = function (wd) { var w = P.win(wd); return (w[1] - w[0]) / 60 - ((w[0] < 720 && w[1] > 780) ? 1 : 0); };
    P.slotsFor = function (wd) { var w = P.win(wd); var a = []; for (var sm = w[0]; sm + step <= w[1]; sm += step) { if (sm + step <= 720 || sm >= 780) { a.push(sm); } } return a; };
    P.step = step;
    var rnd = mul(pi * 7919 + 101);
    var keys = Object.keys(P.mix); var wsum = keys.reduce(function (a, k) { return a + P.mix[k]; }, 0);
    var nd = P.dates.length; var mine = []; var myVisits = [];
    // effectif de chaque journée proportionnel au nombre de créneaux disponibles
    var capD = P.dates.map(function (d) { return P.slotsFor(new Date(MONTH.y, MONTH.m, d).getDay()).length; });
    var capT = capD.reduce(function (a, x) { return a + x; }, 0);
    var nDay = capD.map(function (c) { return Math.floor(P.N * c / capT); });
    var left = P.N - nDay.reduce(function (a, x) { return a + x; }, 0);
    for (var li = 0; left > 0; li = (li + 1) % nd) { if (nDay[li] < capD[li]) { nDay[li] += 1; left -= 1; } }
    var mkLine = function (key, age) {
      var L = { key: key, labo: 0 };
      if (ACT[key]) { var t = ACT[key](age); L.code = t[0]; L.label = t[1]; L.tarif = t[2]; L.suph = P.supRate ? Math.round(t[2] * P.supRate * 100) / 100 : 0; L.fee = Math.round((t[2] + L.suph) * 100) / 100; L.ib = t[3]; L.io = t[4]; L.free = false; }
      else { L.code = 'hors nomenclature'; L.label = FREE[key][0]; L.fee = FREE[key][1]; L.free = true; L.suph = 0; }
      return L;
    };
    P.dates.forEach(function (d, di) {
      var n = nDay[di]; var wd = new Date(MONTH.y, MONTH.m, d).getDay(); var SLOTS = P.slotsFor(wd);
      var dstr = pad(d) + '/' + pad(MONTH.m + 1); var off = wd === 0 || wd === 6 || HOL.indexOf(dstr) >= 0;
      for (var i = 0; i < n; i += 1) {
        var r = rnd() * wsum; var key = keys[0];
        for (var j = 0; j < keys.length; j += 1) { r -= P.mix[keys[j]]; if (r <= 0) { key = keys[j]; break; } }
        var byear = P.young && (key === 'ortho' || key === 'consultO' || key === 'appareil') ? 2000 + Math.floor(rnd() * 19) : 1945 + Math.floor(rnd() * 74);
        var bm = 1 + Math.floor(rnd() * 12); var bd = 1 + Math.floor(rnd() * 28);
        var age = MONTH.y - byear; if (MONTH.m + 1 < bm || (MONTH.m + 1 === bm && d < bd)) { age -= 1; }
        var mins = SLOTS[Math.min(SLOTS.length - 1, Math.floor(i * SLOTS.length / n))];
        var rg = rnd(); var ms = rg < 0.92 ? 'En ordre' : (rg < 0.97 ? 'À vérifier' : 'Non en ordre');
        var reg = rnd() < 0.18 ? 'bim' : 'ord';
        var vis = { vi: visits.length, p: pi, d: d, wd: wd, off: off, time: pad(Math.floor(mins / 60)) + ' h ' + pad(mins % 60), when: WD[wd] + ' ' + dstr,
          doss: 'D-' + (10000 + Math.floor(rnd() * 90000)), dob: pad(bd) + '/' + pad(bm) + '/' + byear, age: age,
          mut: MUT[Math.floor(rnd() * MUT.length)], ms: ms, reg: reg, rp: rnd(), future: d > MONTH.today, lines: [] };
        var ks = [key]; var cl = COMP[key] || [];
        cl.forEach(function (c) { if (ks.length < 3 && rnd() < c[1] && (c[0] === 'obt' || ks.indexOf(c[0]) < 0)) { ks.push(c[0]); } });
        ks.forEach(function (k, ki) {
          var L = mkLine(k, age); L.vi = vis.vi; L.first = ki === 0;
          ['p', 'd', 'wd', 'off', 'time', 'when', 'doss', 'dob', 'age', 'mut', 'ms', 'reg', 'rp', 'future'].forEach(function (f) { L[f] = vis[f]; });
          vis.lines.push(L); mine.push(L);
        });
        myVisits.push(vis); visits.push(vis);
      }
    });
    // réconciliation : les actes libres absorbent l'écart pour que le total soit exactement T
    var sn = 0; var fb = 0; var fr = [];
    mine.forEach(function (r) { if (r.free) { fb += r.fee; fr.push(r); } else { sn += r.fee; } });
    P.k = (P.T - sn) / fb;
    fr.forEach(function (r) { r.fee = Math.max(30, Math.round(r.fee * P.k / 5) * 5); });
    var cur = 0; mine.forEach(function (r) { cur += r.fee; });
    var diff = Math.round((P.T - cur) * 100) / 100; var idx = 0;
    while (Math.abs(diff) >= 5 && fr.length) { var st = diff > 0 ? 5 : -5; fr[idx % fr.length].fee += st; diff = Math.round((diff - st) * 100) / 100; idx += 1; }
    if (fr.length) { var big = fr.reduce(function (a, r) { return r.fee > a.fee ? r : a; }, fr[0]); big.fee = Math.round((big.fee + diff) * 100) / 100; }
    var lw = 0; fr.forEach(function (r) { r.lw = FREE[r.key][2] * r.fee; lw += r.lw; });
    var lt = 0; var lr = fr.filter(function (r) { return r.lw > 0; });
    lr.forEach(function (r) { r.labo = Math.min(Math.round(P.LAB * r.lw / lw), Math.round(r.fee * 0.6)); lt += r.labo; });
    var gap = P.LAB - lt; var li = 0;
    while (gap !== 0 && lr.length && li < 5000) { var rr = lr[li % lr.length]; var sg = gap > 0 ? 1 : -1; if (rr.labo + sg >= 0 && rr.labo + sg <= Math.round(rr.fee * 0.7)) { rr.labo += sg; gap -= sg; } li += 1; }
    // montants par acte, puis par visite (supplément et paiement une seule fois par visite)
    myVisits.forEach(function (v) {
      var fee = 0; var iv = 0; var fr2 = 0;
      v.lines.forEach(function (L) {
        L.interv = L.free ? 0 : (v.ms === 'Non en ordre' ? 0 : (v.reg === 'bim' ? L.ib : L.io));
        L.supp = (v.off && L.first) ? 50 : 0; L.share = Math.round((L.fee - L.interv + L.supp) * 100) / 100;
        fee += L.fee; iv += L.interv; if (L.free) { fr2 += L.fee - L.interv; }
      });
      v.fee = Math.round(fee * 100) / 100; v.interv = Math.round(iv * 100) / 100; v.supp = v.off ? 50 : 0;
      v.share = Math.round((v.fee - v.interv + v.supp) * 100) / 100;
      var pay;
      if (v.future) { pay = 'planned'; } else if (v.share < 0.005) { pay = 'zero'; } else if (fr2 > 0 && v.share >= 600 && v.rp < 0.45) { pay = 'plan'; } else if (v.rp < 0.1) { pay = 'unpaid'; } else { pay = v.rp < 0.6 ? 'cb' : 'cash'; }
      v.pay = pay; v.nact = v.lines.length; v.free = fr2 > 0;
      v.lines.forEach(function (L) { L.pay = pay; rows.push(L); });
    });
    P.rows = mine; P.visits = myVisits; P.suph = Math.round(mine.reduce(function (a, r) { return a + (r.suph || 0); }, 0) * 100) / 100;
    P.rate = P.rate || 0.6; P.base = P.T - P.LAB; P.retro = Math.round(P.base * P.rate * 100) / 100; P.net = P.retro; P.cab = Math.round((P.base - P.retro) * 100) / 100;
    P.maxDay = 0; P.dates.forEach(function (d) { var c = myVisits.filter(function (r) { return r.d === d; }).length; if (c > P.maxDay) { P.maxDay = c; } });
  });

  // ---- Box (fauteuils) : occupation et marge ----
  var BOXNAMES = { ped: 'Box pédiatrique', mic: 'Box microscope', b3: 'Box 3' };
  // Mohamed : lundi, jeudi, dimanche (mardi administratif, sans box). Vendredi : Aya (pédiatrique), Nabila de 9 h à 15 h puis Julien de 15 h à 20 h dans le Box 3 (polyvalent)
  var BOXMAP = { ped: { 1: [0], 2: [0], 3: [0], 4: [0], 5: [0] }, mic: { 1: [2], 2: [2], 4: [3], 6: [4], 0: [3] }, b3: { 1: [1], 4: [1], 5: [5, 4], 0: [1], 6: [6] } };
  var CHG = { leasingBox: 650, conso: 3200, perso: 11700, cabPct: 0.3384 };
  var boxes = Object.keys(BOXMAP).map(function (bk) {
    var vs = visits.filter(function (v) { return (BOXMAP[bk][v.wd] || []).indexOf(v.p) >= 0; });
    var perDay = {}; vs.forEach(function (v) { perDay[v.d] = (perDay[v.d] || 0) + PR[v.p].step / 60; });
    var hrs = 0; Object.keys(perDay).forEach(function (d) { hrs += perDay[d]; });
    var ca = vs.reduce(function (a, v) { return a + v.fee; }, 0);
    return { key: bk, name: BOXNAMES[bk], visits: vs.length, days: Object.keys(perDay).length, hours: hrs, avail: MONTH.days * 8.5, occ: hrs / (MONTH.days * 8.5), ca: ca };
  });
  var totH = boxes.reduce(function (a, b) { return a + b.hours; }, 0); var totV = boxes.reduce(function (a, b) { return a + b.visits; }, 0);
  boxes.forEach(function (b) {
    b.part = b.ca * CHG.cabPct; b.leasing = CHG.leasingBox; b.conso = CHG.conso * b.visits / totV; b.perso = CHG.perso * b.hours / totH;
    b.margin = b.part - b.leasing - b.conso - b.perso;
  });
  var occAll = totH / (3 * MONTH.days * 8.5);

  // ---- Devis (plans de traitement) ----
  var QK = ['couronne', 'bridge', 'facette', 'implant', 'greffe', 'couronneImpl', 'prothese', 'appareil'];
  var RATE = [0.62, 0.70, 0.55, 0.58, 0.48, 0.50, 0.52];
  var rq = mul(424242);
  var quotes = { byPr: [], list: [] };
  PR.forEach(function (P, pi) {
    var acc = P.rows.filter(function (r) { return QK.indexOf(r.key) >= 0; });
    var accepted = acc.length; var presented = Math.round(accepted / RATE[pi]);
    var refused = Math.round((presented - accepted) * 0.55); var pending = presented - accepted - refused;
    var valAcc = acc.reduce(function (a, r) { return a + r.fee; }, 0); var avg = accepted ? valAcc / accepted : 0;
    quotes.byPr.push({ p: pi, name: P.name, presented: presented, accepted: accepted, pending: pending, refused: refused, rate: accepted / presented, valAcc: valAcc, valPend: Math.round(pending * avg / 10) * 10 });
    for (var i = 0; i < Math.min(pending + refused, 5); i += 1) {
      var src = acc[Math.floor(rq() * acc.length)]; var bm = 1 + Math.floor(rq() * 12); var bd = 1 + Math.floor(rq() * 28);
      quotes.list.push({ p: pi, doss: 'D-' + (10000 + Math.floor(rq() * 90000)), dob: pad(bd) + '/' + pad(bm) + '/' + (1950 + Math.floor(rq() * 60)), label: src.label, amount: Math.round(src.fee / 10) * 10, d: 1 + Math.floor(rq() * 17), status: i < Math.min(pending, 3) ? 'En attente' : 'Refusé' });
    }
  });
  quotes.list.sort(function (a, b) { return b.d - a.d; });
  var qt = quotes.byPr.reduce(function (a, q) { a.presented += q.presented; a.accepted += q.accepted; a.pending += q.pending; a.refused += q.refused; a.valPend += q.valPend; a.valAcc += q.valAcc; return a; }, { presented: 0, accepted: 0, pending: 0, refused: 0, valPend: 0, valAcc: 0 });
  qt.rate = qt.accepted / qt.presented; quotes.total = qt;

  // ---- Patients actifs, nouveaux patients, fidélisation (chiffres fictifs) ----
  var pilot = { actifs: 6400, nouveaux: 230, retour: 0.71 };
    window.LAEKEN = { MONTH: MONTH, PR: PR, rows: rows, visits: visits, boxes: boxes, occAll: occAll, quotes: quotes, pilot: pilot, CHG: CHG, ACT: ACT, FREE: FREE, WD: WD, pad: pad };
})();
