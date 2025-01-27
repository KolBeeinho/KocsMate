import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import { components, registerStyles } from "../styles/styles";
import checkIfUnderEightTeen from "../utils/checkIfUnder18";
import useLoading from "../utils/hooks/useLoad";
import KocsMateLogo from "./KocsMateLogo";
// import en from "../../../public/locales/en/Reviews/reviewsection";
// import en2 from "../../../public/locales/en/Reviews/reviews";
// import hu from "../../../public/locales/hu/Vélemények/reviewsection";
// import hu2 from "../../../public/locales/hu/Vélemények/reviews";
export default function Register() {
  // const { locale } = useRouter();
  // const h = locale === "hu" ? hu : en;
  // const e = locale === "hu" ? hu2 : en2;
  //Transition
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
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    date_of_birth: "",
  });
  const [error, setError] = useState<string>("");
  const Router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitProcess(true);
    setError("");

    const errors: Array<string> = [];

    //18 éves-e?
    const dob = new Date(formData.date_of_birth);

    if (checkIfUnderEightTeen(dob)) {
      console.log("18 évnél fiatalabb, nem lehet regisztrálni.");
      errors.push("Nem 18.");
    } else {
      console.log("Regisztráció engedélyezett.");
    }

    const fullNamePattern =
      /^[A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+ [A-ZÁÉÍÓÖŐÚÜŰ][a-záéíóöőúüű]+$/;
    const passwordPattern =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).+/;

    if (!formData.username) errors.push("Hiányzó felhasználónév!");
    if (!formData.email) errors.push("Hiányzó email-cím!");
    if (!formData.password) errors.push("Hiányzó jelszó!");
    if (!formData.full_name) errors.push("Hiányzó teljes név!");
    if (!fullNamePattern.test(formData.full_name))
      errors.push("A teljes név nem megfelelő!");
    if (
      formData.password.length < 8 ||
      !passwordPattern.test(formData.password)
    )
      errors.push(
        "A jelszónak legalább 8 karakterből kell lennie, valamint legalább egy kisbetű, egy nagybetű, egy szám, egy speciális karakter!"
      );
    if (errors.length > 0) {
      setError(errors.join("\n"));
      setSubmitProcess(false);
      errors.forEach((e) => {
        if (e.includes("Nem 18.")) {
          Router.push("/login");
        }
      });
      return;
    }
    try {
      const requestData = {
        ...formData,
        date_of_birth: dob,
      };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        console.log("Sikeres regisztráció!");
        Router.push("/login");
      } else {
        const data = await res.json();
        console.error("Sikertelen regisztráció!", data.error);
        setError(data.error || "Sikertelen regisztráció");
      }
    } catch (err) {
      console.error(err);
      setError("Hiba történt a regisztráció során.");
    } finally {
      setSubmitProcess(false);
    }
  };

  const fields = [
    {
      name: "username",
      label: "Felhasználónév",
      type: "text",
      placeholder: "Írd be a felhasználóneved...",
    },
    {
      name: "full_name",
      label: "Teljes név",
      type: "text",
      placeholder: "Írd be a teljes neved...",
    },
    {
      name: "date_of_birth",
      label: "Születési dátum",
      type: "date",
      placeholder: "Írd be a születési dátumod...",
    },
    {
      name: "email",
      label: "E-mail",
      type: "email",
      placeholder: "Írd be az e-mail címed...",
    },
    {
      name: "password",
      label: "Jelszó",
      type: "password",
      placeholder: "Írd be a jelszavad...",
    },
  ];

  return (
    <div className={`${registerStyles.registerContainer}`}>
      <KocsMateLogo />
      <form
        onSubmit={handleRegister}
        className={`${registerStyles.registerForm}`}
      >
        {fields.map((field) => (
          <div key={field.name} className={`${registerStyles.registerField}`}>
            <label className={`${registerStyles.registerFormLabel}`}>
              {field.label}:
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleInputChange}
              className={`${registerStyles.registerFormInput}`}
              placeholder={field.placeholder}
            />
          </div>
        ))}
        {error && <p className={`${registerStyles.registerError}`}>{error}</p>}
        <button
          type="submit"
          disabled={submitProcess}
          className={`${components.button.homePageButton}`}
        >
          {submitProcess ? "Regisztráció..." : "Regisztráció"}{" "}
          {/* Animáció mehet majd */}
        </button>
      </form>
    </div>
  );
}
