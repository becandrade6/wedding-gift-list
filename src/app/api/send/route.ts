import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const {
      giftName,
      buyerName,
      buyerSurname,
      homeDelivery,
      estimatedDeliveryDate,
      price
    } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Lista de Presentes <onboarding@resend.dev>', // Update this with your verified domain
      to: ['bernardocandrade6@gmail.com'], // Update with the couple's email
      subject: 'Novo Presente Comprado! 🎁',
      html: `
        <h2>Um presente foi comprado da sua lista!</h2>
        <p><strong>Presente:</strong> ${giftName}</p>
        <p><strong>Comprador:</strong> ${buyerName} ${buyerSurname}</p>
        <p><strong>Valor:</strong> ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(price)}</p>
        <p><strong>Entrega:</strong> ${homeDelivery ? 'Será entregue na sua casa' : 'O convidado levará ao casamento'}</p>
        ${homeDelivery && estimatedDeliveryDate ? `
        <p><strong>Data estimada de entrega:</strong> ${new Date(estimatedDeliveryDate).toLocaleDateString('pt-BR')}</p>
        ` : ''}
      `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}