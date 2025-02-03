import { useEffect, useState } from "react";
import { Pub } from "../../../../../prisma/prisma/generated/client";
import { JsonValue } from "../../../../../prisma/prisma/generated/client/runtime/library";
import { OpeningHoursEntry } from "../../../../../type";

interface DisplayPubInfoProps {
  pubData: Pub;
  updatePubData: (updatedData: Pub) => void;
}

const daysOfWeek = [
  "hétfő",
  "kedd",
  "szerda",
  "csütörtök",
  "péntek",
  "szombat",
  "vasárnap",
];

const DisplayPubInfo: React.FC<DisplayPubInfoProps> = ({
  pubData,
  updatePubData,
}) => {
  const [display, setDisplay] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Pub>(pubData);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (window.location.pathname === "/dashboard/") {
      setDisplay(false);
    } else if (window.location.pathname === "/dashboard/settings") {
      setDisplay(true);
    }
  }, []);

  const parseOpeningHours = (
    openingHours: string | OpeningHoursEntry[] | JsonValue
  ): OpeningHoursEntry[] => {
    if (typeof openingHours === "string") {
      try {
        const parsedJSON = JSON.parse(openingHours);
        if (typeof parsedJSON === "object" && parsedJSON !== null) {
          return parseOpeningHours(parsedJSON);
        }
      } catch {
        const parsedEntries = openingHours.split(", ").map((entry) => {
          const [day, hours] = entry.split(": ");
          return { day: day.trim(), hours: hours?.trim() || "zárva" }; // Ha üres, zárva
        });
        return daysOfWeek.map(
          (day) =>
            parsedEntries.find((entry) => entry.day.trim() === day.trim()) || {
              day,
              hours: "zárva",
            } // Ha üres, zárva
        );
      }
    }
    if (typeof openingHours === "object" && openingHours !== null) {
      return daysOfWeek.map((day) => {
        const found = (openingHours as OpeningHoursEntry[]).find(
          (entry) => entry.day.trim() === day.trim()
        );
        return found || { day, hours: "zárva" }; // Ha nincs, zárva
      });
    }
    console.error("⚠️ Ismeretlen openingHours formátum:", openingHours);
    return daysOfWeek.map((day) => ({ day, hours: "zárva" })); // Ha semmi nincs, zárva
  };

  const handleChangeOpeningHours = (day: string, value: string) => {
    setFormData((prevState) => {
      const openingHoursArray = parseOpeningHours(prevState.openingHours ?? "");
      const updatedOpeningHoursArray = openingHoursArray.map(
        (entry) =>
          entry.day === day
            ? { ...entry, hours: value.trim() || "zárva" }
            : entry // Ha üres, "zárva"
      );

      return {
        ...prevState,
        openingHours: JSON.stringify(updatedOpeningHoursArray),
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleanPhone = formData.phone.replace(/\s+/g, "");
      setFormData((prevState) => ({ ...prevState, phone: cleanPhone }));
    }

    if (name === "googleRating") {
      if (value === "") {
        setFormData((prevState) => ({ ...prevState, googleRating: 0 }));
        return;
      }
      const rating = Number(value);
      if (!isNaN(rating)) {
        setFormData((prevState) => ({ ...prevState, googleRating: rating }));
      } else {
        setError("Google értékelés csak számokat tartalmazhat.");
        return;
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSave = () => {
    const errors: Array<string> = [];
    // Google értékelés ellenőrzése
    if (formData.googleRating < 1 || formData.googleRating > 5) {
      //TODO ez lesz a felhasználói értékelés
      errors.push("Google értékelés 1 és 5 között kell legyen.");
    }

    // Telefonszám ellenőrzése, ha nem üres
    const phonePattern = /^(06|\+(\d{1,3}))\s?\d{1,2}\s?\d{1,4}\s?\d{1,4}$/;
    if (formData.phone && !phonePattern.test(formData.phone)) {
      errors.push("Telefonszám formátuma nem megfelelő.");
    }

    // Email ellenőrzés
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push("Email formátuma nem megfelelő.");
    }

    // Nyitvatartás ellenőrzése
    const openingHoursArray = parseOpeningHours(formData.openingHours);
    const timePattern = /^(?:\d{2}):(\d{2})\s?[-–]\s?(\d{2}):(\d{2})$/;
    openingHoursArray.forEach(({ day, hours }) => {
      //console.log(hours);
      if (hours !== "zárva" && !timePattern.test(hours)) {
        errors.push(`${day} nyitvatartásának formátuma nem megfelelő.`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    updatePubData({
      ...formData,
      openingHours: JSON.stringify(openingHoursArray),
    });
    setEditing(false);
    setError("");
  };

  const openingHoursArray = parseOpeningHours(
    formData.openingHours
  ) as OpeningHoursEntry[];

  return (
    <section className="relative flex rounded-2xl p-8 max-w-3xl mx-auto mt-8">
      <div className="flex w-full flex-col">
        <div className="shadow-xl bg-[var(--butterscotch)] p-8 w-full">
          {editing ? (
            <div>
              <h2 className="text-4xl">Általános adatok</h2>
              <label className="block mb-2">Név:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <label className="block mb-2">Cím:</label>
              <input
                type="text"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <label className="block mb-2">Telefonszám:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <label className="block mb-2">Email-cím:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <label className="block mb-2">Google értékelés:</label>
              <input
                type="number"
                name="googleRating"
                value={formData.googleRating}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <label className="block mb-2">Nyitvatartás:</label>
              {daysOfWeek.map((day) => (
                <div key={day} className="flex items-center mb-4">
                  <label className="w-1/4 pr-4">{day}:</label>
                  <input
                    type="text"
                    value={
                      openingHoursArray.find(
                        (entry) => entry.day.trim() === day.trim()
                      )?.hours || "zárva" // Ha üres, "zárva"
                    }
                    onChange={(e) =>
                      handleChangeOpeningHours(day, e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="pl. 09:00-18:00"
                  />
                </div>
              ))}

              <button
                onClick={handleSave}
                className="w-full mt-4 py-3 px-6 text-white bg-green-500 font-bold text-center rounded-lg hover:bg-green-600 transition duration-300"
              >
                Változtatások mentése
              </button>
              {error && (
                <div className="mt-4 p-4 text-red-500 border border-red-500 rounded bg-red-100">
                  <p>{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {pubData.name}
              </h2>
              <p className="text-lg text-gray-700 mt-2">
                {pubData.fullAddress}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                Telefon: {pubData.phone || "N/A"}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                Email-cím: {pubData.email || "N/A"}
              </p>
              <p className="text-lg text-gray-700 mt-2">
                Google értékelés: {pubData.googleRating} ⭐
              </p>
              <p className="text-lg text-gray-700 mt-2">Nyitvatartás:</p>
              <ul className="text-lg text-gray-700 mt-2">
                {openingHoursArray.map(({ day, hours }) => (
                  <li key={day}>
                    <strong>{day}:</strong> {hours || "zárva"}
                  </li>
                ))}
              </ul>
              {display && (
                <button
                  onClick={() => setEditing(true)}
                  className="w-full mt-4 py-3 px-6 text-white bg-yellow-500 font-bold text-center rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  Kocsma adatainak szerkesztése
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayPubInfo;
