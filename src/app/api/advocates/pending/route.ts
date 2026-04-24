import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    const pendingAdvocates = await User.find({ role: 'Advocate', isVerified: { $ne: true } })
      .select('name email barcode createdAt _id')
      .lean();
      
    // Rename _id to id for frontend compatibility
    const formatted = pendingAdvocates.map(adv => ({
      ...adv,
      id: adv._id.toString(),
      _id: undefined
    }));
    
    return NextResponse.json({ advocates: formatted }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching pending advocates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
