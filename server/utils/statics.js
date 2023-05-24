const confirmationPageHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Email Confirmation</title>
    <style>

    body {
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.5;
        color: #333;
        background-color: #f5f5f5;
        padding: 20px;
      }
      h1 {
        font-size: 30px;
        font-weight: bold;
        margin-top: 0;
        color: #0070c9;
      }
      h2 {
        font-size: 24px;
        font-weight: bold;
        margin-top: 0;
      }
      p {
        margin-top: 0;
        font-size: 18px;
        color: #555;
      }
      a {
        color: #fff;
        text-decoration: none;
      }
      .button {
        display: inline-block;
        background-color: #0070c9;
        color: #fff;
        padding: 14px 28px;
        border-radius: 4px;
        text-decoration: none;
        margin-top: 20px;
        font-size: 18px;
        transition: background-color 0.3s ease;
      }
     /* On hover, darken the button slightly */
      .button:hover {
        background-color: #005ea6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
      }

      .separator {
        height: 1px;
        background-color: #ddd;
        margin-bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Email Confirmed</h1>
      <div class="separator"></div>
      <p>Your email has been confirmed. You can now log in to your account.</p>
      <a href="${process.env.LOGIN_FRONT_URL}" class="button">Log In</a>
    </div>
  </body>
</html>`;

module.exports = { confirmationPageHtml };
