import { Dialog, DialogTitle } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { NextPage } from "next";
import { Product } from "prisma/generated/client";
import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { usePubContext } from "../../utils/providers/DashboardContext";

const Menu: NextPage = () => {
  const pubContext = usePubContext();

  if (!pubContext) return <p>Loading...</p>;

  const { pubData, setPubData } = pubContext;
  const drinks = pubData.products?.filter(
    (product: Product) => product.type === "drink"
  );
  const foods = pubData.products?.filter(
    (product: Product) => product.type === "food"
  );

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    type: "drink", // Alapértelmezett típus
    pubId: "", // PubId szükséges
    createdAt: new Date(), // Automatikusan generált dátum
    id: "", // Prisma automatikusan generálja az id-t
  });

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  //API call
  const handleAddProduct = async () => {
    if (!pubData || !pubData.id) {
      console.error("Nincs PubID a pubData-ban.");
      return;
    }

    const productWithPubId = {
      ...newProduct,
      pubId: pubData.id, //Feltételezve, hogy a pubData-ban benne van a pubId
    };

    try {
      const response = await fetch("/api/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productWithPubId),
      });

      const data = await response.json();

      if (data.product) {
        // Ha sikeresen mentettük a terméket, frissítjük a pubData-t
        const updatedProducts = [...(pubData.products || []), data.product];
        setPubData({ ...pubData, products: updatedProducts });

        // Modal bezárása és űrlap törlése
        closeModal();
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          type: "drink",
          pubId: "", // Reset pubId
          createdAt: new Date(), // Reset createdAt
          id: "", // Reset id
        });
      } else {
        console.error("Nem sikerült a termék hozzáadása.");
      }
    } catch (error) {
      console.error("Hiba történt a termék mentése során:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full lg:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Jelenlegi Menük</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Italok</h3>
            {drinks && drinks.length > 0 ? (
              <ul className="space-y-4">
                {drinks.map((drink: Product) => (
                  <li key={drink.name} className="border p-4 rounded-lg shadow">
                    <p className="font-semibold text-lg">{drink.name}</p>
                    <p className="text-sm text-gray-600">{drink.description}</p>
                    <p className="mt-2">Ár: {drink.price} Ft</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nincsenek italok a menüben.</p>
            )}
            <button
              onClick={openModal}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Új ital hozzáadása
            </button>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Ételek</h3>
            {foods && foods.length > 0 ? (
              <ul className="space-y-4">
                {foods.map((food: Product) => (
                  <li key={food.name} className="border p-4 rounded-lg shadow">
                    <p className="font-semibold text-lg">{food.name}</p>
                    <p className="text-sm text-gray-600">{food.description}</p>
                    <p className="mt-2">Ár: {food.price} Ft</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nincsenek ételek a menüben.</p>
            )}
            <button
              onClick={openModal}
              className="mt-4 inline-flex items-center px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Új étel hozzáadása
            </button>
          </div>
        </div>
      </div>

      {/* Modal for adding product */}
      <Dialog open={isOpen} onClose={closeModal}>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
          <div className="bg-[var(--background)] p-6 rounded-lg max-w-md w-full">
            <DialogTitle className="text-xl font-semibold mb-4">
              Termék hozzáadása
            </DialogTitle>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Név</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="mt-2 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Leírás</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Ár (Ft)</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: +e.target.value })
                  }
                  className="mt-2 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-medium">Típus</label>
                <select
                  value={newProduct.type}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, type: e.target.value })
                  }
                  className="mt-2 block w-full p-2 border rounded-md"
                >
                  <option value="drink">Ital</option>
                  <option value="food">Étel</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Mégse
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Hozzáadás
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </DashboardLayout>
  );
};

export default Menu;
