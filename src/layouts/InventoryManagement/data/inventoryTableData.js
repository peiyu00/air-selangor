import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { format } from 'date-fns';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from "@mui/material";

export default function useInventoryTableData() {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [selectedItem, setSelectedItem] = useState({}); // State to hold selected item for view modal
  const [openViewModal, setOpenViewModal] = useState(false); // State to control visibility of view modal
  const [openEditModal, setOpenEditModal] = useState(false); // State to control visibility of view modal
  const [originalColumns, setOriginalColumns] = useState([]); // State to store original columns

  
  const columns = [
    { Header: "Region", accessor: "location", align: "left" },
    { Header: "Serial Number", accessor: "serialNumber", align: "center" },
    { Header: "Meter Type", accessor: "meterType", width: "45%", align: "left" },
    { Header: "Installation Date", accessor: "installationDate", align: "center" },
    {
      Header: "Actions",
      accessor: "id",
      align: "center",
      Cell: ({ value }) => (
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
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/meters");
        const meters = response.data;

        if (meters && meters.length > 0) {
          const rows = meters.map((meter) => ({
            meterType: meter["Meter Type"],
            location: meter.Region,
            serialNumber: meter["Serial Number"],
            installationDate: meter["Meter Installation Date"],
            id: meter._id,
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
      // If tableData.rows is empty, fetch data again
      try {
        const response = await axios.get("/meters");
        const meters = response.data;
  
        const rows = meters.map((meter) => ({
          meterType: meter["Meter Type"],
          meterSize: meter["Meter Size"],
          meterAge: meter["Meter Age"],
          meterManufacturer: meter["Meter Manufacturer"],
          meterModel: meter["Meter Model"],
          location: meter.Region,
          serialNumber: meter["Serial Number"],
          installationDate: meter["Meter Installation Date"],
          id: meter._id,
        }));
  
        setTableData({ columns: originalColumns, rows });
  
        // Find the selected item
        const selectedItem = rows.find((item) => item.id === id);
        console.log('Selected Item:', selectedItem);
        setSelectedItem(selectedItem);
        setOpenViewModal(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // If tableData.rows is already populated, directly find the selected item
      const selectedItem = tableData.rows.find((item) => item.id === id);
      console.log('Selected Item:', selectedItem);
      setSelectedItem(selectedItem);
      setOpenViewModal(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Make API call to delete item with the provided ID
      await axios.delete(`/meters/${id}`);
      
          // Refetch data after deletion
      const response = await axios.get("/meters");
      const meters = response.data;

      // Update table data with the new data after deletion
      const updatedRows = meters.map((meter) => ({
        meterType: meter["Meter Type"],
        location: meter.Region,
        serialNumber: meter["Serial Number"],
        installationDate: meter["Meter Installation Date"],
        id: meter._id,
      }));

      setTableData(prevTableData => ({ ...prevTableData, rows: updatedRows }));
  
      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item. Please try again later.");
    }
  };    
  
  const handleEdit = async (id) => {
    console.log('Selected ID:', id);
    console.log('All Rows:', tableData.rows);
  
    // Check if tableData.rows is empty
    if (tableData.rows.length === 0) {
      // If tableData.rows is empty, fetch data again
      try {
        const response = await axios.get("/meters");
        const meters = response.data;
  
        const rows = meters.map((meter) => ({
          meterType: meter["Meter Type"],
          meterSize: meter["Meter Size"],
          meterAge: meter["Meter Age"],
          meterManufacturer: meter["Meter Manufacturer"],
          meterModel: meter["Meter Model"],
          location: meter.Region,
          serialNumber: meter["Serial Number"],
          installationDate: meter["Meter Installation Date"],
          id: meter._id,
        }));
  
        setTableData({ columns, rows });
  
        // Find the selected item
        const selectedItem = rows.find((item) => item.id === id);
        console.log('Selected Item:', selectedItem);
        setSelectedItem(selectedItem);
        setOpenEditModal(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      // If tableData.rows is already populated, directly find the selected item
      const selectedItem = tableData.rows.find((item) => item.id === id);
      console.log('Selected Item:', selectedItem);
      setSelectedItem(selectedItem);
      setOpenEditModal(true);
    }
  };
  
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedItem(null);
    setTableData({ columns: originalColumns, rows: tableData.rows }); // Reset tableData with original columns
  };

  const handleCloseEditModal = async () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  
    try {
      // Fetch the latest data after edit operation
      const response = await axios.get("/meters");
      const meters = response.data;
  
      // Update table data with the new data
      const updatedRows = meters.map((meter) => ({
        meterType: meter["Meter Type"],
        location: meter.Region,
        serialNumber: meter["Serial Number"],
        installationDate: meter["Meter Installation Date"],
        id: meter._id,
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
