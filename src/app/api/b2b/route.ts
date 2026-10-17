import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.company || !body.email || !body.message) return NextResponse.json({ error: 'Заполните поля' }, { status: 400 });
    if (body.message.length < 10) return NextResponse.json({ error: 'Сообщение короткое' }, { status: 400 });
    console.log('[B2B]', body);
    return NextResponse.json({ status: 'ok' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Ошибка' }, { status: 400 });
  }
}
