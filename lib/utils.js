import axios from "axios";

export const getUser = async (phoneNumber) => {
  const res = await axios.get(
    `https://polygon-project.onrender.com/driver/${phoneNumber}`
  );
  console.log(res.data);
  return res.data;
};
