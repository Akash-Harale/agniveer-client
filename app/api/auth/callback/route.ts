import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const { code, state } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URI!);
    params.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!);
    params.append('client_secret', process.env.CLIENT_SECRET!); // ✅ safe — server only

    const tokenResponse = await axios.post(
      'https://janparichaystag.meripehchaan.gov.in/salt/api/oauth2/token',
      params,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    return NextResponse.json(tokenResponse.data);
  } catch (error: any) {
    console.error('Token exchange error:', error?.response?.data || error.message);
    return NextResponse.json({ error: 'Token exchange failed' }, { status: 500 });
  }
}