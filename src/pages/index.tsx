import NavigationLayout from '@/components/layout/NavigationLayout'
/*для импорта стилей с библиотеки*/
import '@honor-ui/inctagram-ui-kit/css'

export default function Home() {
  return <NavigationLayout isAuth={false}>Public Page</NavigationLayout>
}
