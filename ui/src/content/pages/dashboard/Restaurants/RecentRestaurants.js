import { useMemo, useEffect, useState, useRef } from "react";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
import MaterialReactTable from "material-react-table";
// import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Card,
  Tooltip,
  IconButton,
  Toolbar,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";

// import { apiCall } from 'src/utils/axios';
// import { generateColFilters } from 'src/utils/table';

function RecentRestaurants() {
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "name",
        size: 150,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 150,
      },
      {
        accessorKey: "phone",
        header: "Phone",
        size: 200,
      },
      {
        accessorKey: "owner",
        header: "Owner",
        size: 150,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 150,
      },
    ],
    []
  );

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const theme = useTheme();
  const tableInstanceRef = useRef(null);

  const fetchRestaurants = async () => {
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
    fetchRestaurants();

    return () => {
      setData([]);
    };
  }, []);

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
              onClick={() => {
                alert("Add User");
              }}
              sx={{
                backgroundColor: theme.colors.secondary.main,
                color: theme.colors.primary.main,
              }}
              variant="contained"
            >
              Crete New Account
            </Button>
          </Box>
        </Toolbar>
      )}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableColumnFilters={false}
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
        muiSearchTextFieldProps={{
          placeholder: `Search`,
          sx: { minWidth: "300%" },
          variant: "outlined",
        }}
        // onColumnFiltersChange={setColumnFilters}
        // onGlobalFilterChange={setGlobalFilter}
        // onPaginationChange={setPagination}
        // onSortingChange={setSorting}
        // rowCount={rowCount}
        state={{
          // columnFilters,
          // globalFilter,
          isLoading,
          // pagination,
          showAlertBanner: isError,
          // showProgressBars: isRefetching,
          // sorting
        }}
        tableInstanceRef={tableInstanceRef}
      />
    </Card>
  );
}

export default RecentRestaurants;
