import { useRouter } from "next/router";

const BackButton: React.FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      className="fixed top-12 right-4 z-50 p-2 bg-[var(--butterscotch)] rounded-full shadow-md cursor-pointer"
      onClick={handleBack}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="text-gray-800"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
};

export default BackButton;
