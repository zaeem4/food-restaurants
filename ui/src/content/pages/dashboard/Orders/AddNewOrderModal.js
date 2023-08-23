import { useState, useEffect } from "react";

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

const AddNewOrderModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  user,
  extraData,
}) => {
  console.log(extraData);
  const [spinner, setSpinner] = useState(false);

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey && column.createAble) {
        // if (
        //   user.role === "restaurant" &&
        //   column.accessorKey === "restaurant_id"
        // ) {
        //   acc[column.accessorKey] = user.role_id;
        // } else
        if (column.accessorKey === "menus_id") {
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
      const data = await apiPost(`/admin/orders/create`, values);

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
      <DialogTitle>Add New Order</DialogTitle>
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
                (column.accessorKey === "menus_id" ? (
                  <FormControl
                    sx={{ m: 1, width: 200 }}
                    key={column.accessorKey}
                  >
                    <InputLabel id={`${column.accessorKey}-label`}>
                      Menus
                    </InputLabel>
                    <Select
                      labelId={`${column.accessorKey}-label`}
                      name={column.accessorKey}
                      multiple
                      value={values[column.accessorKey]}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          [e.target.name]:
                            typeof e.target.value === "string"
                              ? e.target.value.split(",")
                              : e.target.value,
                        })
                      }
                      label="Menus"
                    >
                      {extraData.menus.map((menu) => (
                        <MenuItem key={menu.id} value={menu.id}>
                          {menu.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : column.accessorKey === "company_id" ? (
                  <FormControl
                    sx={{ m: 1, width: 200 }}
                    key={column.accessorKey}
                  >
                    <InputLabel id={`${column.accessorKey}-label`}>
                      Companies
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
                      label="Companies"
                    >
                      {extraData.companies.map((company) => (
                        <MenuItem key={company.id} value={company.id}>
                          {company.user_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : column.accessorKey === "status" ? (
                  <FormControl
                    sx={{ m: 1, width: 200 }}
                    key={column.accessorKey}
                  >
                    <InputLabel id={`${column.accessorKey}-label`}>
                      Status
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
                      label="Status"
                    >
                      {extraData.status.map((id) => (
                        <MenuItem key={id} value={id}>
                          {id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : column.accessorKey === "restaurant_id" ? (
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
                ) : (
                  <TextField
                    required={column.accessorKey !== "employee_id"}
                    error={!values[column.accessorKey]}
                    variant="standard"
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    value={values[column.accessorKey]}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                    // inputProps={{
                    //   readOnly:
                    //     user.role === "restaurant" &&
                    //     column.accessorKey === "restaurant_id",
                    // }}
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

export default AddNewOrderModal;
