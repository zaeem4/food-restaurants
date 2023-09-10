import { useMemo, useEffect, useState, useRef } from "react";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
// import { useNavigate } from 'react-router-dom';

import { Box, Button, Card, Tooltip, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MaterialReactTable from "material-react-table";

import { apiGet } from "src/utils/axios";

import AddNewMealsModal from "./AddNewMealsModal.js";

function RecentMeals() {
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [extraData, setExtraData] = useState({
    ingredients: [],
    restaurants: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const fetchMeals = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/meals");
      if (response.success) {
        setData(response.meals);
        setExtraData({
          ingredients: response.ingredients,
          restaurants: response.restaurants,
        });
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

  const handleCreateNewRow = (values) => {
    fetchMeals();
  };

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
        enableEditing: true,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 250,
        createAble: true,
        enableEditing: true,
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 200,
        createAble: true,
        enableEditing: true,
      },
      {
        accessorKey: "ingredients_name",
        header: "Ingredients",
        size: 200,
        createAble: false,
        enableEditing: false,
      },
      {
        accessorKey: "ingredients",
        header: "Ingredients",
        size: 200,
        createAble: true,
        enableEditing: true,
      },
      {
        accessorKey: "restaurant_id",
        header: "Restaurant ID",
        size: 50,
        createAble: true,
        enableEditing: true,
      },
      {
        accessorFn: (row) => new Date(row.created_at),
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        accessorKey: "created_at",
        header: "Created On",
        size: 150,
        createAble: false,
        enableEditing: false,
      },
      {
        accessorFn: (row) => new Date(row.updated_at),
        Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(),
        accessorKey: "updated_at",
        header: "Updated On",
        size: 150,
        createAble: false,
        enableEditing: false,
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
        // positionActionsColumn={"last"}
        initialState={{
          showGlobalFilter: true,
          columnVisibility: { ingredients: false },
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
            {/* <Tooltip cursor title="Edit Details">
              <span>
                <IconButton onClick={() => {}}>
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip> */}
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
        extraData={extraData}
      />
    </Card>
  );
}

export default RecentMeals;
