const ShiftModel = require('../models/shiftModel');

class ShiftController {
    // Get all shifts of user
    static async getAllShifts(req, res) {
        try {
            const shifts = await ShiftModel.getAllShifts(req.userId);
            res.json(shifts);
        } catch(err) {
            console.error('Error getting shifts:', err);
            res.status(500).json({ error: 'Server error' });
        }
    }

    // Get single shift
    static async getShiftById(req, res) {
        try {
            const { id } = req.params;
            const shift = await ShiftModel.getShiftById(id, req.userId);

            if (!shift) {
                return res.status(404).json({ error: 'Shift not found'});
            }
            res.json(shift);
        } catch (err) {
            console.error('Error getting shift:', err);
            res.status(500).json({ error: 'Server error'});
        }
    }

    // Create a shift entry
    static async createShift(req, res) {
        try {
            const shift = await ShiftModel.createShift(req.body, req.userId);
            res.status(201).json(shift);
        } catch (err) {
            console.error('Error creating shift:', err);
            res.status(500).json({ error: 'Server error'});
        }
    }

    // Update a shift entry
    static async updateShift(req, res) {
        try { 
            const { id } = req.params;
            const shift = await ShiftModel.updateShift(id, req.body, req.userId);

            if(!shift) {
                return res.status(404).json({ error: 'Shift not found'});
            }
            res.json(shift);
        } catch (err) {
            console.log('Error updating shift:', err);
            res.status(500).json({ error: 'Server error'});
        }
    }

    // Delete a shift entry
    static async deleteShift(req, res) {
        try {
            const { id } = req.params;
            const shift = await ShiftModel.deleteShift(id, req.userId);

            if(!shift){
                return res.status(404).json({ error: 'Shift not found'});
            }

            res.json({ message: 'Shift deleted successfully', shift});
        } catch (err) {
            console.error('Error deleting shift:', err);
            res.status(500).json({ error: 'Server error'});
        }
    }
}

module.exports = ShiftController;