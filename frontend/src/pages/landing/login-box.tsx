import React, { useState } from "react";
import InputText from "../../components/input-text/input-text";
import Button, { Color } from "../../components/button/button";
import {
  signInWithGoogle,
  signInWithMail,
} from "../../utils/firebase/firebase";
import FirebaseAuthResponse from "../../utils/models/auth/firebase-auth-error";
import { BsGoogle } from "react-icons/bs";
interface props {
  toggleView: () => void;
  openForgottenBox: () => void;
}

const LoginBox = ({ toggleView, openForgottenBox }: props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginWithGoogle = () => {
    signInWithGoogle().then((val) => {
      if (val === FirebaseAuthResponse.SUCCESS) {
        console.log("Zalogowany");
        setError("");
        return;
      }
    });
  };

  const signInButton = () => {
    signInWithMail(email, password).then((val) => {
      if (val === FirebaseAuthResponse.SUCCESS) {
        console.log("Zalogowany");
        setError("");
        return;
      }

      switch (val) {
        case FirebaseAuthResponse.USER_NOT_FOUND:
          setError("Nie ma takiego konta");
          break;
        case FirebaseAuthResponse.WRONG_PASSWORD:
          setError("Błędne hasło/email");
          break;
        default:
          setError("Nieznany błąd");
      }
    });
  };

  return (
    <div className="w-10/12">
      <div className="m-3 font-bold text-xl font-poppins underline">
        GroupShareBills
      </div>
      <div>
        <div className="font-semibold text-xl">
          Gotowi na rozliczanie bez stresu?
        </div>
        <div className="text-base mt-2">
          <span className="font-semibold">Zaloguj się</span> i zacznij nie
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
          <div>
            <InputText
              className=""
              label="Hasło"
              value={password}
              type="password"
              onChange={(val) => setPassword(val)}
            />
            <div className="cursor-pointer" onClick={openForgottenBox}>
              Nie pamiętasz hasła?
            </div>
          </div>
          <Button
            text="Zaloguj się"
            className="w-full"
            onClick={signInButton}
          />
          <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-slate-300 to-transparent flex justify-center relative">
            <div className="absolute top-[-10px] bg-white px-2 font-bold">
              Lub
            </div>
          </div>
          <Button
            text="Logowanie Google"
            className="w-full"
            leftIcon={<BsGoogle />}
            color={Color.GREEN}
            onClick={loginWithGoogle}
          />

          <Button
            text="Nie masz konta?"
            color={Color.PURPLE}
            className="mt-3"
            onClick={() => toggleView()}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginBox;
