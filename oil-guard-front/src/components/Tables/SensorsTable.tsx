"use client";

import React, { useEffect, useState } from "react";
import {
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { DataTable } from "../Tables/Datatable";

type Sensor = {
  id: number;
  online: boolean;
  latitude: number;
  longitude: number;
  pipelineName: string;
};

export default function SensorsPage() {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [totalSensors, setTotalSensors] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSensor, setNewSensor] = useState<Sensor>({
    id: 0,
    online: false,
    latitude: 0,
    longitude: 0,
    pipelineName: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sensorToDelete, setSensorToDelete] = useState<Sensor | null>(null);

  const columns = [
    { key: "pipelineName", label: "Pipeline Name" },
    {
      key: "online",
      label: "Online",
      render: (row: Sensor) => (row.online ? "Online" : "Offline"),
    },
    { key: "latitude", label: "Latitude" },
    { key: "longitude", label: "Longitude" },
    {
      key: "actions",
      label: "Actions",
      render: (row: Sensor) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEditSensor(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteSensor(row)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const getToken = () => localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sensors`,
          {
            params: { page: page + 1, size: rowsPerPage },
            headers: {
              accept: "application/json",
            },
          },
        );

        const { items, meta } = response.data.payload;
        const allSensors = items.map((sensor: any) => ({
          id: sensor.id,
          online: sensor.online,
          latitude: sensor.latitude,
          longitude: sensor.longitude,
          pipelineName: sensor.pipeline.name,
        }));

        setSensors(allSensors);
        setTotalSensors(meta.totalItems);
      } catch (error) {
        console.error("Failed to fetch sensors", error);
      }
    };

    fetchSensors();
  }, [page, rowsPerPage]);

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setIsEditMode(false);
    setNewSensor({
      id: 0,
      online: false,
      latitude: 0,
      longitude: 0,
      pipelineName: "",
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewSensor({
      id: 0,
      online: false,
      latitude: 0,
      longitude: 0,
      pipelineName: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNewSensor((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateSensor = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sensors`,
        newSensor,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Sensor created successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create sensor", error);
    }
  };

  const handleEditSensor = (sensor: Sensor) => {
    setNewSensor(sensor);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateSensor = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sensors/${newSensor.id}`,
        newSensor,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Sensor updated successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update sensor", error);
    }
  };

  const handleDeleteSensor = (sensor: Sensor) => {
    setSensorToDelete(sensor);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSensor = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sensors/${sensorToDelete?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Sensor deleted successfully!");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setSensorToDelete(null);
    } catch (error) {
      console.error("Failed to delete sensor", error);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
      >
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleOpenModal}
        >
          Add Sensor
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={sensors}
        count={totalSensors}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Create/Edit Sensor Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {isEditMode ? "Edit Sensor" : "Create Sensor"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="pipelineName"
            label="Pipeline Name"
            fullWidth
            margin="dense"
            value={newSensor.pipelineName}
            onChange={handleInputChange}
          />
          <TextField
            name="latitude"
            label="Latitude"
            fullWidth
            margin="dense"
            value={newSensor.latitude}
            onChange={handleInputChange}
          />
          <TextField
            name="longitude"
            label="Longitude"
            fullWidth
            margin="dense"
            value={newSensor.longitude}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={isEditMode ? handleUpdateSensor : handleCreateSensor}
            variant="contained"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this sensor?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteSensor}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
