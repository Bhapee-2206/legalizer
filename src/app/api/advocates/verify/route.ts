import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { id, approve } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Missing advocate ID' }, { status: 400 });
    }

    await connectToDatabase();

    if (approve) {
      // Approve the advocate
      const updatedUser = await User.findByIdAndUpdate(
        id, 
        { isVerified: true },
        { new: true }
      );
      if (!updatedUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Advocate approved successfully' }, { status: 200 });
    } else {
      // Reject the advocate (e.g., delete the account or set a rejected flag)
      // For now, let's just delete the user so they can sign up again properly
      await User.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Advocate rejected and removed' }, { status: 200 });
    }
    
  } catch (error: any) {
    console.error('Error verifying advocate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
