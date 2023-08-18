const connection = require('../../config/db');
const jwt = require("jsonwebtoken");
const { validationResult } = require(`express-validator`);
const User=require('../../models/user')


exports.checkJournalByTeacher = async (req, res, next) => {
    try {
        const journalId = req.params.journalId;

        connection.query('SELECT * FROM Journals WHERE id = ?', [journalId], (error, results) => {
            if (error) throw error;
            if (results.length === 0) {
                return res.status(400).json({ error: `No Journal found by ID` });
            }
            if (req.user.id !== results[0].teacher_id) {
                return res.status(404).json({
                    error: "Access Denied | This is not your journal entry",
                });
            }
            req.journal = results[0];
            next();
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.getJournal = async (req, res) => {
    try {
        return res.status(200).json({ journal: req.journal });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.createJournal = async (req, res) => {
    try {
        const { description } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const fileId = `file${Date.now()}`; // example file ID generation
        const newJournal = {
            teacher_id: req.user.id,
            description: description,
            fileId: fileId,
            createdAt: new Date()
        };

        connection.query('INSERT INTO Journals SET ?', newJournal, (error, results) => {
            if (error) throw error;
            return res.status(201).json({ status: 'OK', journal: newJournal });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.updateJournal = async (req, res) => {
    try {
        const { description } = req.body;
        const journalId = req.params.journalId;

        connection.query('UPDATE Journals SET description = ? WHERE id = ?', [description, journalId], (error, results) => {
            if (error) throw error;
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `No Journal found by ID` });
            }
            return res.status(200).json({ status: 'OK' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.deleteJournal = async (req, res) => {
    try {
        const journalId = req.params.journalId;

        connection.query('DELETE FROM Journals WHERE id = ?', [journalId], (error, results) => {
            if (error) throw error;
            return res.status(200).json({ status: 'OK' });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

exports.getJournalFeed = async (req, res) => {
    try {
        connection.query('SELECT * FROM Journals WHERE teacher_id = ?', [req.user.id], (error, journals) => {
            if (error) throw error;
            return res.status(200).json({ status: 'OK', journals: journals });
        });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};
