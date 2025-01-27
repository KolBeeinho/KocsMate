import KocsMateLogo from "../components/web/KocsMateLogo";
import { formStyles } from "../styles/styles";

const passreset = () => {
  return (
    <div className={`${formStyles.Container}`}>
      <KocsMateLogo />
      <div>Adja meg az email címét!</div>
      <label className={`${formStyles.FormLabel}`}>Email:</label>
      <input
        type={"email"}
        name={"email"}
        // value={email}
        placeholder={"Email"}
      />
    </div>
  );
};

export default passreset;
