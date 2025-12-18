import React, { useState } from "react";
import { UploadService } from "../services/api";
import styles from "./UploadTransactionsModal.module.css";

interface UploadTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadTransactionsModal: React.FC<UploadTransactionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isValidCSV = () => {
    return selectedFile !== null && selectedFile.type === "text/csv";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!isValidCSV || !selectedFile) return;

    try {
      console.log("Submitting CSV file:", selectedFile?.name);
      const result = await UploadService.uploadTransactions(selectedFile);

      console.log(`Upload successful: ${result}`);
      alert("Upload successful");

      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
      alert(`Upload failed: ${error}`);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h3>Upload Transactions</h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div>
          <label htmlFor="csvFile">Choose CSV File:</label>
          <input
            type="file"
            id="csvFile"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </div>
        <div>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!isValidCSV()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadTransactionsModal;
