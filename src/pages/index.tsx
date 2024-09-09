import NavigationLayout from '@/components/layout/NavigationLayout'
/*для импорта стилей с библиотеки*/
import '@honor-ui/inctagram-ui-kit/css'
import Link from 'next/link'

export default function Home() {
  return (
    // <NavigationLayout isAuth={true}>
    //   <Link href="auth/signUp"> SignUp </Link>
    // </NavigationLayout>
    <NavigationLayout isAuth={false}>Public Page</NavigationLayout>
  )
}
