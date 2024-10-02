import { Button } from "@honor-ui/inctagram-ui-kit"
import { useRouter } from "next/router"

const Profile = () => {

    const router = useRouter()

    const handleProfileSettingClick = () => {
        router.push(`${router.asPath}/generalInformation`)
    }

    return (<>
        <div>
            My Profile
        </div>
        <Button onClick={handleProfileSettingClick}>Profile Settings</Button>
    </>)
}

export default Profile

