import Link from "next/link";
import { components, eulaStyle } from "../styles/styles";
import isMobile from "../utils/checkOS";

const Eula = () => {
  // majd átkerül más fájlba
  const sections = [
    {
      title: "1. Bevezetés",
      content: `A jelen végfelhasználói licencszerződés (a továbbiakban: "Szerződés") a [Szoftver neve] (a továbbiakban: "Szoftver") használatára vonatkozik, amely a budapesti kocsmák felderítésére készült. A Szoftver használatával Ön (a továbbiakban: "Felhasználó") elfogadja a jelen Szerződés feltételeit.`,
    },
    {
      title: "2. Licencjog",
      content: `A Szoftver használatára vonatkozóan Ön egy nem kizárólagos, átruházhatatlan, korlátozott licencet kap, amely kizárólag személyes, nem kereskedelmi célokra érvényes. A Szoftver nem használható üzleti célokra, és nem értékesíthető, másolható vagy terjeszthető.`,
    },
    {
      title: "3. Felhasználói kötelezettségek",
      content: `Felhasználóként Ön vállalja, hogy:`,
      list: [
        "A Szoftvert kizárólag jogszerű célokra használja.",
        "Nem módosítja, nem visszafejti, és nem próbálja megkerülni a Szoftver védelmét.",
        "Nem osztja meg a Szoftverhez tartozó licencét másokkal.",
        "A Szoftver használatával kapcsolatosan nem vesz részt olyan tevékenységekben, amelyek sértik a vonatkozó jogszabályokat.",
      ],
    },
    {
      title: "4. Adatvédelem",
      content: `A Szoftver használata során gyűjtött adatokat a Felhasználó beleegyezésével és a vonatkozó adatvédelmi jogszabályoknak megfelelően kezeljük. Az adatok gyűjtésének célja a Szoftver működtetése, fejlesztése és a Felhasználói élmény javítása.`,
    },
    {
      title: "5. Felelősségkorlátozás",
      content: `A Szoftver használatából eredő bármilyen közvetlen, közvetett, különleges vagy következményes kárért (beleértve, de nem korlátozva a nyereségkiesésre, adatvesztésre vagy egyéb gazdasági veszteségre) a Szoftver fejlesztője semmilyen felelősséget nem vállal.`,
    },
    {
      title: "6. Joghatóság",
      content: `A jelen Szerződésre és annak értelmezésére a magyar jog az irányadó. Bármely vitás ügyben a Budapest területén található bíróságok kizárólagos illetékességgel bírnak.`,
    },
    {
      title: "7. A Szerződés módosítása",
      content: `A fejlesztő fenntartja a jogot, hogy a jelen Szerződést bármikor módosítsa. A módosítások a Szoftver frissítéseivel együtt lépnek hatályba, és a Felhasználónak jogában áll elutasítani a módosított Szerződést.`,
    },
    {
      title: "8. Kapcsolat",
      content: `Kérdéseivel, észrevételeivel vagy panaszával forduljon hozzánk a [kapcsolati e-mail cím] e-mail címen.`,
    },
    {
      title: "9. Elfogadás",
      content: `A Szoftver használatával Ön elismeri, hogy elolvasta és megértette a jelen Szerződés feltételeit, és azt elfogadja.`,
    },
  ];

  return (
    <div
      className={`${
        isMobile() ? eulaStyle.mobileContainer : eulaStyle.container
      }`}
    >
      <h2>EULA (Végfelhasználói Licencszerződés)</h2>
      {sections.map((section, index) => (
        <div key={index}>
          <h3>{section.title}</h3>
          <p>{section.content}</p>
          {section.list && (
            <ul>
              {section.list.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <Link href={"/"}>
        <button className={`mx-auto ${components.button.homePageButton}`}>
          Vissza
        </button>
      </Link>
    </div>
  );
};

export default Eula;
