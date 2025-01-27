import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { type, subject, message, rating, email } = await req.json();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
              padding: 20px;
            }
            .header { 
              background: linear-gradient(to right, #7928CA, #FF0080);
              padding: 20px;
              border-radius: 10px;
              color: white;
              margin-bottom: 20px;
            }
            .content {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 10px;
            }
            .rating {
              font-size: 24px;
              margin: 10px 0;
            }
            .user-info {
              background: #e9ecef;
              padding: 15px;
              border-radius: 8px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Feedback Received</h1>
            </div>
            <div class="content">
              <p><strong>Type:</strong> ${type}</p>
              <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <p class="rating"><strong>Rating:</strong> ${'⭐'.repeat(rating)}</p>
              <p><strong>Message:</strong></p>
              <p>${message}</p>
              <div class="user-info">
                <p><strong>User Email:</strong> ${email}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

        // Send to admin
        await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: 'purepick.app@gmail.com',
            subject: `New Feedback: ${subject || type}`,
            html: emailHtml
        });

        // Send confirmation to user
        if (email) {
            await transporter.sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: 'Thank you for your feedback - PurePick',
                html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                  padding: 20px;
                }
                .header { 
                  background: linear-gradient(to right, #7928CA, #FF0080);
                  padding: 20px;
                  border-radius: 10px;
                  color: white;
                  margin-bottom: 20px;
                }
                .content {
                  background: #f8f9fa;
                  padding: 20px;
                  border-radius: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Your Feedback!</h1>
                </div>
                <div class="content">
                  <p>We appreciate you taking the time to share your thoughts with us.</p>
                  <p>Your feedback helps us improve PurePick for everyone.</p>
                  <p>Best regards,<br>The PurePick Team</p>
                </div>
              </div>
            </body>
          </html>
        `
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to send feedback" }, { status: 500 });
    }
}
