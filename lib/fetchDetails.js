import axios from "axios";
import { useGlobalContext } from "../context/GlobalContext";

const { user } = useGlobalContext();
export const fetchDetails = async () => {
  try {
    const res = await axios.get(
      `https://polygon-project.onrender.com/driver/${user.phoneNumber}`
    );
    return res.data;
  } catch (error) {
    console.log(error.message);
  }
};
