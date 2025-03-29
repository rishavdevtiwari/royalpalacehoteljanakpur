
const nodemailer = require('nodemailer');
const HOTEL_EMAIL = process.env.HOTEL_EMAIL || 'rishavdevtiwari01@gmail.com';

// Initialize email transporter
let transporter;

// Create reusable transporter
try {
  // For production, use actual email service
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: HOTEL_EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
      // Add these settings to fix Gmail authentication issues
      secure: true,
      tls: {
        rejectUnauthorized: false
      }
    });
    
    // Verify connection configuration
    transporter.verify(function(error, success) {
      if (error) {
        console.error('Email service error:', error);
      } else {
        console.log('Email server is ready to send messages');
      }
    });
  } else {
    // For development, log email content to console
    transporter = {
      sendMail: (mailOptions) => {
        console.log('========== EMAIL WOULD BE SENT ==========');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Text:', mailOptions.text);
        console.log('HTML:', mailOptions.html);
        console.log('=======================================');
        return Promise.resolve({ response: 'Email logged to console' });
      }
    };
  }
} catch (error) {
  console.error('Error setting up email service:', error);
}

// Send booking confirmation email
const sendBookingConfirmationEmail = async (booking, user) => {
  try {
    console.log('Attempting to send confirmation email to:', user.email);
    
    const mailOptions = {
      from: HOTEL_EMAIL,
      to: user.email,
      subject: `Royal Palace Hotel - Booking Confirmation #${booking.bookingReference}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Royal Palace Hotel - Booking Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for choosing Royal Palace Hotel for your upcoming stay. We are pleased to confirm your booking.</p>
          
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details:</h3>
            <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Check-in Date:</strong> ${new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out Date:</strong> ${new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Room Type:</strong> ${booking.room.roomType.name}</p>
            <p><strong>Number of Guests:</strong> ${booking.adults} Adults, ${booking.children} Children</p>
            <p><strong>Total Amount:</strong> NPR ${booking.totalAmount.toLocaleString()}</p>
          </div>
          
          <p>If you have any questions or special requests, please don't hesitate to contact us:</p>
          <p>Phone: 041-591471 | 9705151900</p>
          <p>Email: royalpalacejanakpur@gmail.com</p>
          
          <p>We look forward to welcoming you to Royal Palace Hotel!</p>
          
          <p>Best regards,<br />Royal Palace Hotel Team</p>
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply to this message.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};

// Send payment receipt email
const sendPaymentReceiptEmail = async (payment, booking, user) => {
  try {
    console.log('Attempting to send payment receipt to:', user.email);
    
    const mailOptions = {
      from: HOTEL_EMAIL,
      to: user.email,
      subject: `Royal Palace Hotel - Payment Receipt #${payment.transactionId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Royal Palace Hotel - Payment Receipt</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for your payment. Below is your receipt.</p>
          
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Payment Details:</h3>
            <p><strong>Transaction ID:</strong> ${payment.transactionId}</p>
            <p><strong>Booking Reference:</strong> ${booking.bookingReference}</p>
            <p><strong>Payment Date:</strong> ${new Date(payment.paymentDate).toLocaleDateString()}</p>
            <p><strong>Amount Paid:</strong> NPR ${payment.amount.toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
            <p><strong>Status:</strong> ${payment.paymentStatus}</p>
          </div>
          
          <p>If you have any questions about your payment, please contact us:</p>
          <p>Phone: 041-591471 | 9705151900</p>
          <p>Email: royalpalacejanakpur@gmail.com</p>
          
          <p>Thank you for choosing Royal Palace Hotel!</p>
          
          <p>Best regards,<br />Royal Palace Hotel Team</p>
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply to this message.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending payment receipt email:', error);
    throw error;
  }
};

// Send contact form email
const sendContactFormEmail = async (contactData) => {
  try {
    console.log('Attempting to send contact form submission notification');
    
    const mailOptions = {
      from: HOTEL_EMAIL,
      to: HOTEL_EMAIL,
      subject: `New Contact Form Submission: ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">New Contact Form Submission</h2>
          
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line;">${contactData.message}</p>
          </div>
          
          <p>This message was sent from the contact form on the Royal Palace Hotel website.</p>
          <hr />
          <p style="font-size: 12px; color: #666;">This is an automated email.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
};

// Export email service functions
module.exports = {
  sendBookingConfirmationEmail,
  sendPaymentReceiptEmail,
  sendContactFormEmail
};
