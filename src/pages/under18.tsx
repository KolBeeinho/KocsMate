import Link from "next/link";
//TODO 18 év alatti szöveg
const Under18: React.FC = () => {
  return (
    <div className="m-24">
      <Link href="/">
        <button>Vissza a főoldalra</button>
      </Link>
    </div>
  );
};

export default Under18;
