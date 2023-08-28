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
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MaterialReactTable from "material-react-table";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { apiGet } from "src/utils/axios";

import AddNewOrderModal from "./AddNewOrderModal.js";

import ChangeOrderStatus from "./ChangeOrderStatus.js";

function RecentOrders() {
  const user = useSelector((state) => state.user.value);
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [extraData, setExtraData] = useState({
    menus: [],
    restaurants: [],
    companies: [],
    status: [],
    emloyees: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/orders");

      if (response.success) {
        if (user.role === "rider") {
          const orders = response.orders.filter(
            (order) => order.status === "ready-for-pickup"
          );
          setData(orders);
        } else if (user.role === "restaurant") {
          const orders = response.orders.filter(
            (order) => order.restaurant_id === user.role_id
          );
          setData(orders);
        } else if (user.role === "kitchen") {
          const orders = response.orders.filter(
            (order) =>
              order.status === "in-kitchen" &&
              order.restaurant_id === user.restaurant_id
          );
          setData(orders);
        } else {
          setData(response.orders);
        }
        setExtraData({
          menus: response.menus,
          restaurants: response.restaurants,
          companies: response.companies,
          status: response.status,
          employees: response.employees,
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
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();

    return () => {
      setData([]);
    };
  }, []);

  const columns = useMemo(
    () =>
      user.role !== "rider"
        ? [
            {
              accessorKey: "name",
              header: "Name",
              size: 150,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "status",
              header: "Status",
              size: 150,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
              Cell: ({ cell, row }) => (
                <Typography
                  sx={{
                    color:
                      row.original.status?.toLowerCase() === "ready-for-pickup"
                        ? "#28955A"
                        : row.original.status?.toLowerCase() === "in-kitchen"
                        ? "#EDB72B"
                        : row.original.status?.toLowerCase() === "delivered"
                        ? "#0000FF"
                        : "#BB4C4C",
                  }}
                >
                  {cell.getValue()}
                </Typography>
              ),
            },
            {
              accessorKey: "menus_id",
              header: "Menu ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "menus",
              header: "Menus",
              size: 100,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "company_id",
              header: "Company ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "company",
              header: "Company",
              size: 100,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "restaurant_id",
              header: "Restaurant ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "restaurant",
              header: "Restaurant",
              size: 50,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "employee_id",
              header: "Employee ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "employee",
              header: "Employee",
              size: 50,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "ingredient_names",
              header: "Ingredients",
              size: 150,
              createAble: false,
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
          ]
        : [
            {
              accessorKey: "status",
              header: "Status",
              size: 150,
              createAble: false,
              enableEditing: true,
              enableColumnFilter: false,
              Cell: ({ cell, row }) => (
                <Typography
                  sx={{
                    color:
                      row.original.status?.toLowerCase() === "ready-for-pickup"
                        ? "#28955A"
                        : row.original.status?.toLowerCase() === "in-kitchen"
                        ? "#EDB72B"
                        : row.original.status?.toLowerCase() === "delivered"
                        ? "#0000FF"
                        : "#BB4C4C",
                  }}
                >
                  {cell.getValue()}
                </Typography>
              ),
            },
            {
              accessorKey: "menus_id",
              header: "Menu ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "menus",
              header: "Menus",
              size: 100,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "company_id",
              header: "Company ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "company",
              header: "Company",
              size: 100,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "restaurant_id",
              header: "Restaurant ID",
              size: 50,
              createAble: true,
              enableEditing: true,
              enableColumnFilter: false,
            },
            {
              accessorKey: "restaurant",
              header: "Restaurant",
              size: 50,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "employee_id",
              header: "Employee ID",
              size: 50,
              createAble: false,
              enableEditing: false,
              enableColumnFilter: false,
            },
            {
              accessorKey: "employee",
              header: "Employee",
              size: 50,
              createAble: false,
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
          {user.role === "restaurant" && (
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
        tableInstanceRef={tableInstanceRef}
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
          columnVisibility: {
            restaurant_id: false,
            menus_id: false,
            company_id: false,
            employee_id: false,
          },
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
          !["company"].includes(user.role) && (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip title="Change Status">
                <span>
                  <AutorenewIcon
                    onClick={(e) => {
                      setCurrentRow(row.original);
                      setEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </AutorenewIcon>
                </span>
              </Tooltip>
            </Box>
          )
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
      />

      {createModalOpen && (
        <AddNewOrderModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          user={user}
          extraData={extraData}
        />
      )}

      {editModalOpen && (
        <ChangeOrderStatus
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleCreateNewRow}
          row={currentRow}
          extraData={extraData}
        />
      )}
    </Card>
  );
}

export default RecentOrders;
