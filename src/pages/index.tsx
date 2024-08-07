import NavigationLayout from '@/components/layout/NavigationLayout'
/*для импорта стилей с библиотеки*/
import '@honor-ui/inctagram-ui-kit/css'
import { Header } from '@/components/header'

export default function Home() {
  return <NavigationLayout isAuth={true}>Main</NavigationLayout>
}
