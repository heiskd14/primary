import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "okeyodekingdavid@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FOOTER = `
  <div style="background-color: #CC2200; padding: 14px; text-align: center;">
    <p style="color: white; margin: 0; font-size: 13px;">Triple Tee Montessori Academy · Opp. Winners Chapel, Oke-Ola, Oro, Kwara State</p>
    <p style="color: #ffc5bb; margin: 4px 0 0; font-size: 12px;">07036500419 · 08032348460 · tripleteeschools@gmail.com</p>
  </div>
`;

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
      ${FOOTER}
    </div>
  `;

  await transporter.sendMail({
    from: '"Triple Tee Montessori Academy" <okeyodekingdavid@gmail.com>',
    to: ["tripleteeschools@gmail.com", "okeyodekingdavid@gmail.com"],
    subject,
    html,
  });
}

const STATUS_MESSAGES: Record<string, { emoji: string; heading: string; color: string; body: string }> = {
  reviewed: {
    emoji: "👀",
    heading: "Your Application is Being Reviewed",
    color: "#1e40af",
    body: "Good news! Our admissions team has received your application and is currently reviewing it. We will be in touch soon with a final decision.",
  },
  accepted: {
    emoji: "🎉",
    heading: "Congratulations — Application Accepted!",
    color: "#166534",
    body: "We are delighted to inform you that your child has been accepted to Triple Tee Montessori Academy! Please contact us on <strong>07036500419</strong> or <strong>08032348460</strong> to complete the enrolment process and pay the acceptance fee.",
  },
  rejected: {
    emoji: "📋",
    heading: "Update on Your Application",
    color: "#991b1b",
    body: "Thank you for your interest in Triple Tee Montessori Academy. Unfortunately, we are unable to offer a place at this time, as we do not currently have availability for the class you applied for. We encourage you to contact us on <strong>07036500419</strong> to discuss future openings.",
  },
};

export async function sendStatusUpdateEmail(admission: {
  childFirstName: string;
  childLastName: string;
  classApplyingFor: string;
  parentName: string;
  parentEmail: string;
  status: string;
}) {
  const cfg = STATUS_MESSAGES[admission.status];
  if (!cfg) return;

  const subject = `${cfg.emoji} Application Update — ${admission.childFirstName} ${admission.childLastName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 24px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 8px;">${cfg.emoji}</div>
        <h1 style="color: white; margin: 0; font-size: 20px;">${cfg.heading}</h1>
        <p style="color: #bfcfff; margin: 6px 0 0; font-size: 14px;">Triple Tee Montessori Academy</p>
      </div>
      <div style="padding: 28px;">
        <p style="font-size: 15px; color: #374151; margin: 0 0 16px;">Dear <strong>${admission.parentName}</strong>,</p>
        <p style="font-size: 15px; color: #374151; margin: 0 0 16px; line-height: 1.6;">${cfg.body}</p>
        <div style="background: #f9fafb; border-left: 4px solid ${cfg.color}; border-radius: 6px; padding: 14px; margin-top: 20px; font-size: 14px; color: #374151;">
          <strong>Child's Name:</strong> ${admission.childFirstName} ${admission.childLastName}<br/>
          <strong>Class Applied For:</strong> ${admission.classApplyingFor}
        </div>
        <p style="font-size: 13px; color: #6b7280; margin-top: 24px; line-height: 1.6;">
          If you have any questions, please don't hesitate to contact us:<br/>
          📞 07036500419 &nbsp;|&nbsp; 08032348460<br/>
          ✉️ tripleteeschools@gmail.com<br/>
          📍 Opp. Winners Chapel, Oke-Ola, Oro, Kwara State
        </p>
      </div>
      ${FOOTER}
    </div>
  `;

  await transporter.sendMail({
    from: '"Triple Tee Montessori Academy" <okeyodekingdavid@gmail.com>',
    to: admission.parentEmail,
    subject,
    html,
  });
}
