import { TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Product, Pub } from "../../../../../prisma/prisma/generated/client";
import { JsonValue } from "../../../../../prisma/prisma/generated/client/runtime/library";
import { OpeningHoursEntry } from "../../../../../type";
import DeleteConfirm from "../../DeleteConfim";

interface DisplayPubInfoProps {
  pubData: Pub & { products?: Product[] };
  updatePubData: (pub: (Pub & { products?: Product[] }) | null) => void;
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
  const [editingBaseInfo, setEditingBaseInfo] = useState(false);
  const [editingProducts, setEditingProducts] = useState(false);
  const [formData, setFormData] = useState<Pub & { products?: Product[] }>({
    ...pubData,
    products: pubData.products || [],
  });
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  ); // Törlés előkészítése
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Törlés megerősítő
  const [error, setError] = useState<string>("");

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
  //Nyitvatartás változásának kezelése
  const handleChangeOpeningHours = (day: string, value: string) => {
    setFormData((prevState) => {
      const openingHoursArray = parseOpeningHours(prevState.openingHours ?? "");
      const updatedOpeningHoursArray = openingHoursArray.map((entry) =>
        entry.day === day ? { ...entry, hours: value.trim() || "zárva" } : entry
      );

      return {
        ...prevState,
        openingHours: JSON.stringify(updatedOpeningHoursArray),
      };
    });
  };
  //Termékek változásának kezelése
  const handleProductChange = (
    productId: string,
    field: keyof Product,
    value: string
  ) => {
    setFormData((prevState) => {
      if (!prevState.products) return prevState;

      const updatedProducts = prevState.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              [field]: field === "price" ? parseFloat(value) || 0 : value,
            }
          : product
      );
      return {
        ...prevState,
        products: [...updatedProducts], // Fontos: új másolat
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "googleRating" || name === "rating") {
      const rating = Number(value);
      if (value === "" || (!isNaN(rating) && rating >= 0 && rating <= 5)) {
        setFormData((prevState) => ({
          ...prevState,
          [name]: rating, // A megfelelő mező frissítése (googleRating vagy rating)
        }));
        setError("");
      } else {
        setError(
          `${
            name === "googleRating" ? "Google" : "KocsMate"
          } értékelés 0 és 5 között kell legyen.`
        );
      }
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };
  //Törlés
  const confirmDeleteProduct = async () => {
    if (!deletingProductId) return;
    try {
      const response = await fetch("/api/deleteProduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pubId: formData.id,
          productId: deletingProductId,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFormData((prevState) => ({
          ...prevState,
          products: prevState.products?.filter(
            (product) => product.id !== deletingProductId
          ),
        }));
        setDeletingProductId(null);
        setShowDeleteConfirm(false);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Hiba történt a törlés során:", error);
      setError("Valami hiba történt a törlés során.");
    }
  };

  const cancelDelete = () => {
    setDeletingProductId(null);
    setShowDeleteConfirm(false);
  };

  const handleDeleteProduct = (productId: string) => {
    setDeletingProductId(productId);
    setShowDeleteConfirm(true);
  };

  const handleSaveBaseInfo = async () => {
    const errors: Array<string> = [];
    const phonePattern = /^(06|\+(\d{1,3}))\s?\d{1,2}\s?\d{1,4}\s?\d{1,4}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const timePattern = /^(?:\d{2}):(\d{2})\s?[-–]\s?(\d{2}):(\d{2})$/;
    const openingHoursArray = parseOpeningHours(formData.openingHours);

    // Validáció
    if (formData.phone && !phonePattern.test(formData.phone)) {
      errors.push("Telefonszám formátuma nem megfelelő.");
    }
    if (formData.email && !emailPattern.test(formData.email)) {
      errors.push("Email formátuma nem megfelelő.");
    }
    openingHoursArray.forEach(({ day, hours }) => {
      if (hours !== "zárva" && !timePattern.test(hours)) {
        errors.push(`${day} nyitvatartásának formátuma nem megfelelő.`);
      }
    });

    // Hibák megjelenítése, ha vannak
    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }
    try {
      const response = await fetch("/api/updatePub", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          openingHours: JSON.stringify(openingHoursArray),
        }),
      });

      const result = await response.json();
      if (result.success) {
        updatePubData(result.pub);
        setEditingBaseInfo(false);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Hiba történt a frissítés során:", error);
      setError("Valami hiba történt a frissítés során.");
    }
  };

  const handleSaveProducts = async () => {
    try {
      const response = await fetch("/api/updatePubProducts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          products: formData.products,
        }),
      });
      const result = await response.json();
      if (result.success) {
        updatePubData(result.pub);
        setEditingProducts(false);
        setError("");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Hiba történt a frissítés során:", error);
      setError("Valami hiba történt a frissítés során.");
    }
  };

  const openingHoursArray = parseOpeningHours(formData.openingHours);
  const products = formData.products;
  const drinks = products?.filter((product) => product.type === "drink") || [];
  const foods = products?.filter((product) => product.type === "food") || [];

  return (
    <section className="relative flex rounded-2xl px-8 max-w-3xl mx-auto mt-4">
      <div className="flex w-full flex-col">
        <div className="shadow-xl bg-[var(--butterscotch)] p-8 w-full">
          {/* Általános adatok szekció */}
          {editingBaseInfo && (
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
              <label className="block mb-2">Értékelés:</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
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
                      )?.hours || "zárva"
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
                onClick={handleSaveBaseInfo}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >
                Mentés
              </button>
              <button
                onClick={() => setEditingBaseInfo(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded mt-4 ml-4"
              >
                Mégse
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          )}

          {/* Kínálat frissítése szekció */}
          {editingProducts && (
            <div>
              <h2 className="text-4xl">Kínálat frissítése</h2>
              <h3 className="text-xl font-semibold mb-4">Italok</h3>
              {drinks.map((drink) => (
                <div key={drink.id} className="flex mb-4">
                  <input
                    type="text"
                    value={drink.name}
                    onChange={(e) =>
                      handleProductChange(drink.id, "name", e.target.value)
                    }
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    value={drink.price}
                    onChange={(e) =>
                      handleProductChange(drink.id, "price", e.target.value)
                    }
                    className="w-1/3 mb-2 p-2 border border-gray-300 rounded"
                  />
                  {/* <input
                    type="text"
                    value={drink.description}
                    onChange={(e) =>
                      handleProductChange(
                        drink.id,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                    placeholder="Leírás"
                  /> */}
                  <button
                    onClick={() => handleDeleteProduct(drink.id)}
                    className="ml-2 text-red-500"
                  >
                    <TrashIcon className="h-7 w-7" />
                  </button>
                </div>
              ))}

              <h3 className="text-xl font-semibold mb-4">Ételek</h3>
              {foods.map((food) => (
                <div key={food.id} className="flex mb-4">
                  <input
                    type="text"
                    value={food.name}
                    onChange={(e) =>
                      handleProductChange(food.id, "name", e.target.value)
                    }
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="number"
                    value={food.price}
                    onChange={(e) =>
                      handleProductChange(food.id, "price", e.target.value)
                    }
                    className="w-1/3 mb-2 p-2 border border-gray-300 rounded"
                  />
                  <button
                    onClick={() => handleDeleteProduct(food.id)}
                    className="ml-2 text-red-500"
                  >
                    <TrashIcon className="h-7 w-7" />
                  </button>
                </div>
              ))}
              {showDeleteConfirm && (
                <DeleteConfirm
                  onCancel={cancelDelete}
                  onConfirm={confirmDeleteProduct}
                />
              )}
              <button
                onClick={handleSaveProducts}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
              >
                Mentés
              </button>
              <button
                onClick={() => setEditingProducts(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded mt-4 ml-4"
              >
                Mégse
              </button>
            </div>
          )}
          {/* Alapadatok vagy termékek szerkesztésének lehetősége */}
          {!editingBaseInfo && !editingProducts && (
            <div>
              <h2 className="text-4xl">{formData.name}</h2>
              <p>
                <strong>Cím:</strong> {formData.fullAddress}
              </p>
              <p>
                <strong>Telefonszám:</strong> {formData.phone}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Google értékelés:</strong> {formData.googleRating}
              </p>
              <p>
                <strong>KocsMate értékelés:</strong> {formData.rating}
              </p>
              <p>
                <strong>Működik?</strong>
                {formData.state === "func" ? "Igen" : "Nem"}
              </p>
              <h3 className="text-2xl mt-4">Nyitvatartás</h3>
              <ul>
                {openingHoursArray.map(({ day, hours }) => (
                  <li key={day}>
                    <strong>{day}:</strong> {hours}
                  </li>
                ))}
              </ul>
              {/*Később komponensbe, ez átmenetileg jelenik csak meg */}
              <div className="w-full lg:w-1/2 mt-4">
                <h2 className="text-2xl font-bold mb-4">Jelenlegi Menük</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Italok</h3>
                    {drinks && drinks.length > 0 ? (
                      <ul className="space-y-4">
                        {drinks.map((drink) => (
                          <li
                            key={drink.name}
                            className="border p-4 rounded-lg shadow"
                          >
                            <p className="font-semibold text-lg">
                              {drink.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {drink.description}
                            </p>
                            <p className="mt-2">Ár: {drink.price} Ft</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        Nincsenek italok a menüben.
                      </p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Ételek</h3>
                    {foods && foods.length > 0 ? (
                      <ul className="space-y-4">
                        {foods.map((food) => (
                          <li
                            key={food.name}
                            className="border p-4 rounded-lg shadow"
                          >
                            <p className="font-semibold text-lg">{food.name}</p>
                            <p className="text-sm text-gray-600">
                              {food.description}
                            </p>
                            <p className="mt-2">Ár: {food.price} Ft</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">
                        Nincsenek ételek a menüben.
                      </p>
                    )}
                  </div>
                </div>
                {pubData.state === "func" ? (
                  <div className="flex flex-col p-2 gap-2 justify-between mt-4">
                    <button
                      onClick={() => setEditingBaseInfo(true)}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Alapadatok szerkesztése
                    </button>
                    <button
                      onClick={() => setEditingProducts(true)}
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                    >
                      Kínálat szerkesztése
                    </button>
                  </div>
                ) : (
                  <p>
                    Az oldal {pubData.state} állapotban van, így nem
                    szerkeszthető!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayPubInfo;
