import { useGetProfileQuery } from '@/api/users-api'
import UploadAvatar from '../uploadAvatar'

const GeneralInformation = () => {
  const { data } = useGetProfileQuery()
  return (
    <div>
      <UploadAvatar />
      <img src={data?.avatar.url} />
    </div>
  )
}

export default GeneralInformation

//TODO clear signIn data
