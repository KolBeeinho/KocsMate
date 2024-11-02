import React from "react";
export type PopUpContextType = {
  open: string;
  setOpen: React.Dispatch<React.SetStateAction<string>>;
};
const PopUpContext = React.createContext<PopUpContextType>(
  {} as PopUpContextType
);

const PopUpProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = React.useState<string>("");
  const contextValue = { open, setOpen };
  return (
    <PopUpContext.Provider value={contextValue}>
      {children}
    </PopUpContext.Provider>
  );
};
export { PopUpContext };
export default PopUpProvider;
