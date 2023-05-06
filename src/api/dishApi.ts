import axios from "axios";
import { apiClient } from "../config/apiClient";

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
  const response = await apiClient.post("/dishes/", newDish);
  return response.data;
};
