//Шаблон письма восстановления пароля

const appDeploy = 'http://localhost:3000/new-password/##token##' //TODO change to deploy-app-path, when finish develop
// const appDeploy = 'https:// ... .app/new-password/##token##'

export const emailTemplateForgotPassword = `
<!DOCTYPE html >
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <title>Письмо</title>
    </head>
    <body class="body" style="width:100%;height:100%;padding:0;Margin:5px">
        <div>
            <table style="border-collapse:collapse;border-spacing:0;max-width:600px;width:100%;margin: 0 auto;">
                <tr>
                    <td style="border-radius:25px;color:#ffffff;padding:20px;background-color:#bea6ff" >
                        <img style="float:left;margin-right:20px;border-radius:15px;width:95px;height:95px" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS7trqI1p3zximPfE3gm9QUio42NKBfa5xlQoLgCcTYSBH3ZO4x6S3K4-mf1BlZNrgz6Q&usqp=CAU" alt=''/>
                        <br/>
                        <p style='margin: 0'>
                            <h2 style='margin: 0'>Hi, ##name##.</h2>
                            Resetting your password is easy. Just press the button below and follow the instructions. We'll have you up and running in no time.
                        </p>
                        <a href="${appDeploy}" style="text-decoration:none;color:#ffffff;background-color:#382766;display:block;margin-top: 20px;border-radius:10px;padding:10px 0;text-align:center">
                            Reset Password
                        </a>
                        <p>
                            If it doesn't work, copy and paste the following link in your browser:
                            <br/><a href="${appDeploy}">${appDeploy}</a>
                        </p>
                        <h3 style="color:#cc1439;text-align:center;margin-bottom: 0">
                            If you didn't request this message just ignore it.
                        </h3>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
`