# Dashboard Dental Clinic Laeken

Maquette interactive (données fictives). Ouvrir index.html.

## Accès sécurisé (e-mail + code secret)

Le site demande un e-mail et un code secret. Trois profils : **gérant** (toutes les pages), **praticien** (son espace, ses patients et la nomenclature, uniquement ses propres données) et **secrétariat** (patients et paiements, import/export, nomenclature).

- Les codes ne sont pas dans le dépôt, seulement leurs empreintes (PBKDF2-SHA256, 120 000 itérations) dans `acces.js`.
- Pour créer ou changer des comptes : modifier la liste dans `outils/generer-acces.py`, lancer `python3 outils/generer-acces.py` (les codes s'affichent une seule fois), puis publier `acces.js`.
- Limite : le contrôle se fait dans le navigateur, sur un site statique. Il protège contre un visiteur ordinaire, pas contre une personne technique : les données restent dans les fichiers du site. Pour de vraies données, il faut un serveur avec authentification.
