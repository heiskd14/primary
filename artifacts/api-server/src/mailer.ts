import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "okeyodekingdavid@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendAdmissionNotification(admission: {
  childFirstName: string;
  childLastName: string;
  childDob: string;
  childGender: string;
  classApplyingFor: string;
  previousSchool?: string | null;
  parentName: string;
  parentRelationship: string;
  parentPhone: string;
  parentPhone2?: string | null;
  parentEmail?: string | null;
  parentAddress: string;
  howDidYouHear?: string | null;
  additionalInfo?: string | null;
  submittedAt: string;
}) {
  const subject = `New Admission Application — ${admission.childFirstName} ${admission.childLastName} (${admission.classApplyingFor})`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">New Admission Application</h1>
        <p style="color: #bfcfff; margin: 6px 0 0; font-size: 14px;">Triple Tee Montessori Academy</p>
      </div>

      <div style="padding: 24px;">
        <h2 style="color: #1a237e; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Child's Details</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="color: #6b7280; padding: 4px 0; width: 40%;">Full Name</td><td style="color: #111827; font-weight: bold;">${admission.childFirstName} ${admission.childLastName}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Date of Birth</td><td style="color: #111827;">${admission.childDob}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Gender</td><td style="color: #111827;">${admission.childGender}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Class Applying For</td><td style="color: #111827; font-weight: bold;">${admission.classApplyingFor}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Previous School</td><td style="color: #111827;">${admission.previousSchool || "None"}</td></tr>
        </table>

        <h2 style="color: #1a237e; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 20px;">Parent / Guardian Details</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="color: #6b7280; padding: 4px 0; width: 40%;">Name</td><td style="color: #111827; font-weight: bold;">${admission.parentName}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Relationship</td><td style="color: #111827;">${admission.parentRelationship}</td></tr>
          <tr><td style="color: #6b7280; padding: 4px 0;">Phone</td><td style="color: #111827;">${admission.parentPhone}</td></tr>
          ${admission.parentPhone2 ? `<tr><td style="color: #6b7280; padding: 4px 0;">2nd Phone</td><td style="color: #111827;">${admission.parentPhone2}</td></tr>` : ""}
          ${admission.parentEmail ? `<tr><td style="color: #6b7280; padding: 4px 0;">Email</td><td style="color: #111827;">${admission.parentEmail}</td></tr>` : ""}
          <tr><td style="color: #6b7280; padding: 4px 0;">Address</td><td style="color: #111827;">${admission.parentAddress}</td></tr>
        </table>

        ${admission.howDidYouHear || admission.additionalInfo ? `
        <h2 style="color: #1a237e; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 20px;">Additional Info</h2>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          ${admission.howDidYouHear ? `<tr><td style="color: #6b7280; padding: 4px 0; width: 40%;">Heard about us via</td><td style="color: #111827;">${admission.howDidYouHear}</td></tr>` : ""}
          ${admission.additionalInfo ? `<tr><td style="color: #6b7280; padding: 4px 0; vertical-align: top;">Notes</td><td style="color: #111827;">${admission.additionalInfo}</td></tr>` : ""}
        </table>
        ` : ""}

        <div style="margin-top: 24px; background: #f0f4ff; border-radius: 8px; padding: 14px; font-size: 13px; color: #374151;">
          Submitted: <strong>${new Date(admission.submittedAt).toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</strong>
        </div>
      </div>

      <div style="background-color: #CC2200; padding: 14px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 13px;">Triple Tee Montessori Academy · Opp. Winners Chapel, Oke-Ola, Oro, Kwara State</p>
        <p style="color: #ffc5bb; margin: 4px 0 0; font-size: 12px;">07036500419 · 08032348460 · tripleteeschools@gmail.com</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"Triple Tee Montessori Academy" <okeyodekingdavid@gmail.com>',
    to: ["tripleteeschools@gmail.com", "okeyodekingdavid@gmail.com"],
    subject,
    html,
  });
}
