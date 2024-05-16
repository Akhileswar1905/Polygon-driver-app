import { useState, useEffect, useContext, createContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        console.log("Phone Number: ", phoneNumber);
        if (phoneNumber) {
          const res = await axios.get(
            `https://polygon-project.onrender.com/driver/${phoneNumber}`
          );
          console.log(res.data.driver);
          setUser(res.data.driver);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
      }}
    >
      {!isLoading && children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
