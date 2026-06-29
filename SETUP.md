# Online redigering af modernistisk-enevaelde.netlify.app

Denne guide gør, at **flere kan redigere hjemmesiden online** via en login-side (`/admin`) – uden at kunne kode, og helt uafhængigt af Claude.

Sådan hænger det sammen:

- **GitHub** = "motoren". Den gemmer hjemmesidens filer. (I har allerede en konto.)
- **Netlify** = viser hjemmesiden. Hver gang noget ændres på GitHub, opdaterer Netlify automatisk siden på ~1 minut.
- **Decap CMS** = redigeringssiden på `jeres-side.dk/admin`, hvor man retter tekster, mærkesager og logo via formularer.
- **DecapBridge** = login-systemet, så redaktørerne kan logge ind med **e-mail** (eller Google/Microsoft) – de behøver **ikke** en GitHub-konto.

Engangsopsætningen tager ca. 20-30 minutter. Bagefter er det bare at logge ind og skrive.

---

## Hvad indeholder projektet

```
index.html, maerkesager.html, politik.html, politik-*.html, om-os.html   ← siderne
style.css                                                                 ← design
assets/logo.svg                                                           ← logoet
data/site.json          ← forsidetekster, kontakt, logo
data/maerkesager.json   ← mærkesagerne
data/politik.json       ← alle politikområder
js/render.js            ← viser indholdet fra data-filerne
admin/index.html        ← redigeringssiden
admin/config.yml        ← hvad man kan redigere (+ backend skal indsættes, trin 4)
netlify.toml            ← Netlify-indstillinger
```

Indholdet ligger i `data/`-filerne. Når en redaktør gemmer i `/admin`, ændres en data-fil på GitHub, og siden opdaterer sig selv. **Ingen "build" der kan gå i stykker.**

---

## Trin 1 · Læg koden i et GitHub-repo

**Nemmest (anbefales): GitHub Desktop**

1. Hent **GitHub Desktop** (desktop.github.com) og log ind.
2. *File → New repository* → navn fx `modernistisk-enevaelde` → vælg en mappe → *Create*.
3. Åbn repo-mappen (knappen *Show in Finder/Explorer*) og kopiér **alt indholdet** fra denne projektmappe ind (så `index.html`, mapperne `admin/`, `data/`, `assets/`, `js/` osv. ligger i roden af repoet).
4. Tilbage i GitHub Desktop: skriv en besked (fx "Første version") → *Commit to main* → *Publish repository*. (Privat eller offentligt – begge virker.)

**Alternativ: github.com i browseren** → *New repository* → på repo-siden *Add file → Upload files* → træk alle filer og mapper ind → *Commit changes*.

> Notér jeres repo-sti: `DIN-GITHUB-BRUGER/modernistisk-enevaelde` – den skal bruges i trin 4.

---

## Trin 2 · Forbind Netlify til repoet (så ændringer går live automatisk)

Målet: at `modernistisk-enevaelde.netlify.app` fremover henter sin kode fra GitHub.

**Den pæne vej (behold samme adresse):**

1. Netlify → vælg jeres site *modernistisk-enevaelde*.
2. *Site configuration → Build & deploy → Continuous deployment* → **Link repository** / *Link site to a Git repository*.
3. Vælg GitHub → vælg repoet → **Branch:** `main`, **Build command:** (tom), **Publish directory:** `.` (punktum = roden) → gem/deploy.

**Hvis den knap ikke findes:** lav i stedet *Add new site → Import an existing project → GitHub → vælg repoet* (samme indstillinger som ovenfor). I får så en midlertidig adresse. Flyt jeres navn over: på det gamle site *Site configuration → Change site name* (giv det fx `modernistisk-enevaelde-old`), og på det nye site *Change site name* → `modernistisk-enevaelde`. Så er adressen den samme som før.

Tjek at `https://modernistisk-enevaelde.netlify.app` stadig virker efter deploy.

---

## Trin 3 · Tjek at admin-siden er der

Den ligger allerede i projektet. Efter trin 2 kan I åbne:

