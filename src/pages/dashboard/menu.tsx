import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Product, Pub } from "../../../prisma/prisma/generated/client";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { AuthContext } from "../../utils/providers/AuthContext";
//TODO mivel reláció lett a Products (kiszervezve másik projektbe), hivatkozzunk rá
const Menu: NextPage = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [pubData, setPubData] = useState<
    (Pub & { products: Product[] }) | null
  >(null);

  if (!authContext) {
    return null;
  }

  const { user } = authContext;

  useEffect(() => {
    if (!user || !user.business) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user?.id) {
      // API hívás a pub adatainak lekérésére
      fetch(`/api/getAdminPub?adminId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPubData(data.pub);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);
  if (!user || !pubData) return <p>Loading...</p>;

  const drinks = pubData.products.filter((product) => product.type === "drink"); //külön segédfüggvényekbe
  const foods = pubData.products.filter((product) => product.type === "food");

  return (
    <DashboardLayout>
      <div className="w-full lg:w-1/2 p-4">
        {/* Majd külön komponensbe */}
        <h2 className="text-2xl font-bold mb-4">Jelenlegi Menük</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Italok</h3>
            {drinks.length > 0 ? (
              <ul className="space-y-4">
                {drinks.map((drink) => (
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
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Ételek</h3>
            {foods.length > 0 ? (
              <ul className="space-y-4">
                {foods.map((food) => (
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Menu;
