import Link from "next/link";
import React from "react";
import { formStyles } from "../../styles/styles";
import BackButton from "../web/BackButton";
import KocsMateLogo from "../web/KocsMateLogo";
import LoginButtons from "../web/LoginMedia";

interface MobileLoginFormProps {
  formData: {
    username: string;
    email: string;
    password: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => void;
  error: string;
  submitProcess: boolean;
}

const MobileLoginForm: React.FC<MobileLoginFormProps> = ({
  formData,
  handleInputChange,
  handleLogin,
  error,
  submitProcess,
}) => {
  const fields = [
    {
      name: "username",
      label: "Felhasználónév / email",
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
    <div className={`${formStyles.Container} mt-22 bg-[var(--oxford-blue)]`}>
      <KocsMateLogo />
      <BackButton />
      {error && (
        <div className="flex flex-row items-center space-x-2 pt-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
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
        onSubmit={handleLogin}
        id="loginform"
        className={`flex flex-col items-center px-6 py-2.5 rounded-lg w-full max-w-md mx-auto gap-4 ${
          !error ? "mt-8" : ""
        }`}
      >
        {fields.map((field) => (
          <div key={field.name} className={`w-[80%] relative`}>
            <label className={`block text-[var(--butterscotch)] mb-2`}>
              {field.label}:
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleInputChange}
              className={`w-full p-2 border border-glaucous rounded-lg bg-[#FFFFFF] placeholder-[var(--oxford-blue)] text-placeholder:font-bold`}
              placeholder={field.placeholder}
            />
          </div>
        ))}

        <button
          type="submit"
          className={`text-[var(--oxford-blue)] bg-[var(--butterscotch)] px-5 py-3 rounded-lg mt-2.5`}
        >
          {submitProcess ? "Bejelentkezés..." : "Bejelentkezés"}
        </button>
        <Link href={"/register"}>
          <button className={`mt-2 underline font-bold`}>Regisztráció</button>
        </Link>
        <div className="fixed bottom-12">
          <LoginButtons />
        </div>
      </form>
    </div>
  );
};

export default MobileLoginForm;
