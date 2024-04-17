import React, { useState, useEffect } from "react";
import { Grid, Card, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import axios from 'axios';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useInventoryTableData from "layouts/InventoryManagement/data/inventoryTableData";

function InventoryManagement() {
  const { tableData, openViewModal, selectedItem, handleCloseViewModal, openEditModal, handleCloseEditModal, setOpenEditModal, setTableData } = useInventoryTableData();
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
      const response = await axios.post("/meters", formData);
      console.log(response.data);
      setOpenForm(false);
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Please try again later.");
    }
  };

  const handleEditItemSubmit = async () => {
    try {
      const response = await axios.put(`/demands/${initialSelectedItem.id}`, initialSelectedItem);
      console.log(response.data);
      setOpenEditModal(false);
      alert("Item updated successfully!");
      
      // Fetch the latest data after editing an item
      const updatedResponse = await axios.get("/demands");
      const updatedItems = updatedResponse.data;
  
      // Update table data with the new data after editing
      const updatedRows = updatedItems.map((item) => ({
        date: item["Date"],
        faultyProgram: item["Faulty Program"],
        meterComplaint: item["Meter Complaint"],
        meterLeak: item["Meter Leak"],
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
                  Inventory Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={2} px={2} textAlign="right">
                <Button variant="contained" color="primary" onClick={handleToggleForm} style={{ color: 'white', background: 'blue'}}>
                  Add New Inventory Item
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
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Region" variant="outlined" name="Region" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Serial Number" variant="outlined" name="Serial Number" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meter Size" variant="outlined" name="Meter Size" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meter Type" variant="outlined" name="Meter Type" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meter Manufacture" variant="outlined" name="Meter Manufacture" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meter Model" variant="outlined" name="Meter Model" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Installation Date" type="date" variant="outlined" name="Meter Installation Date" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meter Age" variant="outlined" name="Meter Age" onChange={handleInputChange} />
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
            <Typography>Region: {selectedItem.location}</Typography>
            <Typography>Serial Number: {selectedItem.serialNumber}</Typography>
            <Typography>Meter Size: {selectedItem.meterSize}</Typography>
            <Typography>Meter Type: {selectedItem.meterType}</Typography>
            <Typography>Meter Manufacturer: {selectedItem.meterManufacturer}</Typography>
            <Typography>Meter Model: {selectedItem.meterModel}</Typography>
            <Typography>Meter Installation Date: {selectedItem.installationDate}</Typography>
            <Typography>Meter Age: {selectedItem.meterAge}</Typography>
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
                  <TextField fullWidth label="Region" variant="outlined" name="location" value={initialSelectedItem.location} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Serial Number" variant="outlined" name="serialNumber" value={initialSelectedItem.serialNumber} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Meter Size" variant="outlined" name="meterSize" value={initialSelectedItem.meterSize} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Meter Type" variant="outlined" name="meterType" value={initialSelectedItem.meterType} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Meter Manufacturer" variant="outlined" name="meterManufacturer" value={initialSelectedItem.meterManufacturer} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Meter Model" variant="outlined" name="meterModel" value={initialSelectedItem.meterModel} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Installation Date" variant="outlined" name="installationDate" value={initialSelectedItem.installationDate} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Meter Age" variant="outlined" name="meterAge" value={initialSelectedItem.meterAge} onChange={handleInputChange} />
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

export default InventoryManagement;
