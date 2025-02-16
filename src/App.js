import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setDownloadUrl(null);
      }
    },
  });

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `https://trans-backend-w499.onrender.com/upload`,
        formData,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        textAlign: "center",
        p: 3,
        bgcolor: "white",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Upload CSV for Translations
      </Typography>

      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #2196f3",
          borderRadius: 3,
          p: 4,
          cursor: "pointer",
          backgroundColor: "#f0f7ff",
          "&:hover": { backgroundColor: "#e3f2fd" },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon color="primary" sx={{ fontSize: 50 }} />
        <Typography variant="body1" sx={{ mt: 1 }}>
          {file ? file.name : "Drag & Drop CSV here or Click to Upload"}
        </Typography>
      </Box>

      {file && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setFile(null)}
          >
            Remove File
          </Button>
        </Box>
      )}

      <Button
        variant="contained"
        sx={{ mt: 3, width: "100%" }}
        color="primary"
        disabled={loading || !file}
        onClick={handleUpload}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Upload & Process"
        )}
      </Button>

      {downloadUrl && (
        <Button
          variant="contained"
          color="success"
          sx={{ mt: 2, width: "100%" }}
          href={downloadUrl}
          download="translations.zip"
        >
          Download Translations
        </Button>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default FileUploader;
