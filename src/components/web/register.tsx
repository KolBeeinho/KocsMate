import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import isMobile from "src/utils/checkOS";
import checkIfUnderEightTeen from "../../utils/checkIfUnder18";
import MobileRegisterForm from "../mobile/MobileRegisterForm";
import KocsMateLogo from "./KocsMateLogo";

export default function Register() {
  // const { loading } = useLoading();
  const [submitProcess, setSubmitProcess] = React.useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    full_name: "",
    date_of_birth: "",
  });
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitProcess(true);
    setError("");

    const errors: Array<string> = [];
    const dob = new Date(formData.date_of_birth);

    if (checkIfUnderEightTeen(dob)) {
      errors.push("Nem vagy még 18 éves, így nem regisztrálhatsz.");
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
        "A jelszónak legalább 8 karakterből kell lennie, tartalmaznia kell nagybetűt és speciális karaktert!"
      );
    if (errors.length > 0) {
      setError(errors.join("\n"));
      setSubmitProcess(false);
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
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.error || "Sikertelen regisztráció.");
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
    { name: "date_of_birth", label: "Születési dátum", type: "date" },
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

  return isMobile() ? (
    <MobileRegisterForm
      formData={formData}
      handleInputChange={handleInputChange}
      handleRegister={handleRegister}
      error={error}
      submitProcess={submitProcess}
    />
  ) : (
    <div className="flex min-h-screen justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg">
        <KocsMateLogo />
        <h1 className="text-2xl font-bold text-center mb-6">Regisztráció</h1>
        <form onSubmit={handleRegister}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={submitProcess}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {submitProcess ? "Regisztráció folyamatban..." : "Regisztráció"}
          </button>
        </form>
      </div>
    </div>
  );
}
