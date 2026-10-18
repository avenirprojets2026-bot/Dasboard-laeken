# Dashboard Dental Clinic Laeken

Maquette interactive (données fictives). Ouvrir index.html.

## Accès sécurisé (e-mail + code secret)

Le site demande un e-mail et un code secret. Trois profils : **gérant** (toutes les pages), **praticien** (son espace, ses patients et la nomenclature, uniquement ses propres données) et **secrétariat** (patients et paiements, import/export, nomenclature).

- Les codes ne sont pas dans le dépôt, seulement leurs empreintes (PBKDF2-SHA256, 120 000 itérations) dans `acces.js`.
- Pour créer ou changer des comptes : modifier la liste dans `outils/generer-acces.py`, lancer `python3 outils/generer-acces.py` (les codes s'affichent une seule fois), puis publier `acces.js`.
- Limite : le contrôle se fait dans le navigateur, sur un site statique. Il protège contre un visiteur ordinaire, pas contre une personne technique : les données restent dans les fichiers du site. Pour de vraies données, il faut un serveur avec authentification.

### Changer son code
Une fois connecté, le bouton « Mon code » (en bas à droite) permet de choisir un nouveau code de 6 caractères (lettres et chiffres). Le nouveau code est enregistré dans le navigateur de l'appareil utilisé ; sur un autre appareil, le code d'origine reste valable tant que `acces.js` n'est pas régénéré (`outils/generer-acces.py`).

## Accès et rôles

| Rôle | Pages |
|---|---|
| Administrateur | toutes, y compris « Accès et rôles » |
| Gérant | toutes, y compris « Accès et rôles » |
| Praticien | Accueil, Espace praticien et Patients vus (ses données), Nomenclature |
| Secrétariat | Accueil, Patients et paiements, Import et export, Nomenclature |

Détail dans la page P (« Accès et rôles »). Contrôle côté navigateur uniquement (maquette).
