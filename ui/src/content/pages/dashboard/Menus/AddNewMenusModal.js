import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import Swal from "sweetalert2";
import { apiPost } from "src/utils/axios";

const AddNewMenusModal = ({ open, columns, onClose, onSubmit, extraData }) => {
  const [spinner, setSpinner] = useState(false);

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey && column.createAble) {
        if (column.accessorKey === "day") {
          acc[column.accessorKey] = [];
        } else {
          acc[column.accessorKey] = " ";
        }
      }
      return acc;
    }, {})
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSpinner(true);
      const data = await apiPost(`/admin/menus/create`, values);

      if (data.success) {
        onSubmit(values);
        setSpinner(false);
        onClose();
        Swal.fire({
          icon: "success",
          title: "Successfully created",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
        });

        setSpinner(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      setSpinner(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Add New Menus</DialogTitle>
      <DialogContent sx={{ paddingTop: "6px!important" }}>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1 },
          }}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridAutoFlow: "row",
              justifyContent: "start",
              gridgap: "0 10px",
              gap: "1.5rem",
            }}
          >
            {columns.map(
              (column) =>
                column.createAble &&
                (column.accessorKey === "restaurant_id" ? (
                  <FormControl
                    sx={{ m: 1, width: 200 }}
                    key={column.accessorKey}
                  >
                    <InputLabel id={`${column.accessorKey}-label`}>
                      Restaurants
                    </InputLabel>
                    <Select
                      labelId={`${column.accessorKey}-label`}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      label="Restaurants"
                    >
                      {extraData.restaurants.map((restaurant) => (
                        <MenuItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.user_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : column.accessorKey === "meal_id" ? (
                  <FormControl
                    sx={{ m: 1, width: 200 }}
                    key={column.accessorKey}
                  >
                    <InputLabel id={`${column.accessorKey}-label`}>
                      Meals
                    </InputLabel>
                    <Select
                      labelId={`${column.accessorKey}-label`}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      label="Meals"
                    >
                      {extraData.meals.map((meal) => (
                        <MenuItem key={meal.id} value={meal.id}>
                          {meal.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : column.accessorKey === "day" ? (
                  <FormControl
                    sx={{ m: 1, width: 200 }}
                    key={column.accessorKey}
                  >
                    <InputLabel id={`${column.accessorKey}-label`}>
                      Days
                    </InputLabel>
                    <Select
                      labelId={`${column.accessorKey}-label`}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      multiple
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]: e.target.value,
                        })
                      }
                      label="Days"
                    >
                      {extraData.days.map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    required
                    error={!values[column.accessorKey]}
                    variant="standard"
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                  />
                ))
            )}
          </Stack>
          <br />
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button onClick={onClose} variant="outlined" size="large">
              Cancel
            </Button>
            <LoadingButton
              size="large"
              type="submit"
              variant="contained"
              loading={spinner}
            >
              Add
            </LoadingButton>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewMenusModal;
