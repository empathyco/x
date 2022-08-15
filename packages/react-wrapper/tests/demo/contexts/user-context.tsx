import React, { ReactElement, createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserContextProvider = ({ children }) : ReactElement => {
  const [user, setUser] = useState(null);

  // fetch a user from a stub API
  useEffect(() => {
    const fetchUser = () => {
      fetch("https://randomuser.me/api/")
        .then((res) => res.json())
        .then((res) => setUser(res.results[0]))
        .catch((err) => console.error(err));
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };