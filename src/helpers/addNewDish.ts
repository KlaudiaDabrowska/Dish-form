import axios from "axios";

interface newDish {
  name: string;
  preparation_time: string;
  type: string;
  no_of_slices: number | null;
  diameter: number | null;
  spiciness_scale: number | null;
  slices_of_bread: number | null;
}

export const addNewDish = async (newDish: newDish) => {
  const response = await axios.post(
    "https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/",
    newDish
  );
  return response.data;
};
