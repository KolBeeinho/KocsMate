import Image from "next/image";

const KocsMateLogo = ({
  size = 250,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Image
      src="/images/Kocsmate_Logo.png"
      width={size}
      height={size}
      draggable={false}
      priority={true}
      alt="Our official company logo"
      className={className} // Az osztályt most kívülről adod meg
    />
  );
};

export default KocsMateLogo;
