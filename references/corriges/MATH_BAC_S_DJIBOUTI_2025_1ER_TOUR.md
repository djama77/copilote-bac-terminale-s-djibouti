# Bac S Djibouti 2025 — Mathématiques — 1er tour
## Corrigé pédagogique détaillé fondé sur le corrigé transmis

- Série : S
- Session : 2025
- Référence figurant sur le document : 25MATS2
- Document de base : corrigé PDF transmis par l'utilisateur (6 pages).
- Statut : **transcription et explication pédagogique du corrigé fourni**. Ce fichier ne remplace pas le PDF source.
- Important : le sujet complet n'est pas joint au corrigé. Les énoncés manquants, notamment ceux du QCM, ne sont pas reconstitués.

---

## Exercice 1 — QCM (barème annoncé : 4 points)

Le corrigé donne les cinq réponses suivantes. Il précise qu'une réponse exacte rapporte 1 point, qu'une réponse fausse ou absente ne rapporte ni ne retire de point, et qu'aucune justification n'est demandée.

1. **Réponse a)** :
   \\[z=-\\frac{9}{10}+\\frac15 i.\\]
   Forme algébrique (z=a+bi) : partie réelle (-9/10), coefficient de la partie imaginaire (1/5).

2. **Réponse c)** :
   \\[P(2\\leq X\\leq3)=0,1915.\\]
   Cela correspond à 19,15 %.

3. **Réponse b)** : (0,58).

4. **Réponse a)** : l'expression reproduite dans le corrigé est (3671^8). L'énoncé n'étant pas présent, le calcul qui conduit à cette réponse ne peut pas être expliqué de manière fiable.

5. **Réponse c)** :
   \\[[0,234\\ ;\\ 0,306].\\]
   Le corrigé identifie cet intervalle comme un intervalle de confiance pour l'estimation d'une proportion ; il va de 23,4 % à 30,6 %.

**Réserve de barème :** le titre de l'exercice annonce 4 points, alors que cinq réponses à 1 point sont affichées. Cette incohérence est conservée et signalée, sans arbitrage.

---

## Exercice 2 — Suites numériques (5 points)

La fonction utilisée est :
\\[f(x)=\\frac{4+7x}{10+x},\\]
et la suite est définie par (u_0=2) et (u_{n+1}=f(u_n)).

### 1. Premiers termes et lecture graphique

\\[u_0=2.\\]

\\[u_1=\\frac{4+7\\times2}{10+2}=\\frac{18}{12}=1,5.\\]

\\[u_2=\\frac{4+7\\times1,5}{10+1,5}=\\frac{14,5}{11,5}\\approx1,26.\\]

En poursuivant avec la valeur non arrondie de (u_2), le corrigé donne (u_3\\approx1,131).

Valeurs indicatives : (u_0=2), (u_1=1,5), (u_2\\approx1,26), (u_3\\approx1,131).

### 2. Sens de variation de (f)

