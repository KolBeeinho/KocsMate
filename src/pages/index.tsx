import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import PopUpOver18 from "src/components/mobile/popUpOver18";
import AppleLogo from "../components/web/AppleLogo";
import GoogleLogo from "../components/web/GoogleLogo";
import isMobile from "../utils/checkOS";
import { AuthContext } from "../utils/providers/AuthContext";
import LoginPage from "./loginPage";

export const Home: NextPage = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("Authentikációs hiba");
    return null;
  }
  const { user } = authContext;
  return (
    <>
      {isMobile() ? (
        <>
          <LoginPage />
          <PopUpOver18 />
        </>
      ) : (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
          <div className="max-w-6xl w-full bg-[var(--kek)] rounded-2xl shadow-lg p-8 relative">
            <div className="absolute top-4 right-4">
              <Link href="/login">
                <button className="bg-[var(--szurke)] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[var(--glaucous)] transition">
                  Bejelentkezés
                </button>
              </Link>
              <br />
              <br />
              <Link href="/search">
                <button className="bg-[var(--szurke)] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[var(--glaucous)] transition">
                  Mutass egy kocsmát!
                </button>
              </Link>
              <br />
              <Link href="/dashboard">
                <button
                  className="bg-[var(--szurke)] mt-8 text-white py-2 px-4 rounded-lg shadow-md hover:bg-[var(--glaucous)] transition"
                  disabled={!user?.business}
                >
                  Dashboard
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Section */}
              <div className="flex flex-col justify-center space-y-6 text-[var(--betu-szin)]">
                <h2 className="text-4xl font-bold leading-snug">
                  A legjobb kocsmák <br /> Számodra
                </h2>
                <p className="text-lg">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lore
                  mauris et justo sed diam non pro. Lorem ipsum dolor sit am
                </p>
                <div className="flex space-x-4">
                  <button className="flex items-center space-x-2 bg-[var(--glaucous)] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[var(--yinmn-blue)] transition">
                    <GoogleLogo />
                    <span>SZEREZD MEG Google Play</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-[var(--glaucous)] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[var(--yinmn-blue)] transition">
                    <AppleLogo />
                    <span>LETÖLTHETŐ AZ App Store</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2 bg-[var(--szurke)] p-2 rounded-lg shadow-md">
                  <Image
                    src="/path-to-user1.jpg"
                    alt="user1"
                    className="w-8 h-8 rounded-full"
                    width={200}
                    height={200}
                  />
                  <Image
                    src="/path-to-user2.jpg"
                    alt="user2"
                    className="w-8 h-8 rounded-full"
                    width={200}
                    height={200}
                  />
                  <Image
                    src="/path-to-user3.jpg"
                    alt="user3"
                    className="w-8 h-8 rounded-full"
                    width={200}
                    height={200}
                  />
                  <button className="ml-4 text-white"> Értékeld minket </button>
                </div>
              </div>

              {/* Right Section */}
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src="/path-to-image1.jpg"
                  alt="bar"
                  className="rounded-xl object-cover h-32 w-full"
                  width={200}
                  height={200}
                />
                <Image
                  src="/path-to-image2.jpg"
                  alt="pool"
                  className="rounded-xl object-cover h-32 w-full"
                  width={200}
                  height={200}
                />
                <Image
                  src="/path-to-image3.jpg"
                  alt="cheers"
                  className="rounded-xl object-cover h-32 w-full col-span-2"
                  width={200}
                  height={200}
                />
                <Image
                  src="/path-to-image4.jpg"
                  alt="tap"
                  className="rounded-xl object-cover h-32 w-full col-span-2"
                  width={200}
                  height={200}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
