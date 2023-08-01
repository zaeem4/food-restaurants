import { useMemo, useEffect, useState, useRef } from "react";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
// import { useNavigate } from 'react-router-dom';

import { Box, Button, Card, Tooltip, IconButton, Toolbar } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import MaterialReactTable from "material-react-table";

import AddNewMealsModal from "./AddNewMealsModal.js";

function RecentMeals() {
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchMeals = async () => {
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
    fetchMeals();

    return () => {
      setData([]);
    };
  }, []);

  
const columns = useMemo(
  () => [
    {
      accessorKey: "name",
      header: "name",
      size: 150,
      createAble: true,
    },
    {
      accessorKey: "discription",
      header: "Discription",
      size: 150,
      createAble: true,
    },
    {
      accessorKey: "price",
      header: "Price",
      size: 200,
      createAble: true,
    },
    {
      accessorKey: "ingredients",
      header: "Ingredients",
      size: 150,
      createAble: true,
    },
    {
      accessorKey: "restaurant_id",
      header: "Restaurant ID",
      size: 200,
      createAble: true,
    },
    {
      accessorFn: (row) => new Date(row.created_at),
      Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
      accessorKey: "created_at",
      header: "Created On",
      size: 150,
      createAble: false,
    },
    {
      accessorFn: (row) => new Date(row.updated_at),
      Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
      accessorKey: "updated_at",
      header: "Updated On",
      size: 150,
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
        tableInstanceRef={tableInstanceRef}
        columns={columns}
        data={data}
        enableColumnFilters={false}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableTopToolbar={false}
        enableStickyHeader
        enableStickyFooter
        enableRowActions
        positionToolbarAlertBanner="bottom"
        positionActionsColumn={"last"}
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
      />
      <AddNewMealsModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </Card>
  );
}

export default RecentMeals;
