class PrettifyEmailImpl {
  linebreak: string = '<br>';
  tabSpace: string = '<br><br><br><br>';

  bold(text: string) {
    return `<b>${text}</b>`;
  }

  italic(text: string) {
    return `<i>${text}</i>`;
  }

  underline(text: string) {
    return `<u>${text}</u>`;
  }

  otp(text: string) {
    return `<div style="max-width:100%; margin: 20px; padding: 20px;">
    ${text
      .split('')
      .map(
        (t) => `
      <span style="
        display: inline-block;
        padding: 8px;
        margin: 0 4px;
        border: 2px solid #6495ed;
        border-radius: 4px;
        font-weight: bold;
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        font-size: 1.175em;
      ">${t}</span>`,
      )
      .join('')}
    </div>`;
  }

  template(subject: string, message: string) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Logicri</title>
  </head>
  <body style="font-family: sans-serif; background: linear-gradient(#6495ed, #059669); color: #1E293B; margin: 0; padding: 0; width: 100%; text-align: center;">
    <div style="max-width: 75%; margin: 20px auto; padding: 20px; background-color: #ffffff; box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);">
      <h1 style="color: #151b54; font-size: 2.5em; margin: 20px 0;">${subject}</h1>
      <div style="text-align: left;">
        <p style="color: #151b54; font-weight: bold;">Greetings,</p>
        <p style="color: #151b54; font-weight: bold;">${message}</p>
        <p>Kind Regards,</p>
        <p>Logicri</p>
      </div>
    </div>
  </body>
</html>`;
  }

  insertLink = (url: string) => {
    return `<a href="${url}">${url}</a>`;
  };
}

export const PrettifyEmail = new PrettifyEmailImpl();
