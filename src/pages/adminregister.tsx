import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import KocsMateLogo from "../components/web/KocsMateLogo";

//TODO username megfeleltetése

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });

  const [submitProcess, setSubmitProcess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitProcess(true);
    setError("");
    setSuccess("");

    if (!formData.email || !formData.username) {
      setError("Minden mező kitöltése kötelező!");
      setSubmitProcess(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/admin-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(
          "Admin regisztráció sikeres! A jelszót e-mailben küldtük el."
        );
        router.push("/");
      } else {
        setError(result.error || "Hiba történt a regisztráció során.");
      }
    } catch (error) {
      console.error("Hiba az admin regisztráció során:", error);
      setError("Váratlan hiba történt.");
    } finally {
      setSubmitProcess(false);
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
      name: "username",
      label: "Felhasználónév",
      type: "text",
      placeholder: "Írd be a felhasználóneved...",
    },
  ];

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg">
        <KocsMateLogo />
        <h1 className="text-2xl font-bold text-center mb-6">
          Admin Regisztráció
        </h1>
        <form onSubmit={handleRegister}>
          {fields.map((field) => (
            <div key={field.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {submitProcess
              ? "Regisztráció folyamatban..."
              : "Admin regisztráció"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
