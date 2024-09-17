import s from './authProviders.module.scss'
import {
  GithubSvgrepoCom31 as Github,
  GoogleSvgrepoCom1 as Google,
} from '@honor-ui/inctagram-ui-kit'

type Props = {
  onSignGoogle: () => void
  onSignGit: () => void
}

export const AuthProviders = ({ onSignGoogle, onSignGit }: Props) => {
  return (
    <div className={s.iconsBlock}>
      <button onClick={onSignGoogle}>
        <Google />
      </button>
      <button onClick={onSignGit}>
        <Github />
      </button>
    </div>
  )
}
