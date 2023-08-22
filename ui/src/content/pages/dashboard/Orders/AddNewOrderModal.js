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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import Swal from "sweetalert2";
import { apiPost } from "src/utils/axios";

const AddNewOrderModal = ({ open, columns, onClose, onSubmit, user }) => {
  const [spinner, setSpinner] = useState(false);

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey && column.createAble) {
        if (
          user.role === "restaurant" &&
          column.accessorKey === "restaurant_id"
        ) {
          acc[column.accessorKey] = user.role_id;
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
                column.createAble && (
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
                    inputProps={{
                      readOnly:
                        user.role === "restaurant" &&
                        column.accessorKey === "restaurant_id",
                    }}
                  />
                )
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
