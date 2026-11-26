# Corrigé détaillé — Devoir commun de mathématiques
## Lycée d'Ali-Sabieh — Série S — Trimestre 1 — Novembre 2025

**Durée :** 2 h 30 — **Coefficient :** 1 — **Barème :** 20 points

> Corrigé pédagogique élaboré à partir du sujet PDF fourni. Il s'agit d'une proposition de correction expliquée, et non d'un corrigé officiel du lycée ou du CRIPEN.

---

## Exercice 1 — QCM (4 points)

Une seule réponse est correcte pour chaque question.

### 1. Écriture de 2018 en base 8

Effectuons les divisions euclidiennes successives par 8 :

- 2018 = 8 × 252 + 2
- 252 = 8 × 31 + 4
- 31 = 8 × 3 + 7
- 3 = 8 × 0 + 3

En lisant les restes de bas en haut, on obtient :

\[
2018_{10}=3742_8.
\]

**Réponse : b) 3742₈.**

### 2. Forme algébrique du nombre complexe

\[
z=\frac{3-2i}{1+i}
\]

On multiplie le numérateur et le dénominateur par le conjugué de 1+i, soit 1−i :

\[
z=\frac{(3-2i)(1-i)}{(1+i)(1-i)}
=\frac{3-3i-2i+2i^2}{1-i^2}.
\]

Comme i² = −1 :

\[
z=\frac{1-5i}{2}=\frac12-\frac52i.
\]

**Réponse : b) 1/2 − (5/2)i.**

### 3. Congruence 5x ≡ 3 [11]

On cherche un entier x vérifiant 5x ≡ 3 modulo 11.

Pour x = 5 :

\[
5x=5\times5=25=22+3\equiv3\pmod{11}.
\]

**Réponse : b) 5.**

### 4. Limite de f en +∞

\[
f(x)=2+\frac{\cos x}{x}.
\]

Puisque −1 ≤ cos x ≤ 1, on a :

\[
-\frac1x\leq\frac{\cos x}{x}\leq\frac1x
\quad (x>0).
\]

Or les deux bornes tendent vers 0 lorsque x tend vers +∞. Par encadrement :

\[
\lim_{x\to+\infty}\frac{\cos x}{x}=0.
\]

Donc :

\[
\boxed{\lim_{x\to+\infty}f(x)=2}.
\]

**Réponse : c) 2.**

---

## Exercice 2 — Suites numériques (4 points)

La suite (uₙ) est définie par :

\[
u_{n+1}=u_n+2n+1,\qquad u_0=0.
\]

### 1. Calcul de u₁ et u₂

Pour n = 0 :

\[
u_1=u_0+2\times0+1=0+1=1.
\]

Pour n = 1 :

\[
u_2=u_1+2\times1+1=1+3=4.
\]

Ainsi, **u₁ = 1 et u₂ = 4**.

### 2. Sens de variation

Pour tout entier naturel n :

\[
u_{n+1}-u_n=2n+1.
\]

Or 2n+1 > 0 pour tout n ∈ ℕ. Donc uₙ₊₁ > uₙ pour tout n.

**La suite (uₙ) est strictement croissante.**

### 3. Démonstration par récurrence de uₙ = n²

**Initialisation :** pour n = 0 :

\[
u_0=0=0^2.
\]

La propriété est vraie au rang 0.

**Hérédité :** supposons qu'à un rang n, on ait uₙ = n². Alors :

\[
\begin{aligned}
u_{n+1}&=u_n+2n+1\\
&=n^2+2n+1\\
&=(n+1)^2.
\end{aligned}
\]

La propriété est donc vraie au rang n+1.

**Conclusion :** par récurrence, pour tout entier naturel n :

\[
\boxed{u_n=n^2}.
\]

### 4. Formule à saisir dans la cellule B3

La ligne 2 contient n = 0 et u₀ = 0. Pour calculer u₁ en B3 à partir de la relation de récurrence, on utilise la valeur de n située en A2 et le terme précédent situé en B2 :

**Formule :** `=B2+2*A2+1`

On peut ensuite recopier cette formule vers le bas.

---

## Exercice 3 — Nombres complexes (4 points)

### Partie A — Résolution

On considère :

\[
P(z)=z^3-9z^2+28z-20.
\]

#### 1. Calcul de P(1)

\[
P(1)=1^3-9\times1^2+28\times1-20
=1-9+28-20=0.
\]

Donc **P(1) = 0**.

#### 2. Détermination de a et b

On cherche a et b tels que :

\[
P(z)=(z-1)(z^2+az+b).
\]

Développons :

\[
(z-1)(z^2+az+b)
=z^3+(a-1)z^2+(b-a)z-b.
\]

