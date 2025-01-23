import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import KocsMateLogo from "../components/KocsMateLogo";
import { components, formStyles } from "../styles/styles";
import useLoading from "../utils/hooks/useLoad";

const pregister = () => {
  //TODO Business fiókok
  const [formData, setFormData] = useState({
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
    if (!formData.password && !formData.email) {
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
        username: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        console.log("Sikertelen bejelentkezés!", result.error);
        setError(result.error);
      } else {
        console.log("Sikeres bejelentkezés!");
        router.push("/dashboard");
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
      name: "email",
      label: "Business Email",
      type: "email",
      placeholder: "Írd be az üzleti emailed...",
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
        <button type="submit" className={`${components.button}`}>
          {submitProcess ? "Bejelentkezés..." : "Bejelentkezés"}
          {/* Animáció mehet majd */}
        </button>
      </form>
    </div>
  );
};

export default pregister;
