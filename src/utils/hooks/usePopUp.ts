import { PopUpContext, PopUpContextType } from "../providers/PopUp";

import React from "react";

const usePopUp = () => {
  const { open, setOpen } = React.useContext<PopUpContextType>(PopUpContext);
  return { open, setOpen };
};

export default usePopUp;
