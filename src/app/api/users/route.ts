import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions); // ✅ No `req` here

  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, email } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      role: 'STAFF',
      facilityId: session.user.facilityId!,
    },
  });

  return NextResponse.json(newUser, { status: 201 });
}
