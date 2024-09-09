import NavigationLayout from '@/components/layout/NavigationLayout'
/*для импорта стилей с библиотеки*/
import '@honor-ui/inctagram-ui-kit/css'
import Link from 'next/link'

export default function Home() {
  return (
    <NavigationLayout isAuth={true}>
      <Link href="ui/auth/signUp"> SignUp </Link>
      <br />
      <Link href="ui/auth/forgotPassword"> Forgot password </Link>
      <br />
      <Link href="ui/auth/createNewPassword"> Create new password </Link>
      <br />
      <Link href="ui/auth/forgotPassword/emailVerification"> Email Verification </Link>
    </NavigationLayout>
  )
}
