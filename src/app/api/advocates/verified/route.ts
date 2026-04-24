import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all verified advocates
    const verifiedAdvocates = await User.find({ role: 'Advocate', isVerified: true })
      .select('name email specialization location experience _id')
      .lean();
      
    const formatted = verifiedAdvocates.map(adv => ({
      ...adv,
      id: adv._id.toString(),
      _id: undefined,
      rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1), // Mock rating between 4.5 and 5.0
      successRate: Math.floor(Math.random() * (99 - 85 + 1) + 85) + '%' // Mock success rate 85% to 99%
    }));
    
    return NextResponse.json({ advocates: formatted }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching verified advocates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
