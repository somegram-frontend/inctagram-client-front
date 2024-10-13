import NavigationLayout from '@/components/layout/NavigationLayout'

const Profile = () => {
  return (
    <NavigationLayout isAuth={true}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'calc(99vh - 60px)',
        }}
      >
        My Profile
      </div>
    </NavigationLayout>
  )
}

export default Profile
