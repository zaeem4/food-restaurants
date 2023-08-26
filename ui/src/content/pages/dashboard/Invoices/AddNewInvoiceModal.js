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
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LoadingButton } from "@mui/lab";

import Swal from "sweetalert2";
import { apiPost } from "src/utils/axios";

const AddNewInvoiceModal = ({
  open,
  columns,
  onClose,
  onSubmit,
  extraData,
}) => {
  const [spinner, setSpinner] = useState(false);

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey && column.createAble) {
        if (
          column.accessorKey === "start_date" ||
          column.accessorKey === "end_date"
        ) {
          acc[column.accessorKey] = new Date().toLocaleDateString();
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
      const data = await apiPost(`/admin/invoices/create`, values);

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
      <DialogTitle>Add New Invoice</DialogTitle>
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
                (column.accessorKey === "start_date" ? (
                  <DatePicker
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    // error={!values[column.accessorKey]}
                    value={
                      values[column.accessorKey] ??
                      new Date().toLocaleDateString().replaceAll("/","-")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={"Filter Mode: Equal to"}
                        sx={{ minWidth: "120px" }}
                        variant="standard"
                        name={column.accessorKey}
                      />
                    )}
                    onChange={(newValue) =>
                      setValues({
                        ...values,
                        start_date: newValue,
                      })
                    }
                  />
                ) : column.accessorKey === "end_date" ? (
                  <DatePicker
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    // error={!values[column.accessorKey]}
                    value={
                      values[column.accessorKey] ??
                      new Date().toLocaleDateString().replaceAll("/","-")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={"Filter Mode: Equal to"}
                        sx={{ minWidth: "120px" }}
                        variant="standard"
                        name={column.accessorKey}
                      />
                    )}
                    onChange={(newValue) =>
                      setValues({
                        ...values,
                        end_date: newValue,
                      })
                    }
                  />
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

export default AddNewInvoiceModal;
