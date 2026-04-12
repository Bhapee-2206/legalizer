import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Advocate' | 'Client';
  barcode?: string;
  isVerified?: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Advocate', 'Client'], default: 'Client' },
  barcode: { type: String }, // specific to Advocate
  isVerified: { type: Boolean, default: false } // specific to Advocate
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
