const SENDGRID_API_ENDPOINT = Deno.env.get("SENDGRID_API_ENDPOINT")!;
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");
const SEND_GRID_TEMPLATE_ID = Deno.env.get("SEND_GRID_TEMPLATE_ID");

export const sendEmail = async (
  toEmail: string,
  subject: string,
  reset_password_token: string,
) => {
  const message = {
    "personalizations": [
      {
        "to": [
          {
            "email": toEmail,
            "name": "test",
          },
        ],
        "dynamic_template_data": {
          "reset_password_token": reset_password_token,
        },
        "subject": subject,
      },
    ],
    "from": {
      "email": "shunyaendoh.1215@gmail.com",
      "name": "test",
    },
    "reply_to": {
      "email": "no-reply@esh2n.com",
      "name": "test",
    },
    "template_id": SEND_GRID_TEMPLATE_ID,
  };

  const response = await fetch(SENDGRID_API_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  return response;
};
