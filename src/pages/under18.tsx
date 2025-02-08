import Image from "next/image";
import Link from "next/link";
//TODO normális stop image
const Under18: React.FC = () => {
  return (
    <div className="mt-22 mx-8 flex flex-col text-[var(--butterscotch)] w-[80%] items-center space-y-24">
      <h1 className="text-[var(--butterscotch)] text-2xl font-black">
        Ez az alkalmazás nem használható 18 éven aluliak számára!
      </h1>

      <Image
        src="/images/stop.svg"
        width={250}
        height={250}
        draggable={false}
        priority={true}
        alt="Our official company logo"
      />
      <Link href="/" className="mt-12">
        <button className="text-xl font-bold">Vissza a főoldalra</button>
      </Link>
    </div>
  );
};

export default Under18;
