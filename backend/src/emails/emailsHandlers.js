import { resend } from "../lib/resend.js";
import { sender } from "../lib/resend.js    ";

export const senderWelcomeEmail = async (email, username, clientURL) => {
  const { data, error } = await resend.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to ChatApp! Need More Information?",
    html: `
      <p>Hello <strong>${username || "there"}</strong>,</p>
      <p>Welcome to <strong>ChatApp</strong> 👋</p>
      <p>
        <a href="${clientURL}">Open ChatApp</a>
      </p>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send welcome email");
  }

  console.log("Email sent:", data);
  return data;
};