Par identification avec z³ − 9z² + 28z − 20 :

\[
\begin{cases}
a-1=-9\\
b-a=28\\
-b=-20
\end{cases}
\]

La première équation donne a = −8 et la troisième donne b = 20. La deuxième est bien vérifiée : 20 − (−8) = 28.

**Ainsi, a = −8 et b = 20.**

\[
P(z)=(z-1)(z^2-8z+20).
\]

#### 3. Résolution de P(z) = 0

\[
(z-1)(z^2-8z+20)=0.
\]

Donc :

- z − 1 = 0, d'où z = 1 ;
- z² − 8z + 20 = 0.

Pour le trinôme :

\[
\Delta=(-8)^2-4\times1\times20=64-80=-16.
\]

Les deux racines complexes sont :

\[
z=\frac{8\pm\sqrt{-16}}2
=\frac{8\pm4i}{2}=4\pm2i.
\]

**Ensemble des solutions :**

\[
\boxed{S=\{1\,;\,4+2i\,;\,4-2i\}}.
\]

### Partie B — Ensemble des points

On considère :

\[
Z=\frac{z+1-i}{z-2i},\qquad z=x+iy.
\]

Le dénominateur impose **z ≠ 2i**, c'est-à-dire (x,y) ≠ (0,2).

#### 1. Expression de X et Y

On écrit :

\[
Z=\frac{x+1+i(y-1)}{x+i(y-2)}.
\]

Multiplions par le conjugué du dénominateur :

\[
Z=\frac{[x+1+i(y-1)][x-i(y-2)]}{x^2+(y-2)^2}.
\]

Après développement :

\[
Z=\frac{x^2+x+y^2-3y+2+i(x-y+2)}
{x^2+(y-2)^2}.
\]

Comme Z = X + iY, on obtient :

\[
\boxed{X=\frac{x^2+x+y^2-3y+2}{x^2+(y-2)^2}}
\]

et

\[
\boxed{Y=\frac{x-y+2}{x^2+(y-2)^2}}.
\]

Ces expressions sont définies pour (x,y) ≠ (0,2).

#### 2.a. Points M tels que Z soit réel

Un nombre complexe est réel si et seulement si sa partie imaginaire est nulle : Y = 0.

\[
\frac{x-y+2}{x^2+(y-2)^2}=0
\iff x-y+2=0.
\]

Donc y = x+2.

**L'ensemble recherché est la droite d'équation y = x+2, privée du point A(0,2)**, car Z n'est pas défini en ce point.

#### 2.b. Points M tels que Z soit un imaginaire pur

Un nombre complexe est un imaginaire pur si et seulement si sa partie réelle est nulle : X = 0.

\[
x^2+x+y^2-3y+2=0.
\]

Complétons les carrés :

\[
\left(x+\frac12\right)^2+
\left(y-\frac32\right)^2=\frac12.
\]

C'est le cercle de centre I(−1/2 ; 3/2) et de rayon \(\frac{\sqrt2}{2}\).

**L'ensemble recherché est ce cercle privé du point A(0,2)**, où le nombre Z n'est pas défini.

---

## Exercice 4 — Étude de fonction (4 points)

On considère :

\[
f(x)=\frac{x^2+4x+6}{x+3},\qquad x\in\mathbb R\setminus\{-3\}.
\]

### 1. Limite en +∞

Le numérateur est de degré 2 et le dénominateur de degré 1. Le comportement dominant est celui de x²/x = x.

On peut aussi effectuer la division, comme à la question suivante. Ainsi :

\[
\boxed{\lim_{x\to+\infty}f(x)=+\infty}.
\]

### 2. Détermination de a, b et c

Effectuons la division euclidienne :

\[
x^2+4x+6=(x+3)(x+1)+3.
\]

Donc :

\[
f(x)=x+1+\frac3{x+3}.
\]

Par identification :

\[
\boxed{a=1,\quad b=1,\quad c=3}.
\]

### 3. Asymptote oblique

On a :

\[
f(x)-(x+1)=\frac3{x+3}.
\]

Or :

\[
\lim_{x\to\pm\infty}\frac3{x+3}=0.
\]

Donc la droite **(d) : y = x+1** est une asymptote oblique à la courbe C_f en +∞ et en −∞.

### 4. Position relative de C_f par rapport à son asymptote

Étudions le signe de :

\[
f(x)-(x+1)=\frac3{x+3}.
\]

- Si x < −3, alors x+3 < 0 : la différence est négative. La courbe C_f est **au-dessous** de la droite (d).
- Si x > −3, alors x+3 > 0 : la différence est positive. La courbe C_f est **au-dessus** de la droite (d).

