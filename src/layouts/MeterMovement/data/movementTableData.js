import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from "@mui/material";

export default function useMeterMovementTableData() {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [selectedItem, setSelectedItem] = useState({}); // State to hold selected item for view modal
  const [openViewModal, setOpenViewModal] = useState(false); // State to control visibility of view modal
  const [openEditModal, setOpenEditModal] = useState(false); // State to control visibility of view modal
  const [originalColumns, setOriginalColumns] = useState([]); // State to store original columns

  const columns = [
    { Header: "Transaction From", accessor: "transactionFrom", align: "left" },
    { Header: "Transaction To", accessor: "transactionTo", align: "center" },
    { Header: "Item Description", accessor: "itemDescription", align: "center" },
    { Header: "Quantity", accessor: "quantity", align: "center" },
    { Header: "Calendar Month", accessor: "calendarMonth", align: "center" },
    {
      Header: "Actions",
      accessor: "id",
      align: "center",
      Cell: ({ value, row }) => {
        return (
          <>
            <IconButton color="secondary" size="small" onClick={() => handleView(value)}>
              <VisibilityIcon />
            </IconButton>
            <IconButton color="info" size="small" onClick={() => handleEdit(value)}>
              <EditIcon />
            </IconButton>
            <IconButton color="primary" size="small" onClick={() => handleDelete(value)}>
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/movements"); // Change API endpoint to /movements
        const movementData = response.data;

        if (movementData && movementData.length > 0) {
          const rows = movementData.map((movement) => ({
            transactionFrom: movement["Transaction From"],
            transactionTo: movement["Transaction To"],
            itemDescription: movement["Item Description"],
            quantity: movement["Quantity"],
            calendarMonth: movement["Calendar Month"],
            id: movement._id,
          }));

          setTableData({ columns, rows });
          setOriginalColumns(columns); // Store the original columns
        } else {
          setTableData({ columns: [], rows: [] });
          setOriginalColumns([]); // Reset original columns if no data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleView = async (id) => {
    console.log('Selected ID:', id);
    console.log('All Rows:', tableData.rows);
  
    // Check if tableData.rows is empty
    if (tableData.rows.length === 0) {
        try {
          const response = await axios.get("/movements");
          const movements = response.data;
  
          const rows = movements.map((movement) => ({
            transactionFrom: movement["Transaction From"],
            transactionTo: movement["Transaction To"],
            itemDescription: movement["Item Description"],
            quantity: movement["Quantity"],
            calendarMonth: movement["Calendar Month"],
            id: movement._id,
          }));
  
          setTableData({ columns: originalColumns, rows });
  
          // Find the selected item (movement)
          const selectedMovement = rows.find((item) => item.id === id);
          console.log('Selected Item (Movement):', selectedMovement);
          setSelectedItem(selectedMovement);
          setOpenViewModal(true);
        } catch (error) {
          console.error("Error fetching movement data:", error);
        }
      }
    };

  const handleDelete = async (id) => {
    try {
      // Make API call to delete item with the provided ID
      await axios.delete(`/movements/${id}`);
      
      // Refetch data after deletion
      const response = await axios.get("/movements");
      const movements = response.data;
  
      // Update table data with the new data after deletion
      const updatedRows = movements.map((movement) => ({
        transactionFrom: movement["Transaction From"],
        transactionTo: movement["Transaction To"],
        itemDescription: movement["Item Description"],
        quantity: movement["Quantity"],
        calendarMonth: movement["Calendar Month"],
        id: movement._id,
      }));
  
      setTableData(prevTableData => ({ ...prevTableData, rows: updatedRows }));
  
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item. Please try again later.");
    }
  };  

  const handleEdit = async (id) => {
    // Check if tableData.rows is empty
    if (tableData.rows.length === 0) {
      // If tableData.rows is empty, fetch movement data
      try {
        const response = await axios.get("/movements");
        const movements = response.data;
  
        const rows = movements.map((movement) => ({
          transactionFrom: movement["Transaction From"],
          transactionTo: movement["Transaction To"],
          itemDescription: movement["Item Description"],
          quantity: movement["Quantity"],
          calendarMonth: movement["Calendar Month"],
          id: movement._id,
        }));
  
        setTableData({ columns, rows });
  
        // Find the selected item
        const selectedItem = rows.find((item) => item.id === id);
        console.log('Selected Item (Movement):', selectedItem);
        setSelectedItem(selectedItem);
        setOpenEditModal(true);
      } catch (error) {
        console.error("Error fetching movement data:", error);
      }
    } else {
      // If tableData.rows is already populated, check if the selected ID corresponds to a movement
      const selectedMovement = tableData.rows.find((item) => item.id === id);
      if (selectedMovement) {
        console.log('Selected Item (Movement):', selectedMovement);
        setSelectedItem(selectedMovement);
        setOpenEditModal(true);
      } else {
        console.log("Selected ID does not correspond to a movement.");
      }
    }
  };    

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedItem(null);
    setTableData({ columns: originalColumns, rows: tableData.rows });
  };

  const handleCloseEditModal = async () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  
    try {
      // Fetch the latest data after edit operation
      const response = await axios.get("/movements");
      const movements = response.data;
  
      // Update table data with the new data
      const updatedRows = movements.map((movement) => ({
        transactionFrom: movement["Transaction From"],
        transactionTo: movement["Transaction To"],
        itemDescription: movement["Item Description"],
        quantity: movement["Quantity"],
        calendarMonth: movement["Calendar Month"],
        id: movement._id,
      }));
  
      setTableData({ columns: originalColumns, rows: updatedRows });
      console.log("tableData", tableData);
    } catch (error) {
      console.error("Error fetching updated data:", error);
      // Handle error if necessary
    }
  };  

  return { tableData, openViewModal, selectedItem, handleCloseViewModal, openEditModal, handleCloseEditModal, setOpenEditModal, setTableData };
}
