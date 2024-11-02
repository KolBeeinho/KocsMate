import React from "react";

function useOutsideClick(
  ref: React.RefObject<HTMLDivElement>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(true);
    }
  };
  React.useEffect(() => {
    document.addEventListener("mousedown", handleClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  });
}
export default useOutsideClick;
