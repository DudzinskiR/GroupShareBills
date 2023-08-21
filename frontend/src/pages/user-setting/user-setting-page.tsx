import React, { useContext, useEffect, useState } from "react";
import Box from "../../components/box/box";
import InputText from "../../components/input-text/input-text";
import Button from "../../components/button/button";
import { AccountType, UserCacheContext } from "../../contexts/user-context";
import { UsersCacheContext } from "../../contexts/users-cache-context";
import UsersApi from "../../utils/api/users/users-api";
import FirebaseAuthResponse from "../../utils/models/auth/firebase-auth-error";
import { changePassword } from "../../utils/firebase/firebase";

const UserSettingPage = () => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { getAccountType, getUserID } = useContext(UserCacheContext)!;
  const { getUser, changeUsername } = useContext(UsersCacheContext)!;

  const changePasswordButton = () => {
    changePassword(oldPassword, password).then((val) => {
      if (val === FirebaseAuthResponse.SUCCESS) {
        setError("Hasło zmienione");

        return;
      }

      switch (val) {
        case FirebaseAuthResponse.INVALID_PASSWORD:
        case FirebaseAuthResponse.MISSING_PASSWORD:
          setError("Hasło musi zawierać co najmniej 6 znaków");
          break;
        default:
          setError("Nieznany błąd");
      }
    });
  };

  useEffect(() => {
    const fetchUsername = async () => {
      setUsername((await getUser(await getUserID())) || "");
    };

    fetchUsername();
  }, [getUser, getUserID]);

  const changeUsernameHandler = () => {
    const putNewUsername = async () => {
      await UsersApi.changeUsername(username);
      changeUsername(await getUserID(), username);
    };

    putNewUsername();
  };

  return (
    <div className="flex justify-center py-5">
      <Box title="Konto" className="w-11/12 md:w-[640px] duration-150">
        <div className="p-3">
          <div className="flex flex-row justify-around">
            <InputText
              label="Nazwa użytkownika"
              value={username}
              onChange={(val) => setUsername(val)}
            />
            <Button text="Zapisz" onClick={changeUsernameHandler} />
          </div>

          {getAccountType() === AccountType.MAIL && (
            <>
              <div className="border-2 my-5"></div>
              <div className="flex flex-row items-center justify-around">
                <div className="flex flex-col gap-3">
                  <InputText
                    label="Stare hasło"
                    value={oldPassword}
                    onChange={(val) => setOldPassword(val)}
                    type="password"
                  />
                  <InputText
                    label="Nowe hasło"
                    value={password}
                    onChange={(val) => setPassword(val)}
                    type="password"
                  />
                  <InputText
                    label="Powtórz hasło"
                    value={confirmPassword}
                    onChange={(val) => setConfirmPassword(val)}
                    type="password"
                  />
                </div>
                <div className="">
                  <div className="text-center mb-3">{error}</div>
                  <div className="flex justify-center">
                    <Button
                      text="Zapisz"
                      className="h-10"
                      enabled={password === confirmPassword}
                      onClick={changePasswordButton}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Box>
    </div>
  );
};

export default UserSettingPage;
