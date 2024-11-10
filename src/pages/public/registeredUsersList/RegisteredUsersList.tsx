import { Typography } from '@honor-ui/inctagram-ui-kit'
import s from './registeredUsersList.module.scss'

type Props = {
    usersCount: number | undefined
}

export const RegisteredUsersList = ({usersCount}:Props) => {

    const countArray = JSON.stringify(usersCount)?.split(',')

    return (
        <section className={s.usersList}>
            <Typography variant='h2'>Registered users:</Typography>
            <div className={s.usersCount}>
                {countArray?.map(el => (
                    <Typography variant='h2'>{el}</Typography>
                ))}
            </div>
        </section>
    )
}