import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useId } from 'react';
import { Button, Cards, Typography } from '@honor-ui/inctagram-ui-kit';
import { ControlledInput } from '@/components/controlled/ControlledInput';
import s from './formForgotPassword.module.scss'
import { useRecaptchaSiteKeyQuery } from '@/api/auth-api';

type Props = {
    onSubmit: (data: FormForgotPasswordType) => void
}

const ForgotPasswordSchema = z
    .object({
        email: z
            .string()
            .min(1, { message: 'This field has to be filled.' })
            .email('This is not a valid email.'),
        recaptchaToken: z
            .string().min(1, { message: 'reCAPTCHA is required.' })
    })

export type FormForgotPasswordType = z.infer<typeof ForgotPasswordSchema>

const FormForgotPassword = ({ onSubmit }: Props) => {
    const { control, trigger, handleSubmit, setValue } = useForm<FormForgotPasswordType>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: '',
            recaptchaToken: '',
        }
    })

    const { data: siteKey, error, isLoading } = useRecaptchaSiteKeyQuery()
    const formId = useId()

    const handleRecaptchaChange = (token: string | null) => {
        setValue('recaptchaToken', token || '');
    };

    return (
        <Cards className={s.card}>
            <Typography as={'h1'} className={s.title}>
                Forgot Password
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} id={formId} className={s.form}>
                <ControlledInput
                    control={control}
                    label={'Email'}
                    name={'email'}
                    trigger={trigger}
                    className={s.input} />
                <Typography as={'p'} variant={'regular_text14'} className={s.informTitle}>
                    Enter your email address and we will send you further instructions
                </Typography>
                <Button form={formId} fullWidth className={s.button}>Send Link</Button>
                <Button variant={'borderless'} fullWidth className={s.button}>Back to Sign In</Button>
                <div className={s.captcha}>
                    {siteKey ?
                        <ReCAPTCHA onChange={handleRecaptchaChange}
                            sitekey={siteKey.recaptchaSiteKey}
                            theme='dark'
                            hl='en'
                            id={'recaptchaToken'}
                        />
                        : ''}
                </div>
            </form>
        </Cards>
    );
};

//6LdptRAqAAAAAIFDtiIPnl5QarAlPIr73oFD3sfB  мой рабочий токен

export default FormForgotPassword;