import Image from "next/image";

const KocsmateLogo = () => {
  return (
    <Image
      src="/images/Kocsmate_Logo.webp"
      width={200}
      height={200}
      draggable={false}
      priority={true}
      alt="Our official company logo"
      className=""
    />
  );
};

export default KocsmateLogo;