```
https://modernistisk-enevaelde.netlify.app/admin
```

Den vil bede om login, men virker først, når trin 4 er sat op. Det er forventet.

---

## Trin 4 · Sæt login op med DecapBridge (gratis)

1. Opret en gratis konto på **https://decapbridge.com** (knappen *Sign up*). Gratisplanen dækker 3 sites og 10 redaktører pr. site.
2. I dashboardet: **Add a site**, og udfyld:
   - **Git provider:** GitHub
   - **Git repository:** `DIN-GITHUB-BRUGER/modernistisk-enevaelde`
   - **Git access token:** se boksen nedenfor
   - **Decap CMS login URL:** `https://modernistisk-enevaelde.netlify.app/admin/index.html`
   - **Auth type:** vælg **Classic** (login med e-mail + adgangskode) eller **PKCE** (login med Google/Microsoft). I kan ændre det senere.
3. Klik **Create site**. DecapBridge viser nu en færdig **`config.yml`-backend-blok**.
4. Åbn `admin/config.yml` i projektet og **erstat hele den øverste `backend:`-blok** (den med pladsholderen) med blokken fra DecapBridge. Lad resten af filen (collections osv.) være.
5. Gem og send ændringen til GitHub (GitHub Desktop: *Commit to main → Push*, eller upload den ændrede `config.yml` i browseren). Netlify opdaterer på ~1 min.

> **GitHub access token (fine-grained, anbefales):**
> Gå til github.com → *Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token*.
> - **Repository access:** Only select repositories → vælg `modernistisk-enevaelde`.
> - **Permissions → Repository permissions → Contents:** **Read and write**.
> - Generér, kopiér tokenet, og indsæt det i DecapBridge. (Gem det et sikkert sted – det vises kun én gang.)

Når det er gemt, klik **Go to CMS** i DecapBridge (eller åbn `/admin`) og log ind.

---

## Trin 5 · Invitér de andre redaktører

1. DecapBridge-dashboard → jeres site → **Manage collaborators**.
2. Skriv en e-mail → *Send*. Personen får en invitation, vælger selv login (Google/Microsoft/adgangskode) og kan redigere med det samme.
3. Gentag for hver redaktør (op til 10 på gratisplanen).

(En betroet person kan gøres til *admin*, så vedkommende selv kan invitere – det kræver dog en betalt plan.)

---

## Sådan redigerer I hver dag

Gå til `https://modernistisk-enevaelde.netlify.app/admin` og log ind. I venstre side er der tre punkter:

- **Mærkesager** – tilføj/fjern/omskriv mærkesager. Klik *Add Mærkesag*, skriv overskrift + tekst, **Save → Publish**.
- **Generelt (forside, logo, kontakt)** – partinavn, slogan, forsidetekster, statsminister­kandidat, kontakt – og **logoet**: feltet *Logo* → upload et nyt billede → **Publish**. Det skifter logoet alle steder.
- **Politik (emnesider)** – ret titel, indledning og punkterne på hvert område. Hvert afsnit har en *Punkt-stil*: flueben (positiv), kryds (negativ) eller nøgleord.

Efter **Publish** opdaterer siden sig selv på ca. 1 minut. Tryk evt. Ctrl/Cmd+Shift+R for at se ændringen med det samme.

---

## Godt at vide

- **Sikkerhedskopi & fortrydelse:** alt gemmes i GitHub med historik, så enhver ændring kan rulles tilbage.
- **Billeder/logo** lægges automatisk i `assets/`-mappen.
- **At tilføje et helt nyt politik-*område* med sin egen side** kræver en ny HTML-side – det er den ene ting, der ikke kan gøres fra `/admin` alene. Sig til, så laver jeg siden (det tager få minutter). At *redigere* de eksisterende områder, alle mærkesager, tekster og logo klarer I selv online.
- **Hjælp:** DecapBridge har en kontaktformular og Discord, hvis login driller. Decap CMS-dokumentation: decapcms.org/docs.

God fornøjelse! 🎉
