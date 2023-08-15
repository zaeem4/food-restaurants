import { useMemo, useEffect, useState, useRef } from "react";
import MaterialReactTable from "material-react-table";
// import { useNavigate } from 'react-router-dom';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Box,
  Button,
  Card,
  Tooltip,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

import { apiGet } from "src/utils/axios";

// import AddNewInvoiceModal from "./AddNewInvoiceModal.js";

function RecentInvoices() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorKey: "restaurant_id",
        header: "Restaurant ID",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => new Date(row.created_at),
        accessorKey: "created_at",
        header: "Created On",
        filterFn: "lessThanOrEqualTo",
        sortingFn: "datetime",
        filterVariant: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        Filter: ({ column }) => (
          <DatePicker
            onChange={(newValue) => {
              column.setFilterValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={"Filter Mode: Lesss Than"}
                sx={{ minWidth: "120px" }}
                variant="standard"
              />
            )}
            value={column.getFilterValue()}
          />
        ),
      },
      {
        accessorFn: (row) => new Date(row.updated_at),
        accessorKey: "updated_at",
        header: "Updated On",
        filterFn: "lessThanOrEqualTo",
        sortingFn: "datetime",
        filterVariant: "datetime",
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        Header: ({ column }) => <em>{column.columnDef.header}</em>,
        Filter: ({ column }) => (
          <DatePicker
            onChange={(newValue) => {
              column.setFilterValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={"Filter Mode: Lesss Than"}
                sx={{ minWidth: "120px" }}
                variant="standard"
              />
            )}
            value={column.getFilterValue()}
          />
        ),
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/invoices");
      if (response.success) {
        setData(response.invoices);
      } else {
        setIsError(true);
        setIsLoading(false);
        return;
      }
      setIsError(false);
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();

    return () => {
      setData([]);
    };
  }, []);

  return (
    <Card>
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnFilters
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableStickyHeader
        enableStickyFooter
        enableRowActions
        positionToolbarAlertBanner="bottom"
        // positionActionsColumn={"last"}
        initialState={{
          showGlobalFilter: true,
          showColumnFilters: true,
        }}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: "error",
                children: "Error loading data",
              }
            : undefined
        }
        displayColumnDefOptions={{
          "mrt-row-actions": {
            header: "Action",
          },
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip arrow placement="left" title="View Details">
              <span>
                <IconButton onClick={() => {}}>
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
        positionGlobalFilter="left"
        muiSearchTextFieldProps={{
          placeholder: `Search`,
          sx: { minWidth: "350%" },
          variant: "outlined",
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
        }}
      />
    </Card>
  );
}

export default RecentInvoices;
