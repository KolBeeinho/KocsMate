import TransitionContext, {
  TransitionContextType,
} from "../providers/Transition";

import React from "react";

const useLoading = () => {
  const { loading, setLoading } =
    React.useContext<TransitionContextType>(TransitionContext);
  return { loading, setLoading };
};

export default useLoading;
