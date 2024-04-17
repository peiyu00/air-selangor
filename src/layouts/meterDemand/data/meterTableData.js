import React, { useState, useEffect } from "react";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography } from "@mui/material";

export default function useMeterDemandTableData() {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [selectedItem, setSelectedItem] = useState({}); // State to hold selected item for view modal
  const [openViewModal, setOpenViewModal] = useState(false); // State to control visibility of view modal
  const [openEditModal, setOpenEditModal] = useState(false); // State to control visibility of view modal
  const [originalColumns, setOriginalColumns] = useState([]); // State to store original columns
  const [forecastedNextMonth, setForecastedNextMonth] = useState({ date: "Next Month (Forecast)", faultyProgram: 0, meterComplaint: 0, meterLeak: 0 });
  const [forecastedNextYear, setForecastedNextYear] = useState({ date: "Next Year (Forecast)", faultyProgram: 0, meterComplaint: 0, meterLeak: 0 });

  const columns = [
    { Header: "Date", accessor: "date", align: "left" },
    { Header: "Faulty Program", accessor: "faultyProgram", align: "center" },
    { Header: "Meter Complaint", accessor: "meterComplaint", align: "center" },
    { Header: "Meter Leak", accessor: "meterLeak", align: "center" },
    {
      Header: "Actions",
      accessor: "id",
      align: "center",
      Cell: ({ value, row }) => {
        // Check if the row is a forecast row
        if (row.original && (row.original.date === "Next Month (Forecast)" || row.original.date === "Next Year (Forecast)")) {
          return null; // Don't render buttons for the forecast row
        }
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
        const response = await axios.get("/demands");
        const demandData = response.data;

        if (demandData && demandData.length > 0) {
          const rows = demandData.map((demand) => ({
            date: demand["Date"],
            faultyProgram: demand["Faulty Program"],
            meterComplaint: demand["Meter Complaint"],
            meterLeak: demand["Meter Leak"],
            id: demand._id,
          }));

          setTableData({ columns, rows });
          setOriginalColumns(columns); // Store the original columns

          // Calculate the average values for forecasting
          const averageValues = calculateAverageValues(rows);
          console.log('Average Values:', averageValues);

          // Forecast for the next month
          const forecastedNextMonthData = forecastNextMonthData(averageValues);
          setForecastedNextMonth({ ...forecastedNextMonth, ...forecastedNextMonthData });

          // Forecast for the next year
          const forecastedNextYearData = forecastNextYearData(averageValues);
          setForecastedNextYear({ ...forecastedNextYear, ...forecastedNextYearData });
          updateForecastedValues(rows);
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

  useEffect(() => {
    updateForecastedValues(tableData.rows);
  }, [tableData]);
  
  // Function to calculate average values
  const calculateAverageValues = (rows) => {
    const totalRows = rows.length;
    const totalFaultyPrograms = rows.reduce((acc, row) => acc + row.faultyProgram, 0);
    const totalMeterComplaints = rows.reduce((acc, row) => acc + row.meterComplaint, 0);
    const totalMeterLeaks = rows.reduce((acc, row) => acc + row.meterLeak, 0);

    return {
      averageFaultyProgram: totalFaultyPrograms / totalRows,
      averageMeterComplaint: totalMeterComplaints / totalRows,
      averageMeterLeak: totalMeterLeaks / totalRows,
    };
  };

  // Function to forecast data for the next month
  const forecastNextMonthData = (averageValues) => {
    const { averageFaultyProgram, averageMeterComplaint, averageMeterLeak } = averageValues;

    // Forecast for next month by multiplying average values with 1 (number of months)
    return {
      faultyProgram: Math.round(averageFaultyProgram * 1),
      meterComplaint: Math.round(averageMeterComplaint * 1),
      meterLeak: Math.round(averageMeterLeak * 1),
    };
  };

  // Function to forecast data for the next year
  const forecastNextYearData = (averageValues) => {
    const { averageFaultyProgram, averageMeterComplaint, averageMeterLeak } = averageValues;

    // Forecast for next year by multiplying average values with 12 (number of months in a year)
    return {
      faultyProgram: Math.round(averageFaultyProgram * 12),
      meterComplaint: Math.round(averageMeterComplaint * 12),
      meterLeak: Math.round(averageMeterLeak * 12),
    };
  };

  const updateForecastedValues = (rows) => {
    const averageValues = calculateAverageValues(rows);
    const forecastedNextMonthData = forecastNextMonthData(averageValues);
    setForecastedNextMonth({ ...forecastedNextMonth, ...forecastedNextMonthData });
    const forecastedNextYearData = forecastNextYearData(averageValues);
    setForecastedNextYear({ ...forecastedNextYear, ...forecastedNextYearData });
  };
  
  const handleView = async (id) => {
    console.log('Selected ID:', id);
    console.log('All Rows:', tableData.rows);
  
    // Check if tableData.rows is empty
    if (tableData.rows.length === 0) {
      // If tableData.rows is empty, fetch data again
      try {
        const response = await axios.get("/demands");
        const demands = response.data;
  
        const rows = demands.map((demand) => ({
          date: demand.Date,
          faultyProgram: demand["Faulty Program"],
          meterComplaint: demand["Meter Complaint"],
          meterLeak: demand["Meter Leak"],
          id: demand._id,
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
  }  

  const handleDelete = async (id) => {
    try {
      // Make API call to delete item with the provided ID
      await axios.delete(`/demands/${id}`);
      
      // Refetch data after deletion
      const response = await axios.get("/demands");
      const demands = response.data;
  
      // Update table data with the new data after deletion
      const updatedRows = demands.map((demand) => ({
        date: demand.Date,
        faultyProgram: demand["Faulty Program"],
        meterComplaint: demand["Meter Complaint"],
        meterLeak: demand["Meter Leak"],
        id: demand._id,
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
      // If tableData.rows is empty, fetch data again
      try {
        const response = await axios.get("/demands");
        const demands = response.data;
  
        const rows = demands.map((demand) => ({
          date: demand.Date,
          faultyProgram: demand["Faulty Program"],
          meterComplaint: demand["Meter Complaint"],
          meterLeak: demand["Meter Leak"],
          id: demand._id,
        }));
  
        setTableData({ columns, rows });
  
        // Find the selected item
        const selectedItem = rows.find((item) => item.id === id);
        console.log('Selected Item:', selectedItem);
        console.log('All Rows:', tableData.rows);
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
    setTableData({ columns: originalColumns, rows: tableData.rows });
  };

  const handleCloseEditModal = async () => {
    setOpenEditModal(false);
    setSelectedItem(null);
  
    try {
      // Fetch the latest data after edit operation
      const response = await axios.get("/demands");
      const demands = response.data;
  
      // Update table data with the new data
      const updatedRows = demands.map((demand) => ({
        date: demand.Date,
        faultyProgram: demand["Faulty Program"],
        meterComplaint: demand["Meter Complaint"],
        meterLeak: demand["Meter Leak"],
        id: demand._id,
      }));
  
      setTableData({ columns: originalColumns, rows: updatedRows });
      console.log("tableData", tableData);
    } catch (error) {
      console.error("Error fetching updated data:", error);
      // Handle error if necessary
    }
  };  

  return { tableData:{ columns, rows: [...tableData.rows, forecastedNextMonth, forecastedNextYear] }, openViewModal, selectedItem, handleCloseViewModal, openEditModal, handleCloseEditModal, setOpenEditModal, setTableData };
}
