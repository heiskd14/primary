import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "okeyodekingdavid@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const SCHOOL_URL = process.env.SCHOOL_URL ?? "https://triple-tee-montessori-academy.replit.app";

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

export async function sendStudentCredentialsEmail(opts: {
  parentName: string;
  parentEmail: string;
  childFirstName: string;
  childLastName: string;
  classLevel: string;
  studentEmail: string;
  plainPassword: string;
}) {
  const subject = `🎓 Student Portal Login Details — ${opts.childFirstName} ${opts.childLastName}`;
  const portalUrl = `${SCHOOL_URL}/student-portal`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 28px; text-align: center;">
        <div style="font-size: 42px; margin-bottom: 10px;">🎓</div>
        <h1 style="color: white; margin: 0; font-size: 22px;">Student Portal Access</h1>
        <p style="color: #bfcfff; margin: 8px 0 0; font-size: 14px;">Triple Tee Montessori Academy</p>
      </div>
      <div style="padding: 28px;">
        <p style="font-size: 15px; color: #374151; margin: 0 0 16px;">Dear <strong>${opts.parentName}</strong>,</p>
        <p style="font-size: 15px; color: #374151; margin: 0 0 20px; line-height: 1.6;">
          Your child <strong>${opts.childFirstName} ${opts.childLastName}</strong> (${opts.classLevel}) now has access to the Triple Tee Montessori Academy Student Portal.
          Use the credentials below to sign in and access academic records, timetables, and school notices.
        </p>

        <div style="background: #f0f4ff; border: 2px solid #1a237e; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h2 style="color: #1a237e; font-size: 15px; margin: 0 0 14px; text-transform: uppercase; letter-spacing: 0.05em;">Login Credentials</h2>
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="color: #6b7280; padding: 6px 0; width: 35%;">Portal URL</td>
              <td style="color: #1a237e; font-weight: bold;">
                <a href="${portalUrl}" style="color: #1a237e;">${portalUrl}</a>
              </td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 6px 0;">Email Address</td>
              <td style="color: #111827; font-weight: bold; font-size: 15px;">${opts.studentEmail}</td>
            </tr>
            <tr>
              <td style="color: #6b7280; padding: 6px 0;">Password</td>
              <td style="color: #111827; font-weight: bold; font-size: 15px; font-family: monospace; background: #fff; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb;">${opts.plainPassword}</td>
            </tr>
          </table>
        </div>

        <a href="${portalUrl}" style="display: inline-block; background-color: #16a34a; color: white; font-weight: bold; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-top: 8px;">
          Go to Student Portal →
        </a>

        <p style="font-size: 13px; color: #6b7280; margin-top: 28px; line-height: 1.6;">
          If you have any issues logging in, please contact us:<br/>
          📞 07036500419 &nbsp;|&nbsp; 08032348460<br/>
          ✉️ tripleteeschools@gmail.com
        </p>
      </div>
      ${FOOTER}
    </div>
  `;

  await transporter.sendMail({
    from: '"Triple Tee Montessori Academy" <okeyodekingdavid@gmail.com>',
    to: opts.parentEmail,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail(opts: {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}) {
  const resetUrl = `${SCHOOL_URL}/reset-password?token=${opts.token}`;
  const subject = "🔑 Student Portal — Password Reset Request";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #1a237e; padding: 28px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 8px;">🔑</div>
        <h1 style="color: white; margin: 0; font-size: 20px;">Password Reset Request</h1>
        <p style="color: #bfcfff; margin: 8px 0 0; font-size: 14px;">Triple Tee Montessori Academy Student Portal</p>
      </div>
      <div style="padding: 28px;">
        <p style="font-size: 15px; color: #374151; margin: 0 0 16px;">Hello <strong>${opts.firstName} ${opts.lastName}</strong>,</p>
        <p style="font-size: 15px; color: #374151; margin: 0 0 20px; line-height: 1.6;">
          We received a request to reset the password for the student portal account associated with <strong>${opts.email}</strong>.
          Click the button below to set a new password. This link is valid for <strong>1 hour</strong>.
        </p>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #1a237e; color: white; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 10px; text-decoration: none;">
            Reset My Password
          </a>
        </div>

        <p style="font-size: 13px; color: #6b7280; margin-top: 20px; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #1a237e; word-break: break-all;">${resetUrl}</a>
        </p>

        <div style="background: #fee2e2; border-left: 4px solid #CC2200; border-radius: 6px; padding: 14px; margin-top: 20px; font-size: 13px; color: #374151;">
          If you did not request a password reset, please ignore this email. Your password will not change.
        </div>
      </div>
      ${FOOTER}
    </div>
  `;

  await transporter.sendMail({
    from: '"Triple Tee Montessori Academy" <okeyodekingdavid@gmail.com>',
    to: opts.email,
    subject,
    html,
  });
}
