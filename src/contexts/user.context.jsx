import { createContext, useState, useEffect } from "react";
import { onAuthStateChangedListener , createUserDocumentFromAuth } from "../utils/firebase/firebase.utils";

// You can see the context as being 2 pieces
// 1. actual storage thing itself: literal context
 
// as the actual value you want to access
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
})


// userprovider is allowing any of it's children to acces values inside of it's useState
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const value = {currentUser, setCurrentUser}


  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      if (user){
        createUserDocumentFromAuth(user);
      }
      setCurrentUser(user)
    });

    return unsubscribe;
  }, [])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}