import React from "react";
import BackButton from "../web/BackButton";
import KocsMateLogo from "../web/KocsMateLogo";
import LoginButtons from "../web/LoginMedia";

interface MobileRegisterFormProps {
  formData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
    date_of_birth: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRegister: (e: React.FormEvent) => void;
  error: string;
  submitProcess: boolean;
}

const MobileRegisterForm: React.FC<MobileRegisterFormProps> = ({
  formData,
  handleInputChange,
  handleRegister,
  error,
  submitProcess,
}) => {
  const fields = [
    {
      name: "email",
      label: "E-mail",
      type: "email",
      placeholder: "Írd be az e-mail címed...",
    },
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
      name: "password",
      label: "Jelszó",
      type: "password",
      placeholder: "Írd be a jelszavad...",
    },
    { name: "date_of_birth", label: "Születési dátum", type: "date" },
  ];

  return (
    <div
      className={`flex flex-col min-h-screen justify-cente ${
        !error ? "" : "mt-12"
      }`}
    >
      <BackButton />
      <div className="p-8 rounded-2xl w-full max-w-md mx-auto">
        <KocsMateLogo size={50} className="self-start mx-2 mb-8" />
        {error && (
          <div className="flex flex-row items-center space-x-2 pb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="24"
              viewBox="0 0 128 128"
              fill="var(--dark-red)"
            >
              <path d="M6,64c0,32,26,58,58,58s58-26,58-58S96,6,64,6S6,32,6,64z M61,41c0-1.7,1.3-3,3-3s3,1.3,3,3v5c0,1.7-1.3,3-3,3s-3-1.3-3-3 V41z M61,61c0-1.7,1.3-3,3-3s3,1.3,3,3v26c0,1.7-1.3,3-3,3s-3-1.3-3-3V61z"></path>
            </svg>
            <p className={`text-[var(--dark-red)] font-bold`}>{error}</p>
          </div>
        )}
        <form
          onSubmit={handleRegister}
          className={`flex flex-col items-center px-6 py-2.5 rounded-lg w-full gap-4 `}
        >
          {fields.map((field) => (
            <div key={field.name} className="w-full mb-4">
              <label className={`block text-[var(--butterscotch)] mb-2`}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className={`w-full p-2 border border-glaucous rounded-lg bg-[#FFFFFF] placeholder-[var(--oxford-blue)] text-placeholder:font-bold ${
                  field.type === "date" ? "appearance-none" : ""
                }`}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={submitProcess}
            className={`text-[var(--oxford-blue)] bg-[var(--butterscotch)] px-5 py-3 rounded-lg`}
          >
            {submitProcess ? "Regisztráció folyamatban..." : "Regisztráció"}
          </button>
        </form>
      </div>
      <div className="flex flex-row justify-center mb-4">
        <LoginButtons />
      </div>
    </div>
  );
};

export default MobileRegisterForm;
