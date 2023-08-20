import React, { useState } from "react";
import InputText from "../../components/input-text/input-text";
import Button, { Color } from "../../components/button/button";
import { signUpWithMail } from "../../utils/firebase/firebase";
import FirebaseAuthResponse from "../../utils/models/auth/firebase-auth-error";

interface props {
  toggleView: () => void;
}

const SignUpBox = ({ toggleView }: props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const signUpButton = () => {
    signUpWithMail(email, password).then((val) => {
      if (val === FirebaseAuthResponse.SUCCESS) {
        console.log("Zarejestrowany");
        setError("");

        return;
      }

      switch (val) {
        case FirebaseAuthResponse.INVALID_EMAIL:
          setError("Błędy email");
          break;
        case FirebaseAuthResponse.INVALID_PASSWORD:
        case FirebaseAuthResponse.MISSING_PASSWORD:
          setError("Hasło musi zawierać co najmniej 6 znaków");
          break;
        case FirebaseAuthResponse.EMAIL_EXISTS:
          setError("Konto z takim adresem już istnieje");
          break;
        default:
          setError("Nieznany błąd");
      }
    });
  };

  return (
    <div className="w-3/4">
      <div className="m-3 font-bold text-xl font-poppins underline">
        GroupShareBills
      </div>
      <div>
        <div className="font-semibold text-xl">
          Gotowi na rozliczanie bez stresu?
        </div>
        <div className="text-base mt-2">
          <span className="font-semibold">Zarejestruj się</span> i zacznij nie
          martwić się o rozliczenia
        </div>
        <div className="flex flex-col gap-4 mt-5">
          <div className="text-center text-red-600 font-semibold">{error}</div>
          <InputText
            className=""
            label="Email"
            value={email}
            onChange={(val) => setEmail(val)}
          />
          <InputText
            className=""
            label="Hasło"
            value={password}
            type="password"
            onChange={(val) => setPassword(val)}
          />
          <InputText
            className=""
            label="Powtórz hasło"
            type="password"
            value={confirmPassword}
            onChange={(val) => setConfirmPassword(val)}
          />
          <Button
            text="Zarejestruj"
            className="w-full"
            color={Color.GREEN}
            onClick={signUpButton}
            enabled={password === confirmPassword}
          />
          <Button
            text="Masz konto?"
            color={Color.PURPLE}
            className="mt-3"
            onClick={() => toggleView()}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUpBox;
