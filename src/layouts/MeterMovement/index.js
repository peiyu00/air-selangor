import React, { useState, useEffect } from "react";
import { Grid, Card, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import axios from 'axios';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useMeterMovementTableData from "layouts/MeterMovement/data/movementTableData";

function MeterMovementManagement() {
  const { tableData, openViewModal, selectedItem, handleCloseViewModal, openEditModal, handleCloseEditModal, setOpenEditModal, setTableData } = useMeterMovementTableData();
  console.log("tableData", tableData);
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editformData, setEditFormData] = useState({});
  const [initialSelectedItem, setInitialSelectedItem] = useState(null);

  useEffect(() => {
    setInitialSelectedItem(selectedItem);
  }, [selectedItem]);
  
  const handleToggleForm = () => {
    setOpenForm(!openForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (openEditModal) {
      // Update editformData state when editing an item
      setEditFormData((prevEditFormData) => ({
        ...prevEditFormData,
        [name]: value,
      }));
      // Update initialSelectedItem state with updated values from editformData
      setInitialSelectedItem((prevSelectedItem) => ({
        ...prevSelectedItem,
        [name]: value,
      }));
    } else {
      // Update formData state when adding a new item
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleAddItem = async () => {
    try {
      const response = await axios.post("/movements", formData);
      console.log(response.data);
      setOpenForm(false);
      alert("Item added successfully!");

      // Fetch the latest data after adding an item
      const updatedResponse = await axios.get("/movements");
      const updatedItems = updatedResponse.data;
  
      // Update table data with the new data after adding
      const updatedRows = updatedItems.map((item) => ({
        transactionFrom: item["Transaction From"],
        transactionTo: item["Transaction To"],
        itemDescription: item["Item Description"],
        quantity: item["Quantity"],
        calendarMonth: item["Calendar Month"],
        id: item._id,
      }));
  
      setTableData(prevTableData => ({ ...prevTableData, rows: updatedRows }));
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Please try again later.");
    }
  };

  const handleEditItemSubmit = async () => {
    try {
      const response = await axios.put(`/movements/${initialSelectedItem.id}`, initialSelectedItem);
      console.log(response.data);
      setOpenEditModal(false);
      alert("Item updated successfully!");
      
      // Fetch the latest data after editing an item
      const updatedResponse = await axios.get("/movements");
      const updatedItems = updatedResponse.data;
  
      // Update table data with the new data after editing
      const updatedRows = updatedItems.map((item) => ({
        transactionFrom: item["Transaction From"],
        transactionTo: item["Transaction To"],
        itemDescription: item["Item Description"],
        quantity: item["Quantity"],
        calendarMonth: item["Calendar Month"],
        id: item._id,
      }));
  
      setTableData(prevTableData => ({ ...prevTableData, rows: updatedRows }));
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item. Please try again later.");
    }
  };  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Meter Movement Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={2} px={2} textAlign="right">
                <Button variant="contained" color="primary" onClick={handleToggleForm} style={{ color: 'white', background: 'blue'}}>
                  Add New Meter Movement
                </Button>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: tableData.columns, rows: tableData.rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
              <Dialog open={openForm} onClose={handleToggleForm}>
                <DialogTitle>Add New Meter Movement</DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Transaction From" variant="outlined" name="Transaction From" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Transaction To" variant="outlined" name="Transaction To" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Item Description" variant="outlined" name="Item Description" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Quantity" variant="outlined" name="Quantity" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Calendar Month" variant="outlined" name="Calendar Month" onChange={handleInputChange} />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleToggleForm}>Cancel</Button>
                  <Button variant="contained" color="primary" onClick={handleAddItem} style={{ color: 'white', background: 'blue'}}>
                    Add Item
                  </Button>
                </DialogActions>
              </Dialog>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <Dialog open={openViewModal} onClose={handleCloseViewModal}>
        <DialogTitle>View Item Details</DialogTitle>
        <DialogContent>
        {selectedItem && (
          <>
            <Typography>Transaction From: {selectedItem.transactionFrom}</Typography>
            <Typography>Transaction To: {selectedItem.transactionTo}</Typography>
            <Typography>Item Description: {selectedItem.itemDescription}</Typography>
            <Typography>Quantity: {selectedItem.quantity}</Typography>
            <Typography>Calendar Month: {selectedItem.calendarMonth}</Typography>
          </>
        )}
      </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseViewModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Item Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Render form fields with current item details for editing */}
            {initialSelectedItem && (
              <>
                <Grid item xs={12}>
                  <TextField fullWidth label="Transaction From" variant="outlined" name="transactionFrom" value={initialSelectedItem.transactionFrom} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Transaction To" variant="outlined" name="transactionTo" value={initialSelectedItem.transactionTo} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Item Description" variant="outlined" name="itemDescription" value={initialSelectedItem.itemDescription} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Quantity" variant="outlined" name="quantity" value={initialSelectedItem.quantity} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Calendar Month" variant="outlined" name="calendarMonth" value={initialSelectedItem.calendarMonth} onChange={handleInputChange} />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditItemSubmit} style={{ color: 'white', background: 'blue'}}>
            Update Item
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default MeterMovementManagement;
