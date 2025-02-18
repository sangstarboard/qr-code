// app/api/qr-code-history/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
      const qrCodeHistories = await prisma.qRCodeHistory.findMany();
      return new Response(JSON.stringify(qrCodeHistories), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error fetching QRCodeHistory:', error);  // Ghi log lỗi
      return new Response(
        JSON.stringify({ error: 'Có lỗi khi lấy dữ liệu' }),
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
      const { url, describe, qrType } = await request.json();
      const existingQRCode = await prisma.qRCodeHistory.findFirst({
        where: { url, qrType },
      });
  
      if (existingQRCode) {
        const updatedQRCode = await prisma.qRCodeHistory.update({
          where: { id: existingQRCode.id },
          data: {
            scanCount: existingQRCode.scanCount + 1,
            updatedAt: new Date(),
          },
        });
        return new Response(
          JSON.stringify({ success: true, data: updatedQRCode }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        const newHistory = await prisma.qRCodeHistory.create({
          data: {
            url,
            describe,
            qrType,
            scanCount: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return new Response(
          JSON.stringify({ success: true, data: newHistory }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Error saving data' }),
        { status: 500 }
      );
    }
  }
  
  