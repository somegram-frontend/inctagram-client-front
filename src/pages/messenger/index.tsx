import Layout from '@/layout'
import { Messenger } from '@/features/messenger'
import { Typography } from '@honor-ui/inctagram-ui-kit'

import s from './messenger-page.module.scss'

const MessengerPage = () => {
  return (
    <Layout>
      <div className={s.page}>
        <Typography variant={'h1'}>Messenger</Typography>
        <Messenger />
      </div>
    </Layout>
  )
}

export default MessengerPage
