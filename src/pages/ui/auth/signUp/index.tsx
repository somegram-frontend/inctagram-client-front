import { FormSignUp, SignUpForm } from './ui/FormSignUp'

const SignUp = () => {
  const onSubmitSignUp = (formData: SignUpForm) => {}

  return <FormSignUp onSubmit={onSubmitSignUp} />
}

export default SignUp
