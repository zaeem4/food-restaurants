import { useMemo, useEffect, useState, useRef } from "react";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
import { useSelector } from "react-redux";
// import { useNavigate } from 'react-router-dom';

import { Box, Button, Card, Tooltip, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MaterialReactTable from "material-react-table";

import AddNewCompanyModal from "./AddNewCompanyModal.js";
import EditCompanyModal from "./EditCompanyModal.js";

import { apiGet } from "src/utils/axios";

function RecentCompanies() {
  const user = useSelector((state) => state.user.value);
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [extraData, setExtraData] = useState({
    restaurants: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/companies");
      if (response.success) {
        if (user.role === "restaurant") {
          const companies = response.companies.filter(
            (company) => company.restaurant_owner === user.role_id
          );
          setData(companies);
        } else {
          setData(response.companies);
        }
        setExtraData({
          restaurants: response.restaurants,
          type: response.type,
          shifts: response.shifts,
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
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();

    return () => {
      setData([]);
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "user_name",
        header: "Name",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "restaurant_user_name",
        header: "Restaurant",
        size: 150,
        createAble: false,
        enableEditing: false,
      },
      {
        accessorKey: "restaurant_owner",
        header: "Restaurant",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "address",
        header: "Address",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "phone",
        header: "Phone Number",
        size: 200,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "owner",
        header: "Owner",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "city",
        header: "City",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "tax_number",
        header: "Tax Number",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "email",
        header: "Email",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "shifts",
        header: "Shifts",
        size: 150,
        createAble: true,
        enableEditing: false,
      },
      {
        accessorKey: "type",
        header: "Company Size",
        size: 150,
        createAble: true,
        enableEditing: false,
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
          columnVisibility: {
            restaurant_owner: false,
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
            {/* <Tooltip cursor placement="left" title="Edit Details">
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

      {createModalOpen && (
        <AddNewCompanyModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
          user={user}
          extraData={extraData}
        />
      )}

      {editModalOpen && (
        <EditCompanyModal
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

export default RecentCompanies;
