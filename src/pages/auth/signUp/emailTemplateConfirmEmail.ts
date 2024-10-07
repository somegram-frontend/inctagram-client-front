//Шаблон письма подтверждения email

const appDeploy = `http://localhost:3000/auth/signUp/emailConfirm?token=##token##` //TODO  change to deploy-app-path, when finish develop
// const appDeploy = `https:// ... .app/auth/signUp/emailConfirm?token=##token##`

export const emailTemplateConfirmEmail = `
<!DOCTYPE html >
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <title>Письмо</title>
    </head>
    <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
        <div>
            <table style="border-collapse:collapse;border-spacing:0;max-width:600px;width:100%;margin: 0 auto;">
                <tr>
                    <td style="border-radius:25px;color:#ffffff;padding:20px;background-color:#bea6ff" >
                        <img style="float:left;margin-right:20px;border-radius:15px;width:95px;height:95px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS7trqI1p3zximPfE3gm9QUio42NKBfa5xlQoLgCcTYSBH3ZO4x6S3K4-mf1BlZNrgz6Q&usqp=CAU" alt=''/>
                        <br/>
                        <p style='margin: 0'>
                            <h2 style='margin: 0'>Hi, ##name##.</h2>
                            Please confirm your email by clicking on the button below:
                        </p>
                        <a href="${appDeploy}" style="text-decoration:none;color:#ffffff;background-color:#382766;display:block;margin-top:20px;border-radius:10px;padding:10px 0;text-align:center">
                            Confirm your email
                        </a>
                        <br/>
                        <p>
                            If it doesn't work, copy and paste the following link in your browser:
                            <br/><a href="${appDeploy}" style="font-size:12px">${appDeploy}</a>
                        </p>
                        <br/>
                        <h4 style="color:#cc1439;text-align:center;margin-bottom: 0">
                            If you didn't request this message just ignore it.
                        </h4>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
`
