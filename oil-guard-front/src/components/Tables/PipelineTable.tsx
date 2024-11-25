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

type Pipeline = {
  id: number;
  name: string;
  status: "Open" | "Closed";
  lastInspectionDate: string;
  pipeLineAge: number;
};

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [totalPipelines, setTotalPipelines] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPipeline, setNewPipeline] = useState<Pipeline>({
    id: 0,
    name: "",
    status: "Open",
    lastInspectionDate: new Date().toISOString(),
    pipeLineAge: 0,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState<Pipeline | null>(
    null,
  );

  const columns = [
    { key: "name", label: "Pipeline Name" },
    { key: "status", label: "Status" },
    {
      key: "lastInspectionDate",
      label: "Last Inspection Date",
      render: (row: Pipeline) =>
        new Date(row.lastInspectionDate).toLocaleDateString(),
    },
    { key: "pipeLineAge", label: "Pipeline Age (Years)" },
    {
      key: "actions",
      label: "Actions",
      render: (row: Pipeline) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEditPipeline(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeletePipeline(row)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const getToken = () => localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipelines`,
          {
            params: { page: page + 1, size: rowsPerPage },
            headers: {
              accept: "application/json",
            },
          },
        );

        const { items, meta } = response.data.payload;
        setPipelines(items);
        setTotalPipelines(meta.totalItems);
      } catch (error) {
        console.error("Failed to fetch pipelines", error);
      }
    };

    fetchPipelines();
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
    setNewPipeline({
      id: 0,
      name: "",
      status: "Open",
      lastInspectionDate: new Date().toISOString(),
      pipeLineAge: 0,
    });
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPipeline((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePipeline = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipelines`,
        newPipeline,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Pipeline created successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create pipeline", error);
    }
  };

  const handleEditPipeline = (pipeline: Pipeline) => {
    setNewPipeline(pipeline);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleUpdatePipeline = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipelines/${newPipeline.id}`,
        newPipeline,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Pipeline updated successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update pipeline", error);
    }
  };

  const handleDeletePipeline = (pipeline: Pipeline) => {
    setPipelineToDelete(pipeline);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePipeline = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pipelines/${pipelineToDelete?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Pipeline deleted successfully!");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setPipelineToDelete(null);
    } catch (error) {
      console.error("Failed to delete pipeline", error);
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
          Add Pipeline
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={pipelines}
        count={totalPipelines}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Create/Edit Pipeline Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {isEditMode ? "Edit Pipeline" : "Create Pipeline"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Pipeline Name"
            fullWidth
            margin="dense"
            value={newPipeline.name}
            onChange={handleInputChange}
          />
          <TextField
            name="status"
            label="Status"
            fullWidth
            margin="dense"
            value={newPipeline.status}
            onChange={handleInputChange}
          />
          <TextField
            name="lastInspectionDate"
            label="Last Inspection Date"
            type="datetime-local"
            fullWidth
            margin="dense"
            value={new Date(newPipeline.lastInspectionDate)
              .toISOString()
              .slice(0, -1)}
            onChange={(e) =>
              setNewPipeline((prev) => ({
                ...prev,
                lastInspectionDate: new Date(e.target.value).toISOString(),
              }))
            }
          />
          <TextField
            name="pipeLineAge"
            label="Pipeline Age"
            type="number"
            fullWidth
            margin="dense"
            value={newPipeline.pipeLineAge}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={isEditMode ? handleUpdatePipeline : handleCreatePipeline}
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
          Are you sure you want to delete this pipeline?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeletePipeline}
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
        <Alert severity="success" onClose={handleSnackbarClose}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
