import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Advocate' | 'Client';
  barcode?: string;
  isVerified?: boolean;
  specialization?: string;
  location?: string;
  experience?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Advocate', 'Client'], default: 'Client' },
  barcode: { type: String }, // specific to Advocate
  isVerified: { type: Boolean, default: false }, // specific to Advocate
  specialization: { type: String },
  location: { type: String },
  experience: { type: String }
}, { timestamps: true });

// Prevent mongoose from using the cached model with the old schema in dev
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>('User', UserSchema);
