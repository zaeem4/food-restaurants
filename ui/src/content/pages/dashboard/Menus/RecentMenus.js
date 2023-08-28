import { useMemo, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
// import { useNavigate } from 'react-router-dom';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  Box,
  Button,
  Card,
  Tooltip,
  IconButton,
  Toolbar,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MaterialReactTable from "material-react-table";
import Swal from "sweetalert2";

import { apiGet, apiPost } from "src/utils/axios";

import AddNewMenusModal from "./AddNewMenusModal.js";
import EditMenusModal from "./EditMenusModal.js";

function RecentMenus() {
  const user = useSelector((state) => state.user.value);
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);

  const [extraData, setExtraData] = useState({
    meals: [],
    restaurants: [],
    days: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const fetchMenus = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/menus");
      if (response.success) {
        setData(response.menus);
        setExtraData({
          meals: response.meals,
          restaurants: response.restaurants,
          days: response.days,
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

  const placeOrder = async (row) => {
    const orderObject = {
      name: row.name,
      restaurant_id: row.restaurant_id,
      menus_id: row.id,
      status: "pending",
      company_id: user.role_id,
      employee_id: null,
    };
    try {
      setIsLoading(true);
      const data = await apiPost(`/admin/orders/create`, orderObject);

      if (data.success) {
        setIsLoading(false);
        Swal.fire({
          icon: "success",
          title: "Successfully Placed",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
        });

        setIsLoading(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      setIsLoading(false);
    }
  };

  const handleCreateNewRow = (values) => {
    fetchMenus();
  };

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
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "description",
        header: "Description",
        size: 150,
        createAble: true,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "meal",
        header: "Meal",
        size: 150,
        createAble: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "meal_id",
        header: "Meal ID",
        size: 150,
        createAble: true,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "restaurant",
        header: "Restaurant",
        size: 150,
        createAble: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "restaurant_id",
        header: "Restaurant ID",
        size: 150,
        createAble: true,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "day",
        header: "Days of Week",
        size: 150,
        createAble: true,
        enableEditing: false,
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
                helperText={"Filter Mode: less Than"}
                sx={{ minWidth: "120px" }}
                variant="standard"
              />
            )}
            value={column.getFilterValue()}
          />
        ),
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
          {!["restaurant", "company"].includes(user.role) && (
            <Box>
              <Button
                variant="contained"
                onClick={() => setCreateModalOpen(true)}
              >
                Add New
              </Button>
            </Box>
          )}
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
        // positionActionsColumn={"last"}
        enableTopToolbar={false}
        initialState={{
          showGlobalFilter: true,
          showColumnFilters: true,
          columnVisibility: { restaurant_id: false, meal_id: false },
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
        renderRowActions={({ row }) =>
          !["restaurant", "company"].includes(user.role) ? (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {/* <Tooltip cursor title="Edit Details">
                <span>
                  <IconButton
                    onClick={(e) => {
                      setCurrentRow(row.original);
                      setEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip> */}
            </Box>
          ) : ["company"].includes(user.role) ? (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip cursor title="Place Order">
                <span>
                  <IconButton
                    onClick={(e) => {
                      setCurrentRow(row.original);
                      placeOrder(row.original);
                    }}
                  >
                    <RestaurantIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ) : null
        }
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

      {createModalOpen && (
        <AddNewMenusModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          extraData={extraData}
        />
      )}

      {editModalOpen && (
        <EditMenusModal
          columns={columns}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleCreateNewRow}
          row={currentRow}
        />
      )}
    </Card>
  );
}

export default RecentMenus;
