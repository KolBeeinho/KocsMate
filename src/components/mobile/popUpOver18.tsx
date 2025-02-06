import Link from "next/link";
import { useState } from "react";
const PopUpOver18: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(false);
  const handleConfirm = () => {
    if (isChecked) {
      setIsOpen(false);
      setError(false);
    } else {
      setError(true);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-8 z-10"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
    >
      <div className="bg-[var(--butterscotch)] py-6 px-4 rounded-lg shadow-lg text-center">
        <h2 className="text-lg font-bold mb-4">Elmúltál 18 éves?</h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <input
            type="checkbox"
            id="terms"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5"
          />
          <Link href={"/eula"}>
            <label
              htmlFor="terms"
              className="text-[var(--oxford-blue)] underline"
            >
              A felhasználási feltételeket elfogadom
            </label>
          </Link>
        </div>
        {error && (
          <div>
            <p className="text-[var(--dark-red)]  text-sm my-4">
              El kell fogadnod a felhasználási feltételeket, hogy továbbléphess!
            </p>
          </div>
        )}
        <div className="flex justify-center gap-32">
          <button
            onClick={handleConfirm}
            className={`px-6 py-2 rounded text-[var(--butterscotch)] bg-[var(--oxford-blue)] ${
              isChecked ? "" : "cursor-not-allowed"
            }`}
          >
            Igen
          </button>
          <Link href="/under18">
            <button className="bg-[var(--oxford-blue)] text-[var(--butterscotch)] px-6 py-2 rounded">
              Nem
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PopUpOver18;
