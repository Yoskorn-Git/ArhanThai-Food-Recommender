import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [userName, setUserNameGlobal] = useState(null);
  const [foodAllergy, setFoodAllergy] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        userName,
        foodAllergy,
        setFoodAllergy,
        setUserNameGlobal: async (name) =>{
          setUserNameGlobal(name);
        },
        login: async (email, password) => {
          try {
            await auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
            alert(e)
          }
        },
        register: async (email, password) => {
          try {
            await auth().createUserWithEmailAndPassword(email, password);
          } catch (e) {
            console.log(e);
            alert(e)
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
            alert(e)
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
