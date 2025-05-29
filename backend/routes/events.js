// backend/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Added for file system operations (e.g., deleting old images)

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the 'uploads/' directory exists
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir); // Images will be stored in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename using timestamp
  },
});

// Filter to accept only image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

// @route   GET api/events
// @desc    Get all events for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Fetching events using the new schema fields
        const events = await Event.find({ user: req.userId }).sort({ eventDate: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events
// @desc    Create a new event
// @access  Private
router.post('/', auth, upload.single('eventImage'), async (req, res) => {
    const { eventName, description, eventDate, eventTime, eventLocation, eventStatus, eventCost } = req.body;
    
    // Combine eventDate and eventTime to create a single Date object for startTime
    let combinedDateTime;
    try {
        const datePart = new Date(eventDate).toISOString().split('T')[0];
        const timePart = eventTime || '00:00';
        // Use an appropriate timezone or store as UTC if necessary
        combinedDateTime = new Date(`${datePart}T${timePart}:00.000Z`); // Assuming UTC
    } catch (dateError) {
        return res.status(400).json({ msg: 'Invalid eventDate or eventTime format.' });
    }

    const eventImage = req.file ? `/uploads/${req.file.filename}` : ''; // Store relative path

    try {
        const newEvent = new Event({
            eventName,
            description,
            eventDate: combinedDateTime, // Store as eventDate in DB
            eventTime,
            eventLocation,
            eventStatus,
            eventCost,
            eventImage,
            user: req.userId,
        });

        const event = await newEvent.save();
        res.status(201).json(event);
    } catch (err) {
        console.error(err.message);
        // If an error occurs after file upload, clean up the uploaded file
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete uploaded file after DB error:', unlinkErr);
            });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private
router.put('/:id', auth, upload.single('eventImage'), async (req, res) => {
    const { eventName, description, eventDate, eventTime, eventLocation, eventStatus, eventCost } = req.body;

    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Ensure user owns the event
        if (event.user.toString() !== req.userId) {
            // If unauthorized, delete any newly uploaded file
            if (req.file) {
                fs.unlink(req.file.path, (unlinkErr) => {
                    if (unlinkErr) console.error('Failed to delete unauthorized uploaded file:', unlinkErr);
                });
            }
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Prepare update object
        const updatedFields = {};
        if (eventName) updatedFields.eventName = eventName;
        if (description !== undefined) updatedFields.description = description; // Allow clearing description
        if (eventLocation) updatedFields.eventLocation = eventLocation;
        if (eventStatus) updatedFields.eventStatus = eventStatus;
        if (eventCost !== undefined) updatedFields.eventCost = eventCost; // Allow clearing cost

        // Handle date and time
        if (eventDate) {
            let combinedDateTime;
            try {
                const datePart = new Date(eventDate).toISOString().split('T')[0];
                const timePart = eventTime || event.eventTime || '00:00'; // Use existing time if not provided
                combinedDateTime = new Date(`${datePart}T${timePart}:00.000Z`);
                updatedFields.eventDate = combinedDateTime;
            } catch (dateError) {
                // If invalid date, delete new file and return error
                if (req.file) {
                    fs.unlink(req.file.path, (unlinkErr) => {
                        if (unlinkErr) console.error('Failed to delete uploaded file due to invalid date:', unlinkErr);
                    });
                }
                return res.status(400).json({ msg: 'Invalid eventDate or eventTime format.' });
            }
        }
        if (eventTime) updatedFields.eventTime = eventTime;

        // Handle image update
        if (req.file) {
            // New image uploaded, delete old one if it exists
            if (event.eventImage && event.eventImage.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', event.eventImage);
                fs.unlink(oldImagePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Failed to delete old event image:', unlinkErr);
                });
            }
            updatedFields.eventImage = `/uploads/${req.file.filename}`;
        } else if (req.body.eventImage === '') { // Explicitly set to empty string from frontend to remove image
            if (event.eventImage && event.eventImage.startsWith('/uploads/')) {
                const oldImagePath = path.join(__dirname, '..', event.eventImage);
                fs.unlink(oldImagePath, (unlinkErr) => {
                    if (unlinkErr) console.error('Failed to delete event image during clear:', unlinkErr);
                });
            }
            updatedFields.eventImage = '';
        }

        // Update the event
        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        // If an error occurs, and a new file was uploaded, clean up the file
        if (req.file) {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Failed to delete uploaded file after DB error during update:', unlinkErr);
            });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Ensure user owns the event
        if (event.user.toString() !== req.userId) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete the associated image file if it exists
        if (event.eventImage && event.eventImage.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', event.eventImage);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Failed to delete event image:', err);
            });
        }

        await event.deleteOne();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;