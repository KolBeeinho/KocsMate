import { signIn } from "next-auth/react";
import Image from "next/image";
import isMobile from "src/utils/checkOS";
import BackButton from "./BackButton";
export default function LoginButtons() {
  const platform = isMobile(true);
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
  const filteredSocialMedia = social_media.filter(
    (provider) => provider.id !== "apple" || platform === "ios"
  );
  return (
    <div>
      <BackButton />
      {filteredSocialMedia.map((provider) => (
        <button
          title="social-media"
          key={provider.id}
          onClick={() => signIn(provider.id)}
          disabled={provider.disabled}
          id={provider.id}
          className="mx-4"
        >
          <Image
            src={`/images/${provider.logo}`}
            width={40}
            height={40}
            draggable={false}
            priority={true}
            alt={`${provider.label} ikon`}
            className="mx-auto"
          />
        </button>
      ))}
    </div>
  );
}
