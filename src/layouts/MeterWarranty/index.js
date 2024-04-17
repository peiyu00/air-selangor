import React, { useState, useEffect } from "react";
import { Grid, Card, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import axios from 'axios';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useMeterWarrantyTableData from "layouts/MeterWarranty/data/meterWarrantyTableData";

function MeterWarrantyManagement() {
  const { tableData, openViewModal, selectedItem, handleCloseViewModal, openEditModal, handleCloseEditModal, setOpenEditModal, setTableData } = useMeterWarrantyTableData();
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
      const response = await axios.post("/warranties", formData);
      console.log(response.data);
      setOpenForm(false);
      alert("Item added successfully!");
      
      // Fetch the latest data after editing an item
      const updatedResponse = await axios.get("/warranties");
      const updatedItems = updatedResponse.data;
  
      // Update table data with the new data after editing
      const updatedRows = updatedItems.map((warranty) => ({
        serialNumber: warranty["Serial Number"],
        meterSize: warranty["Meter Size"],
        manufacturedYear: warranty["Manufactured Year"],
        receivedDate: warranty["Received Date"],
        physicalCheckedDate: warranty["Physical Checked Date"],
        defect: warranty["Defect"],
        status: warranty["Status"],
        id: warranty._id,
      }));
  
      setTableData(prevTableData => ({ ...prevTableData, rows: updatedRows }));
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Please try again later.");
    }
  };

  const handleEditItemSubmit = async () => {
    try {
      const response = await axios.put(`/warranties/${initialSelectedItem.id}`, initialSelectedItem);
      console.log(response.data);
      setOpenEditModal(false);
      alert("Item updated successfully!");

      // Fetch the latest data after editing an item
            // Fetch the latest data after editing an item
      const updatedResponse = await axios.get("/warranties");
      const updatedItems = updatedResponse.data;
  
      // Update table data with the new data after editing
      const updatedRows = updatedItems.map((warranty) => ({
        serialNumber: warranty["Serial Number"],
        meterSize: warranty["Meter Size"],
        manufacturedYear: warranty["Manufactured Year"],
        receivedDate: warranty["Received Date"],
        physicalCheckedDate: warranty["Physical Checked Date"],
        defect: warranty["Defect"],
        status: warranty["Status"],
        id: warranty._id,
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
                  Meter Warranty Management
                </MDTypography>
              </MDBox>
              <MDBox pt={3} pb={2} px={2} textAlign="right">
                <Button variant="contained" color="primary" onClick={handleToggleForm} style={{ color: 'white', background: 'blue'}}>
                  Add New Meter Warranty
                </Button>
              </MDBox>
              <MDBox pt={3}>
              <DataTable
                table={{
                  columns: tableData.columns,
                  rows: tableData.rows.map(row => ({
                    ...row,
                    status: (
                      <Typography style={{ color: row.status === 'CAN CLAIM' ? 'green' : 'red' }}>
                        {row.status}
                      </Typography>
                    )
                  }))
                }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
              </MDBox>
              <Dialog open={openForm} onClose={handleToggleForm}>
                <DialogTitle>Add New Meter Warranty</DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Serial Number" variant="outlined" name="Serial Number" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Meter Size" variant="outlined" name="Meter Size" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Manufactured Year" variant="outlined" name="Manufactured Year" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Received Date" type='date' variant="outlined" name="Received Date" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Physical Checked Date" type='date' variant="outlined" name="Physical Checked Date" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Defect" variant="outlined" name="Defect" onChange={handleInputChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Status" variant="outlined" name="Status" onChange={handleInputChange} />
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
              <Typography>Serial Number: {selectedItem.serialNumber}</Typography>
              <Typography>Meter Size: {selectedItem.meterSize}</Typography>
              <Typography>Manufactured Year: {selectedItem.manufacturedYear}</Typography>
              <Typography>Received Date: {selectedItem.receivedDate}</Typography>
              <Typography>Physical Checked Date: {selectedItem.physicalCheckedDate}</Typography>
              <Typography>Defect: {selectedItem.defect}</Typography>
              <Typography>Status: {selectedItem.status}</Typography>
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
                  <TextField fullWidth label="Serial Number" variant="outlined" name="serialNumber" value={initialSelectedItem.serialNumber} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Meter Size" variant="outlined" name="meterSize" value={initialSelectedItem.meterSize} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Manufactured Year" variant="outlined" name="manufacturedYear" value={initialSelectedItem.manufacturedYear} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Received Date" variant="outlined" name="receivedDate" value={initialSelectedItem.receivedDate} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Physical Checked Date" variant="outlined" name="physicalCheckedDate" value={initialSelectedItem.physicalCheckedDate} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Defect" variant="outlined" name="defect" value={initialSelectedItem.defect} onChange={handleInputChange} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Status" variant="outlined" name="status" value={initialSelectedItem.status} onChange={handleInputChange} />
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

export default MeterWarrantyManagement;
