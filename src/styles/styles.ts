//ide jöhetnek majd bármilyen stílusok tömbbe, pl. button

export const eulaStyle = {
  container: "text-center max-w-80",
  link: "w-full bg-butter-scotch font-bold p-2 mt-4 rounded-md hover:bg-glaucous transition duration-300 max-w-60",
};

export const Style404 = {
  container: "flex items-center flex-col",
  link: "w-full bg-butter-scotch font-bold p-2 mt-4 rounded-md hover:bg-glaucous transition duration-300 max-w-60",
};

export const components = {
  button: {
    homePageButton:
      "w-full disabled:bg-slate-600 bg-butter-scotch font-bold py-2 rounded-md hover:bg-glaucous transition duration-300",
  },
};

export const formStyles = {
  Container: "flex flex-col items-center",
  Form: "flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto gap-4",
  FormLabel: "block text-betu_szin text-lg mb-2",
  FormInput:
    "w-full p-2 border border-glaucous text-black rounded-md focus:outline-none focus:ring-2 focus:ring-butter-scotch",
  Field: "mb-4 w-full relative",
  Error: "text-dark-red mb-4 bg-slate-600 opacity-80",
};

export const indexStyle = {
  parent: "text-2xl flex flex-col items-center",
  container:
    "flex flex-col items-center bg-yinmn-blue p-6 rounded-lg shadow-md w-full max-w-md mx-auto gap-4",
  buttons: "mt-4 px-4 py-2",
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
