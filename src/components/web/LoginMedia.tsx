import { signIn } from "next-auth/react";
import Image from "next/image";
import isMobile from "src/utils/checkOS";
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
      logo: "X.png",
      disabled: true,
    },
    {
      id: "apple",
      htmlId: "data-apple-button",
      label: "Bejelentkezés iClouddal",
      logo: "Apple.svg",
      disabled: true,
    },
  ];
  const filteredSocialMedia = social_media.filter(
    (provider) => provider.id !== "apple" || platform === "ios"
  );
  return (
    <div>
      {filteredSocialMedia.map((provider) => (
        <button
          title="social-media"
          key={provider.id}
          onClick={() => signIn(provider.id)}
          disabled={provider.disabled}
          id={provider.id}
          className="mx-4"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              borderRadius: provider.id === "apple" ? "30%" : "0",
              overflow: "hidden",
            }}
          >
            <Image
              src={`/images/${provider.logo}`}
              width={40}
              height={40}
              draggable={false}
              priority={true}
              alt={`${provider.label} ikon`}
              style={{
                objectFit: "contain",
                transform:
                  provider.id === "apple" ? "scale(1.25)" : "scale(0.85)",
                transformOrigin: "center center",
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
