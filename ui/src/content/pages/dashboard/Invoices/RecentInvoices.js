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
// import EditIcon from "@mui/icons-material/Edit";
import MaterialReactTable from "material-react-table";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import Swal from "sweetalert2";
import { apiGet, apiPost } from "src/utils/axios";

import AddNewInvoiceModal from "./AddNewInvoiceModal";
// import PdfInvoice from "./PdfInvoice";

function RecentInvoices() {
  const user = useSelector((state) => state.user.value);

  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [extraData, setExtraData] = useState({
    restaurants: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  // const [invoiceData, setInvoiceData] = useState(null);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/invoices");
      if (response.success) {
        if (user.role === "restaurant") {
          const invoices = response.invoices.filter(
            (invoice) => invoice.restaurant_id === user.role_id
          );
          setData(invoices);
        } else {
          const invoices = response.invoices.filter(
            (invoice) => invoice.company_id === null
          );
          setData(invoices);
        }
        setExtraData({
          restaurants: response.restaurants,
          companies: response.companies,
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
    fetchInvoices();
  };

  const handleGeneratePdf = async (row) => {
    try {
      setIsLoading(true);

      const data = await apiPost(`/admin/generate-pdf-by-${user.role}`, {
        invoiceData: row.original,
      });

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Successfully generated and send to email address",
          footer: `<a href="${data.filePath}" target="_blank">View Pdf</a>`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error,
        });
      }
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      setIsLoading(false);
    }
    // setInvoiceData(row.original);
  };

  useEffect(() => {
    fetchInvoices();

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
        accessorKey: "restaurant_id",
        header: "Restaurant ID",
        size: 150,
        createAble: true,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "restaurant",
        header: "restaurant",
        size: 150,
        createAble: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "company_id",
        header: "Company ID",
        size: 150,
        createAble: user.role === "restaurant",
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 150,
        createAble: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      // {
      //   accessorKey: "amount",
      //   header: "Total Amount",
      //   size: 150,
      //   createAble: false,
      //   enableEditing: false,
      //   enableColumnFilter: false,
      // },
      {
        accessorKey: "fee",
        header: "Fee",
        size: 150,
        createAble: false,
        enableEditing: false,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => new Date(row.start_date),
        accessorKey: "start_date",
        header: "Start Date",
        filterFn: "equalTo",
        sortingFn: "datetime",
        filterVariant: "datetime",
        createAble: true,
        enableEditing: false,
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
                helperText={"Filter Mode: Equal to"}
                sx={{ minWidth: "120px" }}
                variant="standard"
              />
            )}
            value={column.getFilterValue()}
          />
        ),
      },
      {
        accessorFn: (row) => new Date(row.end_date),
        accessorKey: "end_date",
        header: "End Date",
        filterFn: "equalTo",
        sortingFn: "datetime",
        filterVariant: "datetime",
        createAble: true,
        enableEditing: false,
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
                helperText={"Filter Mode: Equal to"}
                sx={{ minWidth: "120px" }}
                variant="standard"
              />
            )}
            value={column.getFilterValue()}
          />
        ),
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
                helperText={"Filter Mode: less Than"}
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

  return (
    <>
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
            {!["company", "rider", "kitchen"].includes(user.role) && (
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
              company_id: false,
              company: user.role === "restaurant",
              restaurant: user.role === "admin",
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
          renderRowActions={({ row }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              {/* <Tooltip cursor title="Edit Details">
                <span>
                  <IconButton onClick={() => {}}>
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip> */}
              <Tooltip cursor title="Generate PDF">
                <span>
                  <IconButton
                    onClick={() => {
                      handleGeneratePdf(row);
                    }}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          )}
          positionGlobalFilter="left"
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
      </Card>

      {createModalOpen && (
        <AddNewInvoiceModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          extraData={extraData}
          user={user}
        />
      )}
    </>
  );
}

export default RecentInvoices;
