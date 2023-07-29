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
import DashboardIcon from "@mui/icons-material/Dashboard";

// import { apiCall } from 'src/utils/axios';
// import { generateColFilters } from 'src/utils/table';

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
        accessorFn: (row) => new Date(row.date),
        accessorKey: "created_on",
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
        accessorFn: (row) => new Date(row.date),
        accessorKey: "updated_on",
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
      // if (!data.length) {
      //   setIsLoading(true);
      // } else {
      //   setIsRefetching(true);
      // }

      // const response = await apiCall('getUsers', {
      //   query: `query($page: Int, $limit: Int, $columnFilters: [ColumnFilter], $globalFilter: String, $sorting: sortBy){
      //             getUsers(page: $page, limit: $limit, columnFilters: $columnFilters, globalFilter: $globalFilter, sorting: $sorting) {
      //               body
      //               success
      //               total
      //               users {
      //                 email
      //                 name
      //                 walletAddressDB
      //                 profilePicture
      //                 ReferredBy
      //               }
      //             }
      //           }`,
      //   variables: {
      //     page: pagination.pageIndex,
      //     limit: pagination.pageSize,
      //     columnFilters: generateColFilters(columnFilters, columns),
      //     globalFilter: globalFilter,
      //     sorting: sorting.length > 0 ? sorting[0] : null
      //   }
      // });
      // if (response.success) {
      //   setData(response.users);
      //   setRowCount(response.total);
      // } else {
      //   setIsError(true);
      //   setIsLoading(false);
      //   return;
      // }

      setIsError(false);
      setIsLoading(false);
      // setIsRefetching(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      // console.log(error);
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
        positionActionsColumn={"last"}

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
                  <DashboardIcon />
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
