import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{7,20}$/, 'Please provide a valid phone number']
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      minlength: [5, 'Address must be at least 5 characters'],
      maxlength: [250, 'Address cannot exceed 250 characters']
    }
  },
  {
    timestamps: true
  }
);

recordSchema.index({ name: 'text', email: 'text', phone: 'text', address: 'text' });

const Record = mongoose.model('Record', recordSchema);

export default Record;