Avec la formule de dérivation d'un quotient :
\\[f'(x)=\\frac{7(10+x)-(4+7x)}{(10+x)^2}.\\]

Donc :
\\[f'(x)=\\frac{70+7x-4-7x}{(10+x)^2}=\\frac{66}{(10+x)^2}.\\]

Sur l'intervalle étudié, le dénominateur est strictement positif. Ainsi (f'(x)>0) et (f) est strictement croissante (en particulier sur ([1;4])).

### 3. Démonstration par récurrence

Propriété à démontrer :
\\[1\\leq u_{n+1}\\leq u_n\\leq4.\\]

**Initialisation :** (u_0=2) et (u_1=1,5), donc
\\[1\\leq1,5\\leq2\\leq4.\\]
La propriété est vraie au rang 0.

**Hérédité :** supposons
\\[1\\leq u_{k+1}\\leq u_k\\leq4.\\]
Comme (f) est croissante :
\\[f(1)\\leq f(u_{k+1})\\leq f(u_k)\\leq f(4).\\]
Or :
\\[f(1)=\\frac{11}{11}=1,\\qquad f(4)=\\frac{32}{14}=\\frac{16}{7}\\leq4.\\]
Avec (u_{k+2}=f(u_{k+1})) et (u_{k+1}=f(u_k)), on obtient :
\\[1\\leq u_{k+2}\\leq u_{k+1}\\leq4.\\]
La propriété est donc héréditaire.

**Conclusion :**
\\[\\boxed{\\forall n\\in\\mathbb N,\\quad1\\leq u_{n+1}\\leq u_n\\leq4.}\\]

### 4. Convergence et limite

La suite est décroissante car (u_{n+1}\\leq u_n), et minorée par 1. Le théorème de convergence des suites monotones garantit qu'elle converge vers un réel (\\ell\\in[1;4]).

La fonction (f) étant continue sur l'intervalle concerné, la relation de récurrence donne :
\\[\\ell=f(\\ell)=\\frac{4+7\\ell}{10+\\ell}.\\]

Donc :
\\[\\ell(10+\\ell)=4+7\\ell\\]
\\[\\ell^2+3\\ell-4=0\\]
\\[(\\ell+4)(\\ell-1)=0.\\]

Les solutions sont (-4) et (1). Comme (\\ell\\in[1;4]), on retient :
\\[\\boxed{\\lim_{n\\to+\\infty}u_n=1.}\\]

### 5.a. Algorithme Python

Le programme du corrigé est :

\`\`\`python
def suite(n):
    u = 2
    s = 2
    for i in range(1, n + 1):
        u = (4 + 7 * u) / (10 + u)
        s = s + u
    print(s)
\`\`\`

- `u = 2` initialise (u_0).
- `s = 2` initialise la somme avec (u_0).
- La boucle calcule successivement (u_1,…,u_n).
- `s = s + u` ajoute chaque nouveau terme.
- L'affichage final donne (S=u_0+u_1+…+u_n).

### 5.b. Pour (n=10)

Le corrigé indique :
\\[\\boxed{S\\approx13,06.}\\]

---

## Exercice 3 — Fonction exponentielle (6 points)

La fonction étudiée est :
\\[f(x)=x^2e^{-x}-2e.\\]

### 1.a. Limites et asymptote

En (+\\infty) :
\\[x^2e^{-x}=\\frac{x^2}{e^x}\\longrightarrow0\\]
par croissance comparée. Donc :
\\[\\boxed{\\lim_{x\\to+\\infty}f(x)=-2e.}\\]

En (-\\infty), (x^2\\to+\\infty) et (e^{-x}\\to+\\infty), donc :
\\[\\boxed{\\lim_{x\\to-\\infty}f(x)=+\\infty.}\\]

La droite (y=-2e) est une asymptote horizontale à (C_f) en (+\\infty).

### 2.a. Dérivée

\\[f'(x)=2xe^{-x}-x^2e^{-x}.\\]
En factorisant :
\\[\\boxed{f'(x)=x(2-x)e^{-x}.}\\]

### 2.b. Signe de la dérivée et variations

Comme (e^{-x}>0), le signe de (f'(x)) est celui de (x(2-x)).

- Si (x<0), (f'(x)<0).
- Si (0<x<2), (f'(x)>0).
- Si (x>2), (f'(x)<0).
- (f'(0)=f'(2)=0).

Valeurs aux points critiques :
\\[f(0)=-2e,\\qquad f(2)=4e^{-2}-2e\\approx-4,90.\\]

Ainsi, (f) décroît sur (]-\\infty;0]), croît sur ([0;2]), puis décroît sur ([2;+\\infty[).

### 3.a. Équation (f(x)=0)

Sur (]-\\infty;0]), (f) est continue et strictement décroissante. De plus :
\\[\\lim_{x\\to-\\infty}f(x)=+\\infty,\\qquad f(0)=-2e<0.\\]
Le théorème des valeurs intermédiaires assure l'existence d'une solution, et la stricte décroissance assure son unicité. Le corrigé note cette solution (\\alpha).

### 3.b. Signe de (f)

D'après le tableau de variations et l'unicité de la racine :
- (f(x)>0) pour (x<\\alpha) ;
- (f(\\alpha)=0) ;
- (f(x)<0) pour (x>\\alpha).

### 4. Aire sur ([0;1])

Sur ([0;1]), (f) est négative. L'aire vaut donc l'opposé de l'intégrale :
\\[A=-\\int_0^1(x^2e^{-x}-2e)\\,dx.\\]

Une primitive est :
\\[F(x)=-(x^2+2x+2)e^{-x}-2ex.\\]

Alors :
\\[F(0)=-2,\\qquad F(1)=-\\frac5e-2e.\\]

Donc :
\\[A=F(0)-F(1)=-2+\\frac5e+2e.\\]

Résultat :
\\[\\boxed{A=\\frac{5+2e^2-2e}{e}.}\\]

---

## Exercice 4 — Géométrie dans l'espace (4 points)

Points du corrigé :
- (A(1;2;3))
- (B(-3;2;5))
- (C(-1;-2;-1))
- (D(10;4;1))
- (E(18;-16;17))

### 1. Vecteurs et existence du plan

\\[\\overrightarrow{AB}=B-A=(-4;0;2).\\]
\\[\\overrightarrow{AC}=C-A=(-2;-4;-4).\\]

Ces vecteurs ne sont pas proportionnels ; ils ne sont donc pas colinéaires. Les points A, B et C ne sont pas alignés et définissent un plan unique ((ABC)).

### 2.a. Équation cartésienne du plan

On cherche un vecteur normal (\\vec n=(a;b;c)). Il doit vérifier :
\\[\\vec n\\cdot\\overrightarrow{AB}=0,\\qquad
\\vec n\\cdot\\overrightarrow{AC}=0.\\]

D'où :
\\[-4a+2c=0\\quad\\Longrightarrow\\quad c=2a,\\]
\\[-2a-4b-4c=0.\\]

En remplaçant (c=2a) :
\\[-10a-4b=0\\quad\\Longrightarrow\\quad b=-\\frac52a.\\]

On choisit (a=2), d'où (b=-5) et (c=4). Un vecteur normal est donc (\\vec n=(2;-5;4)).

L'équation du plan est (2x-5y+4z+d=0). Comme A appartient au plan :
\\[2(1)-5(2)+4(3)+d=0\\Longrightarrow d=-4.\\]

Résultat :
\\[\\boxed{(ABC):2x-5y+4z-4=0.}\\]

### 2.b. Appartenance de D

\\[2(10)-5(4)+4(1)-4=20-20+4-4=0.\\]
Donc :
\\[\\boxed{D\\in(ABC).}\\]

### 3. Orthogonalité de DE au plan

\\[\\overrightarrow{DE}=E-D=(8;-20;16).\\]
Or :
\\[4\\vec n=4(2;-5;4)=(8;-20;16)=\\overrightarrow{DE}.\\]
Le vecteur DE est colinéaire au vecteur normal du plan, donc :
\\[\\boxed{(DE)\\perp(ABC).}\\]

### 4. Projection orthogonale

D appartient au plan ((ABC)) et la droite ((DE)) est perpendiculaire à ce plan. Le projeté orthogonal de E sur ((ABC)) est donc :
\\[\\boxed{D.}\\]

### 5.a. Distance de E au plan

La distance est (ED) :
\\[ED=\\sqrt{8^2+(-20)^2+16^2}\\]
\\[=\\sqrt{64+400+256}=\\sqrt{720}.\\]
Donc :
\\[\\boxed{d(E;(ABC))=ED=12\\sqrt5.}\\]

### 5.b. Nature du triangle, aire et volume

\\[AB^2=(-4)^2+0^2+2^2=20.\\]
\\[AC^2=(-2)^2+(-4)^2+(-4)^2=36.\\]
\\[\\overrightarrow{BC}=C-B=(2;-4;-6),\\]
\\[BC^2=2^2+(-4)^2+(-6)^2=56.\\]

Comme (AB^2+AC^2=20+36=56=BC^2), le triangle ABC est rectangle en A.

\\[AB=2\\sqrt5,\\qquad AC=6.\\]
Son aire vaut :
\\[\\mathcal A_{ABC}=\\frac12\\times AB\\times AC
=\\frac12\\times2\\sqrt5\\times6
=\\boxed{6\\sqrt5}.\\]

Le volume de la pyramide EABC est :
\\[V=\\frac13\\times\\mathcal A_{ABC}\\times ED\\]
\\[=\\frac13\\times6\\sqrt5\\times12\\sqrt5
=\\boxed{120}.\\]

---

## Bilan des résultats

| Exercice | Thème | Résultats principaux |
|---|---|---|
| 1 | QCM | Réponses : a, c, b, a, c (énoncés absents) |
| 2 | Suites | Suite décroissante, minorée, limite 1 ; somme (S_{10}\\approx13,06) |
| 3 | Exponentielle | Asymptote (y=-2e), dérivée (x(2-x)e^{-x}), aire calculée |
| 4 | Géométrie de l'espace | Plan (2x-5y+4z-4=0), distance (12\\sqrt5), volume 120 |

## Points de vigilance pour l'exploitation pédagogique

1. Le corrigé annonce 4 points à l'exercice 1 mais affiche cinq réponses à 1 point chacune : incohérence du barème à vérifier sur le sujet.
2. Le sujet original n'étant pas joint, ne pas inventer les énoncés du QCM ni les données manquantes.
3. Pour toute correction future, comparer le sujet et le corrigé question par question.
4. Distinguer la réponse du corrigé fourni et les explications pédagogiques ajoutées.
