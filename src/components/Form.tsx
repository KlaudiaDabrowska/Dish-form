import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import { addNewDish } from "../helpers/addNewDish";
import "react-toastify/dist/ReactToastify.css";
import { AxiosError } from "axios";
import InputMask from "react-input-mask";

enum DishType {
  Pizza = "pizza",
  Soup = "soup",
  Sandwich = "sandwich",
}

enum ApiErrors {
  name = "Dish name",
  preparation_time = "Preparation time",
  type = "Dish type",
  no_of_slices = "Number of slices",
  diameter = "Diameter",
  spiciness_scale = "Spiciness",
  slices_of_bread = "Number of slices of bread",
}

export const Form = () => {
  const spicinessValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const spicinessMarks = spicinessValues.map((value) => {
    return { value: value, label: value.toString() };
  });

  const { mutate: addNewDishMutation, isSuccess } = useMutation(addNewDish, {
    onError: (e: AxiosError) => {
      if (!e.response?.data) {
        toast.error(`Oops, something went wrong. Please try again later.`, {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      for (const [key, value] of Object.entries(e.response?.data)) {
        const convertedKey =
          Object.values(ApiErrors)[Object.keys(ApiErrors).indexOf(key)] ??
          "Unknown error occurred";
        toast.error(`${convertedKey} - ${value}!`, {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      dishName: "",
      preparationTime: "",
      dishType: "",
      noOfPizzaSlices: null,
      pizzaDiameter: null,
      soupSpiciness: null,
      noOfBread: null,
      spiciness_scale: null,
      slices_of_bread: null,
    },
    validationSchema: Yup.object({
      dishName: Yup.string().required("This field is required"),
      preparationTime: Yup.string().required("This field is required"),
      dishType: Yup.string()
        .oneOf(Object.values(DishType))
        .required("This field is required"),
      noOfPizzaSlices: Yup.number().when("dishType", {
        is: (value: string) => value === DishType.Pizza,
        then: (schema) =>
          schema
            .min(1, "Please enter the number of pizza slices")
            .required("This field is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      pizzaDiameter: Yup.number().when("dishType", {
        is: (value: string) => value === DishType.Pizza,
        then: (schema) =>
          schema
            .min(1, "Please enter the pizza diameter")
            .required("This field is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      soupSpiciness: Yup.number().when("dishType", {
        is: (value: string) => value === DishType.Soup,
        then: (schema) =>
          schema
            .min(1, "Please enter the spiciness level")
            .required("This field is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      noOfBread: Yup.number().when("dishType", {
        is: (value: string) => value === DishType.Sandwich,
        then: (schema) =>
          schema
            .min(1, "Please enter the number of slices of bread")
            .required("This field is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: (values) => {
      addNewDishMutation({
        name: values.dishName,
        preparation_time: values.preparationTime,
        type: values.dishType,
        no_of_slices: values.noOfPizzaSlices,
        diameter: values.pizzaDiameter,
        spiciness_scale: values.soupSpiciness,
        slices_of_bread: values.noOfBread,
      });
    },
  });

  const handleSelectChange = (e: SelectChangeEvent) => {
    const value = e.target.value;
    formik.setFieldValue("dishType", value);
  };

  return (
    <>
      <ToastContainer />
      <Typography
        sx={{ fontWeight: "bold", mt: 2, mb: 3, textTransform: "uppercase" }}
        color="primary"
      >
        Dishes Form
      </Typography>
      {isSuccess ? (
        <Typography sx={{ my: 25 }}>Thanks for add a new dish!</Typography>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <FormControl fullWidth>
            <TextField
              id="dishName"
              label="Dish name"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.dishName}
              sx={{ mb: formik.errors.dishName ? 0 : 3 }}
            />

            {formik.touched.dishName && formik.errors.dishName && (
              <Typography sx={{ textAlign: "left", mb: 2 }} color="error">
                {formik.errors.dishName}
              </Typography>
            )}

            <TextField
              id="preparationTime"
              label="Preparation Time"
              value={formik.values.preparationTime}
              onChange={formik.handleChange}
              InputProps={{
                //@ts-expect-error
                inputComponent: InputMask,
                inputProps: {
                  mask: "XX:AX:AX",
                  formatChars: {
                    A: "[0-5]",
                    X: "[0-9]",
                  },
                },
              }}
              sx={{ mb: formik.errors.preparationTime ? 0 : 3 }}
            />

            {formik.touched.preparationTime &&
              formik.errors.preparationTime && (
                <Typography sx={{ textAlign: "left", mb: 2 }} color="error">
                  {formik.errors.preparationTime}
                </Typography>
              )}

            <FormControl>
              <InputLabel id="dishTypeLabel">Dish type</InputLabel>
              <Select
                labelId="dishTypeLabel"
                id="dishType"
                label="Dish type"
                onChange={handleSelectChange}
                value={formik.values.dishType}
                sx={{ mb: formik.errors.dishType ? 0 : 3 }}
              >
                <MenuItem value="pizza">Pizza</MenuItem>
                <MenuItem value="soup">Soup</MenuItem>
                <MenuItem value="sandwich">Sandwich</MenuItem>
              </Select>
              {formik.touched.dishType && formik.errors.dishType && (
                <Typography sx={{ textAlign: "left", mb: 2 }} color="error">
                  {formik.errors.dishType}
                </Typography>
              )}
            </FormControl>

            {formik.values.dishType === DishType.Pizza && (
              <>
                <TextField
                  id="noOfPizzaSlices"
                  label="Number of slices"
                  type="number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.noOfPizzaSlices ?? ""}
                  sx={{ mb: formik.errors.noOfPizzaSlices ? 0 : 3 }}
                  onKeyDown={(e: React.KeyboardEvent<HTMLElement>) =>
                    [",", "."].includes(e.key) && e.preventDefault()
                  }
                />
                {formik.touched.noOfPizzaSlices &&
                  formik.errors.noOfPizzaSlices && (
                    <Typography sx={{ textAlign: "left", mb: 2 }} color="error">
                      {formik.errors.noOfPizzaSlices}
                    </Typography>
                  )}
                <TextField
                  id="pizzaDiameter"
                  label="Diameter"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.pizzaDiameter ?? ""}
                  InputProps={{
                    inputProps: {
                      step: 0.01,
                      min: 0,
                    },
                  }}
                  sx={{ mb: formik.errors.pizzaDiameter ? 0 : 3 }}
                />
                {formik.touched.pizzaDiameter &&
                  formik.errors.pizzaDiameter && (
                    <Typography sx={{ textAlign: "left", mb: 2 }} color="error">
                      {formik.errors.pizzaDiameter}
                    </Typography>
                  )}
              </>
            )}

            {formik.values.dishType === DishType.Soup && (
              <>
                <Typography textAlign="left">Spiciness</Typography>
                <Slider
                  id="soupSpiciness"
                  name="soupSpiciness"
                  defaultValue={3}
                  valueLabelDisplay="auto"
                  step={1}
                  marks={spicinessMarks}
                  min={1}
                  max={10}
                  onChange={formik.handleChange}
                  value={formik.values.soupSpiciness ?? 0}
                  sx={{ mb: formik.errors.soupSpiciness ? 0 : 3 }}
                >
                  {formik.touched.soupSpiciness &&
                    formik.errors.soupSpiciness && (
                      <Typography
                        sx={{ textAlign: "left", mb: 2 }}
                        color="error"
                      >
                        {formik.errors.soupSpiciness}
                      </Typography>
                    )}
                </Slider>
              </>
            )}

            {formik.values.dishType === DishType.Sandwich && (
              <>
                <TextField
                  id="noOfBread"
                  label="Number of slices of bread"
                  type="number"
                  onChange={formik.handleChange}
                  value={formik.values.noOfBread ?? ""}
                  sx={{ mb: formik.errors.noOfBread ? 0 : 3 }}
                />
                {formik.touched.noOfBread && formik.errors.noOfBread && (
                  <Typography sx={{ textAlign: "left", mb: 2 }} color="error">
                    {formik.errors.noOfBread}
                  </Typography>
                )}
              </>
            )}
            <Button
              type="submit"
              id="submitBtn"
              variant="contained"
              sx={{ mx: "auto", mt: 3 }}
            >
              Save dish!
            </Button>
          </FormControl>
        </form>
      )}
    </>
  );
};
