const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/db_selangor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const Meter = mongoose.model('Meter', {
  Region: String,
  'Serial Number': String,
  'Meter Size': Number,
  'Meter Type': String,
  'Meter Manufacture': String,
  'Meter Model': String,
  'Meter Installation Date': String,
  'Meter Age': Number
});

const LabTestResult = mongoose.model('lab', {
  "Serial Number": String,
  Region: String,
  "Tested Date": String,
  Result: String
});

const Inventory = mongoose.model('Inventory', {
  "Meter Size": String,
  "Minimum Buffer Stock": Number
});

const Demand = mongoose.model('Demand', {
  Date: String,
  'Faulty Program': Number,
  'Meter Complaint': Number,
  'Meter Leak': Number
});

const Warranty = mongoose.model('MeterWarranty', {
  "Serial Number": String,
  "Meter Size": Number,
  "Manufactured Year": Number,
  "Received Date": String,
  "Physical Checked Date": String,
  "Defect": String,
  "Status": String
});

const Movement = mongoose.model('Movement', {
  "Transaction From": String,
  "Transaction To": String,
  "Item Description": String,
  "Quantity": Number,
  "Calendar Month": String
});

app.get('/meters', async (req, res) => {
  try {
    const meters = await Meter.find();
    res.json(meters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/meters', async (req, res) => {
  try {
    const { Region, 'Serial Number': SerialNumber, 'Meter Size': MeterSize, 'Meter Type': MeterType, 'Meter Manufacturer': MeterManufacturer, 'Meter Model': MeterModel, 'Meter Installation Date': MeterInstallationDate, 'Meter Age': MeterAge } = req.body;
    const meter = new Meter({ Region, 'Serial Number': SerialNumber, 'Meter Size': MeterSize, 'Meter Type': MeterType, 'Meter Manufacturer': MeterManufacturer, 'Meter Model': MeterModel, 'Meter Installation Date': MeterInstallationDate, 'Meter Age': MeterAge });
    await meter.save();
    res.status(201).json({ message: 'Meter created successfully', meter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/meters/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMeter = await Meter.findByIdAndDelete(id);
    if (!deletedMeter) {
      return res.status(404).json({ error: 'Meter not found' });
    }
    res.json({ message: 'Meter deleted successfully', deletedMeter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a route to handle PUT requests for updating a meter
app.put('/meters/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { location: Region, 'Serial Number': SerialNumber, 'Meter Size': MeterSize, 'Meter Type': MeterType, 'Meter Manufacturer': MeterManufacturer, 'Meter Model': MeterModel, 'Meter Installation Date': MeterInstallationDate, 'Meter Age': MeterAge } = req.body;
    const updatedMeter = await Meter.findByIdAndUpdate(id, { Region, 'Serial Number': SerialNumber, 'Meter Size': MeterSize, 'Meter Type': MeterType, 'Meter Manufacturer': MeterManufacturer, 'Meter Model': MeterModel, 'Meter Installation Date': MeterInstallationDate, 'Meter Age': MeterAge }, { new: true });

    if (!updatedMeter) {
      return res.status(404).json({ error: 'Meter not found' });
    }

    res.json({ message: 'Meter updated successfully', updatedMeter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/lab', async (req, res) => {
  try {
    const labTestResults = await LabTestResult.find();
    res.json(labTestResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/lab', async (req, res) => {
  try {
    const { "Serial Number": SerialNumber, Region, "Tested Date": TestedDate, Result } = req.body;
    const labTestResult = new LabTestResult({ "Serial Number": SerialNumber, Region, "Tested Date": TestedDate, Result });
    await labTestResult.save();
    res.status(201).json({ message: 'Lab test result created successfully', labTestResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/lab/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLabTestResult = await LabTestResult.findByIdAndDelete(id);
    if (!deletedLabTestResult) {
      return res.status(404).json({ error: 'Lab test result not found' });
    }
    res.json({ message: 'Lab test result deleted successfully', deletedLabTestResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a route to handle PUT requests for updating a lab test result
app.put('/lab/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { "Serial Number": SerialNumber, region: Region, "Tested Date": TestedDate, Result } = req.body;
    const updatedLabTestResult = await LabTestResult.findByIdAndUpdate(id, { "Serial Number": SerialNumber, Region, "Tested Date": TestedDate, Result }, { new: true });

    if (!updatedLabTestResult) {
      return res.status(404).json({ error: 'Lab test result not found' });
    }

    res.json({ message: 'Lab test result updated successfully', updatedLabTestResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/inventory', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/inventory', async (req, res) => {
  try {
    const { "Meter Size": MeterSize, "Minimum Buffer Stock": MinimumBufferStock } = req.body;
    const inventoryItem = new Inventory({ "Meter Size": MeterSize, "Minimum Buffer Stock": MinimumBufferStock });
    await inventoryItem.save();
    res.status(201).json({ message: 'Inventory level created successfully', inventoryItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/inventory/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedInventoryItem = await Inventory.findByIdAndDelete(id);
    if (!deletedInventoryItem) {
      return res.status(404).json({ error: 'Inventory level not found' });
    }
    res.json({ message: 'Inventory level deleted successfully', deletedInventoryItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a route to handle PUT requests for updating an inventory item
app.put('/inventory/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { meterSize: MeterSize, minimumBufferStock: MinimumBufferStock } = req.body;
    const updatedInventoryItem = await Inventory.findByIdAndUpdate(id, { "Meter Size": MeterSize, "Minimum Buffer Stock": MinimumBufferStock }, { new: true });

    if (!updatedInventoryItem) {
      return res.status(404).json({ error: 'Inventory level not found' });
    }

    res.json({ message: 'Inventory level updated successfully', updatedInventoryItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/demands', async (req, res) => {
  try {
    const demands = await Demand.find();
    res.json(demands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/demands', async (req, res) => {
  try {
    const { Date, 'Faulty Program': FaultyProgram, 'Meter Complaint': MeterComplaint, 'Meter Leak': MeterLeak } = req.body;
    const demand = new Demand({ Date, 'Faulty Program': FaultyProgram, 'Meter Complaint': MeterComplaint, 'Meter Leak': MeterLeak });
    await demand.save();
    res.status(201).json({ message: 'Demand created successfully', demand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/demands/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDemand = await Demand.findByIdAndDelete(id);
    if (!deletedDemand) {
      return res.status(404).json({ error: 'Demand not found' });
    }
    res.json({ message: 'Demand deleted successfully', deletedDemand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/demands/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { date, faultyProgram, meterComplaint, meterLeak } = req.body;
    const updatedDemand = await Demand.findByIdAndUpdate(id, { Date: date, 'Faulty Program': faultyProgram, 'Meter Complaint': meterComplaint, 'Meter Leak': meterLeak }, { new: true });

    if (!updatedDemand) {
      return res.status(404).json({ error: 'Demand not found' });
    }

    res.json({ message: 'Demand updated successfully', updatedDemand });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/warranties', async (req, res) => {
  try {
    const warranties = await Warranty.find();
    res.json(warranties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/warranties', async (req, res) => {
  try {
    const { "Serial Number": SerialNumber, "Meter Size": MeterSize, "Manufactured Year": ManufacturedYear, "Received Date": ReceivedDate, "Physical Checked Date": PhysicalCheckedDate, Defect, Status } = req.body;
    const warranty = new Warranty({ "Serial Number": SerialNumber, "Meter Size": MeterSize, "Manufactured Year": ManufacturedYear, "Received Date": ReceivedDate, "Physical Checked Date": PhysicalCheckedDate, Defect, Status });
    await warranty.save();
    res.status(201).json({ message: 'Meter warranty created successfully', warranty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/warranties/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedWarranty = await Warranty.findByIdAndDelete(id);
    if (!deletedWarranty) {
      return res.status(404).json({ error: 'Meter warranty not found' });
    }
    res.json({ message: 'Meter warranty deleted successfully', deletedWarranty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/warranties/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { serialNumber: SerialNumber, meterSize: MeterSize, manufacturedYear: ManufacturedYear, receivedDate: ReceivedDate, physicalCheckedDate: PhysicalCheckedDate, defect: Defect, status: Status } = req.body;
    const updatedWarranty = await Warranty.findByIdAndUpdate(id, { "Serial Number": SerialNumber, "Meter Size": MeterSize, "Manufactured Year": ManufacturedYear, "Received Date": ReceivedDate, "Physical Checked Date": PhysicalCheckedDate, Defect, Status }, { new: true });

    if (!updatedWarranty) {
      return res.status(404).json({ error: 'Meter warranty not found' });
    }

    res.json({ message: 'Meter warranty updated successfully', updatedWarranty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all movements
app.get('/movements', async (req, res) => {
  try {
    const movements = await Movement.find();
    res.json(movements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new movement
app.post('/movements', async (req, res) => {
  try {
    const { "Transaction From": transactionFrom, "Transaction To": transactionTo, "Item Description": itemDescription, "Quantity": quantity, "Calendar Month": calendarMonth } = req.body;
    const movement = new Movement({ "Transaction From": transactionFrom, "Transaction To": transactionTo, "Item Description": itemDescription, "Quantity": quantity, "Calendar Month": calendarMonth });
    await movement.save();
    res.status(201).json({ message: 'Movement created successfully', movement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE a movement
app.delete('/movements/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMovement = await Movement.findByIdAndDelete(id);
    if (!deletedMovement) {
      return res.status(404).json({ error: 'Movement not found' });
    }
    res.json({ message: 'Movement deleted successfully', deletedMovement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT route to update a movement
app.put('/movements/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { transactionFrom, transactionTo, itemDescription, quantity, calendarMonth } = req.body;
    const updatedMovement = await Movement.findByIdAndUpdate(id, { "Transaction From": transactionFrom, "Transaction To": transactionTo, "Item Description": itemDescription, "Quantity": quantity, "Calendar Month": calendarMonth }, { new: true });

    if (!updatedMovement) {
      return res.status(404).json({ error: 'Movement not found' });
    }

    res.json({ message: 'Movement updated successfully', updatedMovement });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});