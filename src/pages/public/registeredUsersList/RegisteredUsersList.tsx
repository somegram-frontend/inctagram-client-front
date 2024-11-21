import { Typography } from '@honor-ui/inctagram-ui-kit'
import s from './registeredUsersList.module.scss'

type Props = {
    usersCount: number | undefined
}

export const RegisteredUsersList = ({usersCount}:Props) => {


    const countArray = JSON.stringify(usersCount)?.padStart(6, '0').split('')

    return (
        <div className={s.usersList}>
            <Typography variant='h2'>Registered users:</Typography>
                <div className={s.usersCount}>
                {countArray?.map((el, index) => (
                    <Typography variant='h2' key={index}>{el}</Typography>
                ))}
            </div>
        </div>
    )
}