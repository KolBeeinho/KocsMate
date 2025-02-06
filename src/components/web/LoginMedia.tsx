import { signIn } from "next-auth/react";
import Image from "next/image";
import BackButton from "./BackButton";
export default function LoginButtons() {
  const social_media = [
    {
      id: "google",
      htmlId: "data-google-button",
      label: "Bejelentkezés Google-lal",
      logo: "Google.png",
      disabled: false,
    },
    {
      id: "facebook",
      htmlId: "data-facebook-button",
      label: "Bejelentkezés Facebookkal",
      logo: "Facebook.png",
      disabled: false,
    },
    {
      id: "x",
      htmlId: "data-x-button",
      label: "Bejelentkezés X-szel",
      logo: "Facebook.png",
      disabled: true,
    },
    {
      id: "apple",
      htmlId: "data-apple-button",
      label: "Bejelentkezés iClouddal",
      logo: "Facebook.png",
      disabled: true,
    },
  ];
  return (
    <div>
      <BackButton />
      {social_media.map((provider) => (
        <button
          title="social-media"
          key={provider.id}
          onClick={() => signIn(provider.id)}
          disabled={provider.disabled}
          id={provider.id}
          style={{ margin: "10px" }}
        >
          <Image
            src={`/images/${provider.logo}`}
            width={40}
            height={40}
            draggable={false}
            priority={true}
            alt="Our official company logo"
            className="mx-auto"
          />
        </button>
      ))}
    </div>
  );
}
