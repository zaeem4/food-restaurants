import { useMemo, useEffect, useState, useRef, useReducer } from "react";
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
// import EditIcon from "@mui/icons-material/Edit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MaterialReactTable from "material-react-table";
import Swal from "sweetalert2";

import { apiGet, apiPost } from "src/utils/axios";

import AddNewMenusModal from "./AddNewMenusModal.js";
import EditMenusModal from "./EditMenusModal.js";

function RecentMenus() {
  const user = useSelector((state) => state.user.value);

  const tableInstanceRef = useRef(null);
  const rerender = useReducer(() => ({}), {})[1];

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
  const [rowSelection, setRowSelection] = useState({});

  const fetchMenus = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/menus");
      if (response.success) {
        if (user.role === "company") {
          const menus = response.menus.filter(
            (menu) =>
              menu.restaurant_id === user.restaurant_owner &&
              menu.type.includes(user.type) &&
              menu.day.includes(new Date().getDate())
          );
          setData(menus);
        } else if (user.role === "restaurant") {
          const menus = response.menus.filter(
            (menu) => menu.restaurant_id === user.role_id
          );
          setData(menus);
        } else {
          setData(response.menus);
        }
        setExtraData({
          meals: response.meals,
          restaurants: response.restaurants,
          days: response.days,
          type: response.type,
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
      restaurant_id: row.restaurant_id,
      meals_id: [row.meals_id],
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

  const placeMultiOrder = async (ids) => {
    const orderObject = {
      restaurant_id: user.restaurant_owner,
      meals_id: ids,
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
    console.log(values);
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
        accessorKey: "meals",
        header: "Meals",
        size: 150,
        createAble: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "meals_id",
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
        header: "Days of Month",
        size: 150,
        createAble: true,
        enableEditing: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => (
          <Box component="span">{cell.getValue()?.toLocaleString()}</Box>
        ),
      },
      {
        accessorKey: "type",
        header: "Menu Type",
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
          sx={() => ({
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
            {!["company"].includes(user.role) && (
              <Button
                variant="contained"
                onClick={() => setCreateModalOpen(true)}
                sx={{ marginRight: "5px" }}
              >
                Add New
              </Button>
            )}
            {user.role === "company" && (
              <Button
                disabled={!Object.keys(rowSelection).length > 0}
                variant="contained"
                onClick={() => {
                  const list = [];
                  const ids = Object.keys(rowSelection);
                  ids.forEach((id) => {
                    list.push(data[id].meals_id);
                  });
                  placeMultiOrder(list);
                }}
              >
                Place Order
              </Button>
            )}
          </Box>
        </Toolbar>
      )}
      <MaterialReactTable
        columns={columns}
        data={data}
        enableGrouping
        enableColumnFilters
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableStickyHeader
        enableStickyFooter
        enableRowActions
        enableRowSelection
        positionToolbarAlertBanner="bottom"
        // positionActionsColumn={"last"}
        enableTopToolbar={false}
        initialState={{
          expanded: true,
          grouping: ["name"],
          showGlobalFilter: true,
          showColumnFilters: true,
          columnVisibility: { restaurant_id: false, meals_id: false },
        }}
        onRowSelectionChange={(updater) => {
          setRowSelection((prev) =>
            updater instanceof Function ? updater(prev) : updater
          );
          queueMicrotask(rerender);
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
          ) : ["company"].includes(user.role) &&
            row.original.day.includes(new Date().getDate()) ? (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip cursor title="Place Order">
                <span>
                  <IconButton
                    onClick={(e) => {
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
          sx: { minWidth: "320%" },
          variant: "outlined",
        }}
        state={{
          isLoading,
          showAlertBanner: isError,
          rowSelection,
        }}
        tableInstanceRef={tableInstanceRef}
      />

      {createModalOpen && (
        <AddNewMenusModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          user={user}
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
