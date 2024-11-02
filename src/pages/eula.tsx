import Link from "next/link";
import { styles } from "../styles/styles";

const Eula = () => {
  return (
    <code className="text-center max-w-80">
      <h2>EULA (Végfelhasználói Licencszerződés)</h2>

      <h3>1. Bevezetés</h3>
      <p>
        A jelen végfelhasználói licencszerződés (a továbbiakban: "Szerződés") a
        [Szoftver neve] (a továbbiakban: "Szoftver") használatára vonatkozik,
        amely a budapesti kocsmák felderítésére készült. A Szoftver
        használatával Ön (a továbbiakban: "Felhasználó") elfogadja a jelen
        Szerződés feltételeit.
      </p>

      <h3>2. Licencjog</h3>
      <p>
        A Szoftver használatára vonatkozóan Ön egy nem kizárólagos,
        átruházhatatlan, korlátozott licencet kap, amely kizárólag személyes,
        nem kereskedelmi célokra érvényes. A Szoftver nem használható üzleti
        célokra, és nem értékesíthető, másolható vagy terjeszthető.
      </p>

      <h3>3. Felhasználói kötelezettségek</h3>
      <p>Felhasználóként Ön vállalja, hogy:</p>
      <ul>
        <li>A Szoftvert kizárólag jogszerű célokra használja.</li>
        <li>
          Nem módosítja, nem visszafejti, és nem próbálja megkerülni a Szoftver
          védelmét.
        </li>
        <li>Nem osztja meg a Szoftverhez tartozó licencét másokkal.</li>
        <li>
          A Szoftver használatával kapcsolatosan nem vesz részt olyan
          tevékenységekben, amelyek sértik a vonatkozó jogszabályokat.
        </li>
      </ul>

      <h3>4. Adatvédelem</h3>
      <p>
        A Szoftver használata során gyűjtött adatokat a Felhasználó
        beleegyezésével és a vonatkozó adatvédelmi jogszabályoknak megfelelően
        kezeljük. Az adatok gyűjtésének célja a Szoftver működtetése,
        fejlesztése és a Felhasználói élmény javítása.
      </p>

      <h3>5. Felelősségkorlátozás</h3>
      <p>
        A Szoftver használatából eredő bármilyen közvetlen, közvetett,
        különleges vagy következményes kárért (beleértve, de nem korlátozva a
        nyereségkiesésre, adatvesztésre vagy egyéb gazdasági veszteségre) a
        Szoftver fejlesztője semmilyen felelősséget nem vállal.
      </p>

      <h3>6. Joghatóság</h3>
      <p>
        A jelen Szerződésre és annak értelmezésére a magyar jog az irányadó.
        Bármely vitás ügyben a Budapest területén található bíróságok
        kizárólagos illetékességgel bírnak.
      </p>

      <h3>7. A Szerződés módosítása</h3>
      <p>
        A fejlesztő fenntartja a jogot, hogy a jelen Szerződést bármikor
        módosítsa. A módosítások a Szoftver frissítéseivel együtt lépnek
        hatályba, és a Felhasználónak jogában áll elutasítani a módosított
        Szerződést.
      </p>

      <h3>8. Kapcsolat</h3>
      <p>
        Kérdéseivel, észrevételeivel vagy panaszával forduljon hozzánk a
        [kapcsolati e-mail cím] e-mail címen.
      </p>

      <h3>9. Elfogadás</h3>
      <p>
        A Szoftver használatával Ön elismeri, hogy elolvasta és megértette a
        jelen Szerződés feltételeit, és azt elfogadja.
      </p>
      <Link href={"/"}>
        <button className={`mx-auto ${styles.button.tailwind}`}>Vissza</button>
      </Link>
    </code>
  );
};

export default Eula;
