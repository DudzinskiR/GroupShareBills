import React, { useContext, useEffect, useState } from "react";
import { UsersCacheContext } from "../../contexts/users-cache-context";

interface props {
  className?: string;
  id: string;
}

const Username = ({ className, id }: props) => {
  const [name, setName] = useState("");

  const { getUser } = useContext(UsersCacheContext)!;

  useEffect(() => {
    const getUsername = async () => {
      setName(await getUser(id));
    };

    getUsername();
  }, [id, getUser]);

  return <span className={className}>{name}</span>;
};

export default Username;
