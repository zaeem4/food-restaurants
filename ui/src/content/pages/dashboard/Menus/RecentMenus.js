import { useMemo, useEffect, useState, useRef } from "react";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
// import { useNavigate } from 'react-router-dom';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Box, Button, Card, Tooltip, IconButton, Toolbar, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MaterialReactTable from "material-react-table";

import AddNewMenusModal from "./AddNewMenusModal.js";

// import { apiCall } from 'src/utils/axios';
// import { generateColFilters } from 'src/utils/table';

function RecentMenus() {
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchMenus = async () => {
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
      setData([]);
      setIsError(false);
      setIsLoading(false);
      // setIsRefetching(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      // console.log(error);
    }
  };

  const handleCreateNewRow = (values) => {};

  useEffect(() => {
    fetchMenus();

    return () => {
      setData([]);
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        createAble: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: "discription",
        header: "Discription",
        size: 150,
        createAble: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: "meal_id",
        header: "Meal ID",
        size: 150,
        createAble: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: "restaurant_id",
        header: "Restaurant ID",
        size: 150,
        createAble: true,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => new Date(row.date),
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
        createAble: false,
      },
      {
        accessorFn: (row) => new Date(row.date),
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
        createAble: false,
      },
    ],
    []
  );

  return (
    <Card>
      {tableInstanceRef.current && (
        <Toolbar
          sx={(theme) => ({
            borderRadius: "4px",
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            gap: "1rem",
            justifyContent: "space-between",
            p: "1.5rem 0",
          })}
        >
          <MRTGlobalFilterTextField table={tableInstanceRef.current} />
          <Box>
            <Button
              variant="contained"
              onClick={() => setCreateModalOpen(true)}
            >
              Add New
            </Button>
          </Box>
        </Toolbar>
      )}
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
        enableTopToolbar={false}
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
        globalFilterModeOptions={["fuzzy", "startsWith"]}
        muiSearchTextFieldProps={{
          placeholder: `Search`,
          sx: { minWidth: "330%" },
          variant: "outlined",
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
        }}
        tableInstanceRef={tableInstanceRef}
      />
      <AddNewMenusModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </Card>
  );
}

export default RecentMenus;
