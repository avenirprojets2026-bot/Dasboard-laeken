#!/usr/bin/env python3
"""Génère acces.js (empreintes PBKDF2) et affiche les codes secrets en clair, une seule fois.
Les codes ne sont jamais écrits dans le dépôt : seules les empreintes le sont.
Pour changer un compte : modifiez la liste COMPTES puis relancez le script, et republiez acces.js."""
import hashlib, json, secrets, sys, os

ITER = 120000
ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
# nom affiché, e-mail, rôle (admin | gerant | praticien | secretaire), index du praticien dans data.js (ou -1)
COMPTES = [
    ('Dr Mohamed Bochouari (gérant)', 'orthobochouari@gmail.com', 'gerant', -1),
    ('Karim (administrateur de la maquette)', 'avenir.projets2026@gmail.com', 'admin', -1),
    ('Dr Aya Turkieh', 'adresse personnelle (voir emails-prives.json)', 'praticien', 0),
    ('Dr Abde-Ssadic Bochouari', 'abde-ssadic.bochouari@dentalclinic.com', 'praticien', 2),
    ('Dr Daoud Bouchouari', 'daoud.bouchouari@dentalclinic.com', 'praticien', 3),
    ('Dr Julien Cabaz', 'julien.cabaz@dentalclinic.com', 'praticien', 4),
    ('Dr Nabila Touil', 'nabila.touil@dentalclinic.com', 'praticien', 5),
    ('7e praticien (à confirmer)', 'nouveau.praticien@dentalclinic.com', 'praticien', 6),
    ('Secrétaire 1', 'secretaire1@dental-laeken.be', 'secretaire', -1),
    ('Secrétaire 2', 'secretaire2@dental-laeken.be', 'secretaire', -1),
    ('Secrétaire 3', 'secretaire3@dental-laeken.be', 'secretaire', -1),
]

# Adresses personnelles : jamais dans le dépôt public. Fichier local outils/emails-prives.json
# au format {"Dr Aya Turkieh": "adresse@exemple.com"} (ignoré par git).
_pf = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'emails-prives.json')
PRIVES = json.load(open(_pf, encoding='utf-8')) if os.path.exists(_pf) else {}
COMPTES = [(n, PRIVES.get(n, e), r, p) for (n, e, r, p) in COMPTES]

def code():
    return ''.join(secrets.choice(ALPHA) for _ in range(6))

out = []
print('E-mail ; code secret ; rôle')
for nom, email, role, pr in COMPTES:
    c = code()
    salt = secrets.token_bytes(16)
    h = hashlib.pbkdf2_hmac('sha256', (email.lower() + '\n' + c).encode(), salt, ITER, 32).hex()
    e = hashlib.sha256(email.lower().encode()).hexdigest()[:12]
    out.append({'n': nom, 'role': role, 'pr': pr, 'e': e, 's': salt.hex(), 'h': h})
    print('%s ; %s ; %s' % (email, c, role))

path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'acces.js')
open(path, 'w', encoding='utf-8').write('window.LKACCES = ' + json.dumps({'iter': ITER, 'comptes': out}, ensure_ascii=False, indent=1) + ';\n')
print('acces.js écrit', file=sys.stderr)
