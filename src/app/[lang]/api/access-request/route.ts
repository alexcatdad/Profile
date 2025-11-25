import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMongoDb } from '@/lib/mongoClient';

const accessRequestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  company: z.string().max(100).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = accessRequestSchema.parse(body);

    const db = await getMongoDb();

    const collection = db.collection('access-requests');
    await collection.insertOne({
      name: validated.name,
      email: validated.email,
      company: validated.company,
      timestamp: new Date().toISOString(),
      referrer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json({ success: true, message: 'Access granted' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
