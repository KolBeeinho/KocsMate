import React from "react";

export type TransitionContextType = {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransitionContext = React.createContext<TransitionContextType>(
  {} as TransitionContextType
);

const TransitionContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <TransitionContext.Provider value={{ loading, setLoading }}>
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionContext;
export { TransitionContextProvider };
