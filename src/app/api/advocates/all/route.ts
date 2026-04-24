import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all advocates
    const allAdvocates = await User.find({ role: 'Advocate' })
      .select('name email barcode isVerified createdAt _id')
      .sort({ createdAt: -1 })
      .lean();
      
    const formatted = allAdvocates.map(adv => ({
      ...adv,
      id: adv._id.toString(),
      _id: undefined
    }));
    
    return NextResponse.json({ advocates: formatted }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching all advocates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
