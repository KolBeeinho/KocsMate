//ide jöhetnek majd bármilyen stílusok tömbbe, pl. button

export const components = {
  button: {
    homePageButton:
      "w-full disabled:bg-slate-600 bg-butter-scotch font-bold py-2 rounded-md hover:bg-glaucous transition duration-300",
  },
};

export const loginStyles = {
  loginContainer: "flex flex-col items-center",
  loginForm:
    "flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto gap-4",
  loginFormLabel: "block text-betu_szin text-lg mb-2",
  loginFormInput:
    "w-full p-2 border border-glaucous text-black rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch",
  loginField: "mb-4 w-full relative",
  loginError: "text-dark-red mb-4 bg-slate-600 opacity-80",
};

export const registerStyles = {
  registerContainer: "flex flex-col items-center",
  registerForm:
    "flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto",
  registerFormLabel: "block text-betu_szin text-lg mb-2",
  registerFormInput:
    "w-full p-2 border border-glaucous rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch",
  registerField: "mb-4 w-full",
  registerError: "text-dark-red mb-4 bg-slate-600 opacity-80",
};
//vagy tailwind is
