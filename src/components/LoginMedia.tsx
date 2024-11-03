import { signIn } from "next-auth/react";

export default function LoginButtons() {
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
  return (
    <div>
      {social_media.map((provider) => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id)}
          disabled={provider.disabled}
          id={provider.id}
          style={{ margin: "10px" }}
        >
          {provider.label}
        </button>
      ))}
    </div>
  );
}
