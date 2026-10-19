# Dashboard Dental Clinic Laeken

Maquette interactive (données fictives, octobre 2026). Site : https://avenirprojets2026-bot.github.io/Dasboard-laeken/

## Version premium (19/10/2026)

Version de démonstration complète, en attente du retour du gérant.

| Page | Contenu |
|---|---|
| Accueil | Bandeau, 4 chiffres clés selon le rôle, accès rapides |
| Main · Vue cabinet | Indicateurs, comparaison des périodes, répartition des soins |
| D · Résultat du gérant | Charges modifiables (6 familles, véhicules), budget et réel, cascade, projection |
| Q · Factures fournisseurs | Registre, échéances, prévu / facturé |
| E · Rémunérations | Calculs (gérant 100 %, Touil 50 %, autres 60 %), suivi des versements |
| F · Fauteuils | Occupation, carte de chaleur, coût par patient |
| C · Mutuelles et labo | Créances (ancienneté en 4 tranches), travaux de labo, contrôle labo, assurances complémentaires |
| H · Patients et paiements | Paiements, rendez-vous manqués, devis (tableaux modifiables, CSV) |
| K · Tarifs INAMI | Tarif officiel au 01/06/2026, 258 prestations ambulatoires, simulation |
| G, I, B, L, M, N, J, O, P | Tableau interactif, actes, casiers, patients vus, espace praticien, relevés, import/export, Corilus, accès |
| R · Contrôles de cohérence | 19 contrôles automatiques, points à finaliser, parcours de test en 8 étapes |

Chiffres du modèle : honoraires 121 100 €, labo 17 700 €, rémunérations 72 780 €, part du cabinet 30 620 €, charges 33 615 €, résultat −2 995 € par mois, 963 patients.

Avant toute donnée réelle : authentification et droits côté serveur, conformité RGPD, export Corilus, confirmation des hypothèses (ONSS, salaires des secrétaires, véhicules, supplément d'honoraires).

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
| Praticien | Accueil, Espace praticien et Patients vus (ses données), Tarifs INAMI |
| Secrétariat | Accueil, Patients et paiements, Import et export, Tarifs INAMI |

Détail dans la page P (« Accès et rôles »). Contrôle côté navigateur uniquement (maquette).
