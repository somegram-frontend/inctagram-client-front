import NavigationLayout from '@/components/layout/NavigationLayout'
/*для импорта стилей с библиотеки*/
import '@honor-ui/inctagram-ui-kit/css'
import { Header } from '@/components/header'

export default function Home() {
  // const data = useGithubQuery()
  // console.log(data)

  return <NavigationLayout isAuth={true}>Main</NavigationLayout>
}
