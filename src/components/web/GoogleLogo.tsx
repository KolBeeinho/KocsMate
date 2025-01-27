import Image from "next/image";

const GoogleLogo = () => {
  return (
    <a
      href="https://play.google.com/store/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/images/Google_Play.webp"
        width={240}
        height={80}
        draggable={false}
        priority={true}
        alt="Download the app from Google Play"
        className="hover:opacity-80 transition duration-300"
      />
    </a>
  );
};

export default GoogleLogo;
