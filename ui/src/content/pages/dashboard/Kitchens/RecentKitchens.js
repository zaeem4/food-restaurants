import { useMemo, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MRT_GlobalFilterTextField as MRTGlobalFilterTextField } from "material-react-table";
// import { useNavigate } from 'react-router-dom';

import { Box, Button, Card, Tooltip, IconButton, Toolbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import MaterialReactTable from "material-react-table";

import { apiGet } from "src/utils/axios";

import AddNewKitchensModal from "./AddNewKitchensModal.js";

function RecentKitchens() {
  const user = useSelector((state) => state.user.value);
  const tableInstanceRef = useRef(null);

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});

  const fetchKitchens = async () => {
    try {
      setIsLoading(true);

      const response = await apiGet("/admin/Kitchens");
      if (response.success) {
        const kitchens = response.kitchens.filter(
          (kitchen) => kitchen.restaurant_id === user.role_id
        );
        setData(kitchens);
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
    fetchKitchens();
  };

  useEffect(() => {
    fetchKitchens();

    return () => {
      setData([]);
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "user_name",
        header: "name",
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
        accessorKey: "description",
        header: "Description",
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
      <AddNewKitchensModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
        user={user}
      />
    </Card>
  );
}

export default RecentKitchens;
