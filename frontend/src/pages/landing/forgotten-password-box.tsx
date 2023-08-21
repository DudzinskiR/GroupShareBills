import React, { useState } from "react";
import Button, { Color } from "../../components/button/button";
import InputText from "../../components/input-text/input-text";
import { resetPassword } from "../../utils/firebase/firebase";
import FirebaseAuthResponse from "../../utils/models/auth/firebase-auth-error";

interface props {
  switchView: () => void;
}

const ForgottenPasswordBox = ({ switchView }: props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [buttonText, setButtonText] = useState("");

  const resetPasswordButton = () => {
    setButtonText("Proszę czekać");
    resetPassword(email).then((val) => {
      setButtonText("");
      if (val === FirebaseAuthResponse.SUCCESS) {
        setError("");
        setSuccess(true);
        return;
      }

      switch (val) {
        case FirebaseAuthResponse.INVALID_EMAIL:
          setError("Niepoprawny adres email");
          break;
        case FirebaseAuthResponse.USER_NOT_FOUND:
          setError("Nie ma takiego adresu email");
          break;
        default:
          setError("Nieznany błąd");
      }
    });
  };

  const renderSuccess = () => {
    return (
      <div className="text-xl text-center flex flex-col gap-3">
        Wiadomość z linkiem do zrestartowania hasła została wysłana na adres
        <div className="font-bold mt-5">{email}</div>
        <div className="border-2 mt-5"></div>
        <div className="w-full text-lg">
          <Button text="Zaloguj się" className="w-full" onClick={switchView} />
        </div>
      </div>
    );
  };

  const renderForgottenBox = () => {
    return (
      <>
        <div className="m-3 font-bold text-xl font-poppins underline">
          GroupShareBills
        </div>
        <div>
          <div className="font-semibold text-xl">Nie pamiętasz hasła?</div>
          <div className="text-base mt-2">
            Nie ma problemu! Podaj nam swój adres, a my wyślemy tobie wiadomość
            z linkiem do zmiany hasła
          </div>
          <div className="flex flex-col gap-4 mt-5">
            <div className="text-center text-red-600 font-semibold">
              {error}
            </div>

            <InputText
              className=""
              label="Email"
              value={email}
              onChange={(val) => setEmail(val)}
            />
            <Button
              text={buttonText || "Przypomnij hasło"}
              enabled={!buttonText}
              className="w-full"
              color={Color.GREEN}
              onClick={() => resetPasswordButton()}
            />

            <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-slate-300 to-transparent flex justify-center relative">
              <div className="absolute top-[-10px] bg-white px-2 font-bold">
                Lub
              </div>
            </div>

            <Button text="Zaloguj się" onClick={switchView} />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="w-10/12">
      {success ? renderSuccess() : renderForgottenBox()}
    </div>
  );
};

export default ForgottenPasswordBox;
