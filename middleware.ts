import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    // Check if the request is from a bot
    const verification = await checkBotId();

    if (verification.isBot) {
        return NextResponse.json(
            { error: 'Bot detected. Access denied.' },
            { status: 403 },
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
