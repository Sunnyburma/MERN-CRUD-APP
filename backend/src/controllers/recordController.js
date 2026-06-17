import mongoose from 'mongoose';
import Record from '../models/Record.js';

const sortableFields = new Set(['name', 'email', 'phone', 'address', 'createdAt', 'updatedAt']);

const buildRecordPayload = (body) => ({
  name: body.name,
  email: body.email,
  phone: body.phone,
  address: body.address
});

export const createRecord = async (req, res, next) => {
  try {
    const record = await Record.create(buildRecordPayload(req.body));
    res.status(201).json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req, res, next) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
    const search = req.query.search?.trim();
    const sortBy = sortableFields.has(req.query.sortBy) ? req.query.sortBy : 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { address: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const [records, total] = await Promise.all([
      Record.find(filter)
        .sort({ [sortBy]: order })
        .skip((page - 1) * limit)
        .limit(limit),
      Record.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await Record.findByIdAndUpdate(req.params.id, buildRecordPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid record ID' });
  }

  next();
};
