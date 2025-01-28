import Image from "next/image";

const AppleLogo = () => {
  return (
    <a
      title="Apple Logo"
      href="https://www.apple.com/app-store/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src="/images/Apple_Store.webp"
        width={240}
        height={80}
        draggable={false}
        priority={true}
        alt="Download the app by Apple Store"
        className="hover:opacity-80 transition duration-300"
      />
    </a>
  );
};

export default AppleLogo;
