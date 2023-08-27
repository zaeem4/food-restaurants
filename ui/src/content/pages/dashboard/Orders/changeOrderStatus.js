import { useState } from "react";


import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Box,
    InputLabel,
    FormControl,
    Select,
    MenuItem
  } from "@mui/material";
  
import { LoadingButton } from "@mui/lab";

import Swal from "sweetalert2";
import { apiPut } from "src/utils/axios";

const ChangeOrderStatus = ({ open, columns, onClose, onSubmit, row,fetchOrders,statuses }) => {
    console.log(row);
  const [spinner, setSpinner] = useState(false);

  const [latestStatus, setLatestStatus] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSpinner(true);
      const data = await apiPut(`/admin/order/${row.order_id}`, latestStatus);

      if (data.success) {
        setSpinner(false);
        onClose();
        Swal.fire({
          icon: "success",
          title: "Successfully Changed",
          text:'Order status has been changed!'
        });
        fetchOrders();
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
      <DialogTitle>Change Order Status</DialogTitle>
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
            <FormControl
                  sx={{ m: 1, width: 200 }}
                  key='status'
                >
                  <InputLabel id={`status-label`}>
                    Status
                  </InputLabel>
                  <Select
                    name='status'
                    value={latestStatus}
                    onChange={(e) =>
                        setLatestStatus({
                            [e.target.name]: e.target.value,
                          })
                    }
                    label="Status"
                  >
                      {statuses.map((status) => (
                        <MenuItem key={status.id} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                      </Select>

                </FormControl>
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

export default ChangeOrderStatus;
