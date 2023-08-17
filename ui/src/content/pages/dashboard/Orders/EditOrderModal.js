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
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import Swal from "sweetalert2";
import { apiPut } from "src/utils/axios";

const EditOrderModal = ({ open, columns, onClose, onSubmit, row }) => {
  const [spinner, setSpinner] = useState(false);

  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      if (column.accessorKey && row[column.accessorKey]) {
        acc[column.accessorKey] = row[column.accessorKey];
      }
      return acc;
    }, {})
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSpinner(true);
      const data = await apiPut(`/admin/order/${row.id}`, values);

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
      <DialogTitle>Edit Order</DialogTitle>
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
            {columns.map((column) =>
              column.enableEditing ? (
                <TextField
                  required
                  error={!row[column.accessorKey]}
                  variant="standard"
                  label={column.header}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  value={row[column.accessorKey]}
                  onChange={(e) =>
                    setValues({ ...values, [e.target.name]: e.target.value })
                  }
                />
              ) : ["created_at", "updated_at"].includes(column.accessorKey) ? (
                <TextField
                  variant="standard"
                  label={column.header}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  value={new Date(row[column.accessorKey]).toLocaleDateString()}
                  inputProps={{ readOnly: true }}
                />
              ) : (
                <TextField
                  variant="standard"
                  label={column.header}
                  key={column.accessorKey}
                  name={column.accessorKey}
                  value={row[column.accessorKey]}
                  inputProps={{ readOnly: true }}
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
              Edit
            </LoadingButton>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderModal;
