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

type Report = {
  id: number;
  createdAt: string;
  description: string;
  status: string;
  userName: string;
  pipelineName: string;
};

export default function RepoPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [totalReports, setTotalReports] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newReport, setNewReport] = useState<Report>({
    id: 0,
    createdAt: "",
    userName: "",
    pipelineName: "",
    description: "",
    status: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const columns = [
    { key: "pipelineName", label: "Pipeline Name" },
    { key: "userName", label: "User Name" },
    { key: "description", label: "Description" },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Created At",
      render: (row: Report) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: Report) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleEditReport(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteReport(row)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const getToken = () => localStorage.getItem("accessToken") || "";

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports`,
          {
            params: { page: page + 1, size: rowsPerPage },
            headers: {
              accept: "application/json",
            },
          },
        );

        const { items, meta } = response.data.payload;
        const allReports = items.map((report: any) => ({
          id: report.id,
          createdAt: report.createdAt,
          description: report.description,
          status: report.status,
          userName: report.user.names,
          pipelineName: report.pipeline.name,
        }));
        setReports(allReports);
        setTotalReports(meta.totalItems);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };

    fetchReports();
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
    setNewReport({
      id: 0,
      createdAt: "",
      userName: "",
      pipelineName: "",
      description: "",
      status: "",
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewReport({
      id: 0,
      createdAt: "",
      userName: "",
      pipelineName: "",
      description: "",
      status: "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateReport = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports`,
        newReport,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Report created successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create report", error);
    }
  };

  const handleEditReport = (report: Report) => {
    setNewReport(report);
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleUpdateReport = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/${newReport.id}`,
        newReport,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Report updated successfully!");
      setSnackbarOpen(true);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update report", error);
    }
  };

  const handleDeleteReport = (report: Report) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteReport = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reports/${reportToDelete?.id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );
      setSnackbarMessage("Report deleted successfully!");
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error("Failed to delete report", error);
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
          Add Report
        </Button>
      </Stack>

      <DataTable
        columns={columns}
        rows={reports}
        count={totalReports}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Create/Edit Report Modal */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {isEditMode ? "Edit Report" : "Create Report"}
        </DialogTitle>
        <DialogContent>
          <TextField
            name="pipelineName"
            label="Pipeline Name"
            fullWidth
            margin="dense"
            value={newReport.pipelineName}
            onChange={handleInputChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            margin="dense"
            value={newReport.description}
            onChange={handleInputChange}
          />
          <TextField
            name="status"
            label="Status"
            fullWidth
            margin="dense"
            value={newReport.status}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={isEditMode ? handleUpdateReport : handleCreateReport}
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
          Are you sure you want to delete this report?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteReport}
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
