# Online Casino - Biztonságos Pénzköltés és Időkezelés Funkciócsomag

## Általános leírás

Ez a dokumentáció egy online casino platform **Biztonságos Pénzköltés és Időkezelés** funkciócsomagját mutatja be. A funkciócsomag célja, hogy a felhasználók felelősségteljesen játszhassanak, miközben a platform segítségével kontrollálják pénzköltésüket és játékidejüket. A funkcionális modell bemutatja a rendszer működését, a használati eseteket, a jogosultságokat, valamint a felületi terveket.

---

## Funkcionális modell

### 1. **Pénzköltési figyelmeztető rendszer**

- **Funkció:** A rendszer figyeli a felhasználó pénzköltését, és értesíti, ha közeledik vagy eléri a beállított keretet.
- **Működés:**
  - A felhasználó beállíthat napi, heti vagy havi költségkereteket.
  - A rendszer figyelmeztetést küld, ha a felhasználó eléri a keret 80%-át.
  - A keret elérésekor a rendszer letiltja a további pénzköltést.

### 2. **Játékidő figyelmeztető rendszer**

- **Funkció:** A rendszer figyeli a felhasználó játékidejét, és értesíti, ha túllépi a beállított időkeretet.
- **Működés:**
  - A felhasználó beállíthat napi játékidő-korlátot.
  - A rendszer figyelmeztetést küld, ha a felhasználó eléri az időkeret 80%-át.
  - Az időkeret elérésekor a rendszer kijelentkezteti a felhasználót.

### 3. **Önellenőrzési eszközök**

- **Funkció:** A felhasználó részletes statisztikákat kap a pénzköltéséről és játékidejéről.
- **Működés:**
  - A rendszer havi jelentéseket készít a felhasználó tevékenységeiről.
  - A felhasználó beállíthat célokat, például heti költségcsökkentést vagy időkorlátot.

---

## Használati esetek

### 1. **Pénzköltési figyelmeztetés**

- **Felhasználó:** Bejelentkezett felhasználó.
- **Előfeltétel:** A felhasználó beállított egy napi költségkeretet.
- **Forgatókönyv:**
  1.  A felhasználó elkezd játszani és pénzt költeni.
  2.  A rendszer figyeli a költéseket.
  3.  Ha a felhasználó eléri a keret 80%-át, a rendszer figyelmeztető üzenetet küld.
  4.  Ha a felhasználó eléri a keretet, a rendszer letiltja a további pénzköltést.

### 2. **Játékidő figyelmeztetés**

- **Felhasználó:** Bejelentkezett felhasználó.
- **Előfeltétel:** A felhasználó beállított egy napi játékidő-korlátot.
- **Forgatókönyv:**
  1.  A felhasználó elkezd játszani.
  2.  A rendszer figyeli a játékidőt.
  3.  Ha a felhasználó eléri az időkeret 80%-át, a rendszer figyelmeztető üzenetet küld.
  4.  Ha a felhasználó eléri az időkeretet, a rendszer kijelentkezteti.

### 3. **Önellenőrzési eszközök használata**

- **Felhasználó:** Bejelentkezett felhasználó.
- **Előfeltétel:** A felhasználó már játszott és költött pénzt a platformon.
- **Forgatókönyv:**
  1.  A felhasználó megnyitja az önellenőrzési eszközöket.
  2.  A rendszer megjeleníti a havi statisztikákat (pénzköltés, játékidő).
  3.  A felhasználó beállíthat új célokat a felelősségteljes játék érdekében.

---

## Jogosultságok

### 1. **Felhasználói jogosultságok**

- **Regisztrált felhasználó:**
  - Beállíthat pénzköltési és játékidő-korlátokat.
  - Kaphat figyelmeztetéseket a költésekről és játékidőről.
  - Hozzáférhet az önellenőrzési eszközökhöz.
- **Vendég felhasználó:**
  - Nem fér hozzá a funkciókhoz, regisztráció szükséges.

### 2. **Adminisztrátori jogosultságok**

- **Rendszergazda:**
  - Beállíthat alapértelmezett korlátokat az összes felhasználó számára.
  - Hozzáférhet a felhasználói statisztikákhoz.
  - Kezelheti a felhasználói fiókokat (pl. önkéntes kizárások).

---

## Felületi terv

### 1. **Profilbeállítások oldal**

- **Elemek:**
  - Pénzköltési korlát beállítása (napi/heti/havi).
  - Játékidő-korlát beállítása (napi).
  - Önkéntes kizárás beállítása (pl. 1 hónapra).

### 2. **Figyelmeztető üzenetek**

- **Design:**
  - Figyelmeztető üzenetek megjelennek a képernyőn, ha a felhasználó közeledik a korlátokhoz.
  - Üzenetek: "Figyelem! Elérte a napi költségkeret 80%-át." vagy "Figyelem! Már 1,5 órát töltött a platformon."

### 3. **Önellenőrzési eszközök oldal**

- **Elemek:**
  - Havi statisztikák (pénzköltés, játékidő).
  - Célok beállítása (pl. "Havi költségem 20%-kal kevesebb legyen.").
  - Jelentések letöltése (CSV vagy PDF formátumban).

---

## Kollaboráns tanulók

- **Bétéri Gábor**
- **Hansághy Bence**
- **Kerekes Dominik**

---

## Következtetés

A **Biztonságos Pénzköltés és Időkezelés** funkciócsomag lehetővé teszi a felhasználók számára, hogy felelősségteljesen játszanak, miközben a platform segítségével kontrollálják pénzügyeiket és időbeosztásukat. A funkcionális modell, a használati esetek, a jogosultságok és a felületi terv részletesen bemutatják, hogyan valósul meg ez a cél. A kollaboráns tanulók közreműködése biztosítja, hogy a projekt minden szempontból kidolgozott legyen.
