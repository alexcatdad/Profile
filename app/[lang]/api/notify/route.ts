import { NextRequest, NextResponse } from 'next/server';

interface NotificationRequest {
  type: 'question' | 'interest' | 'contact' | 'other';
  visitorName?: string;
  visitorEmail?: string;
  visitorCompany?: string;
  message: string;
  context?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const body: NotificationRequest = await request.json();

    // Validate required fields
    if (!body.message || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: message and type' },
        { status: 400 }
      );
    }

    // Here you would integrate with your notification service
    // Examples: Email (SendGrid, Resend), SMS (Twilio), Push notifications, Slack, Discord, etc.

    // For now, we'll log and return success
    // In production, you would send the notification via your preferred service
    console.log('Notification received:', {
      ...body,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    });

    // Example integration points:
    // await sendEmail({ to: process.env.DEVELOPER_EMAIL, subject: `New ${body.type}`, body: body.message });
    // await sendSlackMessage({ channel: process.env.SLACK_CHANNEL, text: body.message });
    // await sendSMS({ to: process.env.DEVELOPER_PHONE, body: `New visitor: ${body.message}` });

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully',
      notificationId: crypto.randomUUID(),
    });
  } catch (error) {
    console.error('Notify API error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}

// GET endpoint to check notification status
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const notificationId = searchParams.get('id');

  if (!notificationId) {
    return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 });
  }

  // In production, you would check the status of the notification
  // For now, return a mock response
  return NextResponse.json({
    notificationId,
    status: 'delivered',
    timestamp: new Date().toISOString(),
  });
}
