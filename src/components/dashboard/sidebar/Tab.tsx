import Link from "next/link";
import { JSX } from "react";

type Props = {
  id: string;
  title: string;
  icon: JSX.Element;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  open?: boolean;
};
const Tab: React.FC<Props> = ({
  id,
  title,
  icon,
  href,
  onClick,
  open = false,
}) => {
  return (
    <Link href={href}>
      <button
        id={id}
        className="flex duration-300 hover:text-[#4F4A56] text-white hover:transition lg:gap-x-9"
        title={title}
        onClick={onClick}
      >
        <span className="h-7 w-7">{icon}</span>
        {open && (
          <a
            className={`origin-center text-lg duration-300 ${
              !open && "scale-0"
            }`}
          >
            {title}
          </a>
        )}
      </button>
    </Link>
  );
};

export default Tab;