### 5. Limite en −3 par valeurs inférieures

On cherche :

\[
\lim_{x\to-3^-}f(x)
=\lim_{x\to-3^-}\left(x+1+\frac3{x+3}\right).
\]

Lorsque x tend vers −3 par valeurs inférieures, x+1 tend vers −2 et x+3 tend vers 0 par valeurs négatives. Par conséquent :

\[
\frac3{x+3}\longrightarrow-\infty.
\]

Donc :

\[
\boxed{\lim_{x\to-3^-}f(x)=-\infty}.
\]

**Interprétation graphique :** la droite d'équation x = −3 est une asymptote verticale à C_f. Lorsque la courbe s'approche de cette droite par la gauche, elle descend vers −∞.

---

## Exercice 5 — Arithmétique et codage (4 points)

Le tableau associe A à 0, B à 1, …, Z à 25. Le codage est défini par :

\[
y\equiv17x+9\pmod{26}.
\]

### 1. Coder la lettre M

Dans le tableau, M correspond à x = 12.

\[
17\times12+9=204+9=213.
\]

Or 213 = 26 × 8 + 5. Le reste est donc 5, qui correspond à la lettre F.

**La lettre M est codée F.**

### 2.a. Rôle de l'algorithme H4

L'algorithme :

```python
def H4(a,n):
    for i in range(n):
        if a*i % n == 1:
            return i
```

teste successivement les entiers i de 0 à n−1. Il renvoie le premier entier i tel que le reste de la division de a×i par n soit égal à 1.

**Il recherche donc l'inverse de a modulo n**, lorsqu'il existe.

### 2.b. Résolution de 17x ≡ 1 [26]

On cherche un entier x tel que :

\[
17x\equiv1\pmod{26}.
\]

Essayons x = 23 :

\[
17\times23=391=26\times15+1.
\]

Donc :

\[
\boxed{17^{-1}\equiv23\pmod{26}}.
\]

### 3. Démonstration de l'équivalence

On part de :

\[
17x+9\equiv y\pmod{26}.
\]

En multipliant les deux membres par 23, inverse de 17 modulo 26 :

\[
23(17x+9)\equiv23y\pmod{26}.
\]

Ainsi :

\[
x+207\equiv23y\pmod{26}.
\]

Or 207 = 26 × 8 − 1, donc 207 ≡ −1 [26]. On obtient :

\[
x-1\equiv23y\pmod{26},
\]

soit :

\[
\boxed{17x+9\equiv y\ [26]\iff x\equiv23y+1\ [26]}.
\]

La réciproque est également vraie puisque 23 est l'inverse de 17 modulo 26.

### 4. Décodage du mot JDXJ

Pour décoder, on utilise :

\[
x\equiv23y+1\pmod{26}.
\]

| Lettre codée | Valeur y | Calcul de 23y+1 modulo 26 | Valeur x | Lettre décodée |
|---|---:|---:|---:|---|
| J | 9 | 23×9+1 = 208 ≡ 0 | 0 | A |
| D | 3 | 23×3+1 = 70 ≡ 18 | 18 | S |
| X | 23 | 23×23+1 = 530 ≡ 10 | 10 | K |
| J | 9 | 23×9+1 = 208 ≡ 0 | 0 | A |

Le mot **JDXJ** se décode donc en :

\[
\boxed{\text{ASKA}}
\]

---

## Récapitulatif des résultats

| Exercice | Résultats essentiels |
|---|---|
| 1 | 1-b ; 2-b ; 3-b ; 4-c |
| 2 | u₁ = 1 ; u₂ = 4 ; suite strictement croissante ; uₙ = n² ; B3 : `=B2+2*A2+1` |
| 3A | P(1) = 0 ; a = −8 ; b = 20 ; racines : 1, 4+2i, 4−2i |
| 3B | X = (x²+x+y²−3y+2)/(x²+(y−2)²) ; Y = (x−y+2)/(x²+(y−2)²) ; droite y=x+2 excluant (0,2) ; cercle de centre (−1/2,3/2), rayon √2/2, excluant (0,2) |
| 4 | f(x)=x+1+3/(x+3) ; asymptote oblique y=x+1 ; asymptote verticale x=−3 ; limite à gauche en −3 : −∞ |
| 5 | M → F ; inverse de 17 modulo 26 : 23 ; JDXJ → ASKA |

**Conseil de méthode :** dans une copie de Terminale S, présenter les calculs intermédiaires, annoncer les propriétés utilisées (encadrement, récurrence, identification, inverse modulo, signe) et conclure explicitement à chaque question.
