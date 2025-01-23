import { signIn } from "next-auth/react"; // NextAuth login function
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { components, formStyles } from "../styles/styles";
import useLoading from "../utils/hooks/useLoad";
import KocsMateLogo from "./KocsMateLogo";
import LoginButtons from "./LoginMedia";
// import KocsMateLogo from "./KocsMateLogo";
// import en from "../../../public/locales/en/Reviews/reviewsection";
// import en2 from "../../../public/locales/en/Reviews/reviews";
// import hu from "../../../public/locales/hu/Vélemények/reviewsection";
// import hu2 from "../../../public/locales/hu/Vélemények/reviews";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const { loading } = useLoading();
  const [transition, setTransition] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (loading) {
      setTransition(transition);
    } else {
      setTransition(!transition);
    }
  }, [loading]);
  const [submitProcess, setSubmitProcess] = React.useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitProcess(true);
    setError("");
    // Ellenőrzések
    //Ha social media bejelentkezést választottunk, akkor ne dobjon hibát a sima bejelentkezés
    //#region
    const social_media = [
      {
        id: "google",
        htmlId: "data-google-button",
        label: "Bejelentkezés Google-lal",
        disabled: false,
      },
      {
        id: "facebook",
        htmlId: "data-facebook-button",
        label: "Bejelentkezés Facebookkal",
        disabled: false,
      },
      {
        id: "x",
        htmlId: "data-x-button",
        label: "Bejelentkezés X-szel",
        disabled: true,
      },
      {
        id: "apple",
        htmlId: "data-apple-button",
        label: "Bejelentkezés iClouddal",
        disabled: true,
      },
    ];
    let button_id;
    let targetIsNotAuthProvider = false;
    social_media.map((social_media) => {
      button_id = document.getElementById(`${social_media.htmlId}`);
      if (!formData.username || (!formData.email && e.target === button_id)) {
        targetIsNotAuthProvider = true;
      }
    });
    if (targetIsNotAuthProvider) {
      setSubmitProcess(false);
      return;
    }
    //#endregion
    if (!formData.password && !formData.username) {
      setError("Hiányzik a felhasználónév vagy az email!");
      setSubmitProcess(false);
      return;
    }
    if (!formData.password) {
      setError("Hiányzik a jelszó!");
      setSubmitProcess(false);
      return;
    }

    try {
      //Default login
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username || formData.email,
        password: formData.password,
      });

      if (result?.error) {
        console.log("Sikertelen bejelentkezés!", result.error);
        setError(result.error);
      } else {
        console.log("Sikeres bejelentkezés!");
        router.push("/search");
      }
    } catch (error) {
      console.error("Hiba történt a bejelentkezés során:", error);
      setError("Hiba történt a bejelentkezés során.");
    } finally {
      setSubmitProcess(false); // Folyamat vége, állapot frissítése
    }
  };

  const fields = [
    {
      name: "username",
      label: "Felhasználónév",
      type: "text",
      placeholder: "Írd be a felhasználóneved, vagy az emailed...",
    },
    {
      name: "password",
      label: "Jelszó",
      type: "password",
      placeholder: "Írd be a jelszavad...",
    },
  ];

  return (
    <div className={`${formStyles.Container}`}>
      <KocsMateLogo />
      <form onSubmit={handleLogin} className={`${formStyles.Form}`}>
        {fields.map((field) => (
          <div key={field.name} className={`${formStyles.Field}`}>
            <label className={`${formStyles.FormLabel}`}>{field.label}:</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleInputChange}
              className={`${formStyles.FormInput}`}
              placeholder={field.placeholder}
            />
          </div>
        ))}
        {error && <p className={`${formStyles.Error}`}>{error}</p>}
        <button type="submit" className={`${components.button.homePageButton}`}>
          {submitProcess ? "Bejelentkezés..." : "Bejelentkezés"}
          {/* Animáció mehet majd */}
        </button>
        <LoginButtons />
        <Link href={"/pregister"}>
          <button className={`${components.button.homePageButton}}`}>
            Kiemelt felhasználó?
          </button>
        </Link>
        <Link href={"/register"}>
          <button className={`${components.button.homePageButton}}`}>
            Nem regisztrált még?
          </button>
        </Link>
      </form>
    </div>
  );
}
