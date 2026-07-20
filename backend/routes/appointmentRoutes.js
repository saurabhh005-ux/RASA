const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// POST /api/appointments - Create an appointment
router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, projectType } = req.body;

    if (!name || !mobile || !email || !projectType) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newAppointment = new Appointment({
      name,
      mobile,
      email,
      projectType
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully.', appointment: newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Server error booking appointment' });
  }
});

const authMiddleware = require('../middleware/authMiddleware');

// GET /api/appointments - Fetch all appointments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Server error fetching appointments' });
  }
});

module.exports = router;
