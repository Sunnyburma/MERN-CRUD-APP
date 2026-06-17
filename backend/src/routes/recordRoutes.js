import express from 'express';
import {
  createRecord,
  deleteRecord,
  getRecordById,
  getRecords,
  updateRecord,
  validateObjectId
} from '../controllers/recordController.js';
import { validateRecordInput } from '../middleware/validateRecord.js';

const router = express.Router();

router.route('/').get(getRecords).post(validateRecordInput, createRecord);
router
  .route('/:id')
  .all(validateObjectId)
  .get(getRecordById)
  .put(validateRecordInput, updateRecord)
  .delete(deleteRecord);

export default router;
