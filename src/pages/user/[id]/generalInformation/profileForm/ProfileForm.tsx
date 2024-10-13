import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { useGetCitiesListMutation, useGetCountriesListQuery } from '@/api/countries-api'
import { useEffect, useId, useMemo, useState } from 'react'
import { ControlledSelect } from '@/components/controlled/ControlledSelect'
import s from './profileForm.module.scss'
import { changeGeneralInformationSchema } from '@/shared/utils/validationSchemas'
import { UserProfile } from '@/api/users-api.types'
import { ControlledDatePicker } from '@/components/controlled/ControlledDatePicker'

type Props = {
  onSubmit: (data: Omit<UserProfile, 'dateOfBirth'> & { dateOfBirth: Date }) => void
  dataValue?: Omit<UserProfile, 'dateOfBirth'> & { dateOfBirth: Date }
}

const ProfileForm = ({ onSubmit, dataValue }: Props) => {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Omit<UserProfile, 'dateOfBirth'> & { dateOfBirth: Date }>({
    resolver: zodResolver(changeGeneralInformationSchema),
    defaultValues: {
      userName: dataValue?.userName || '',
      firstName: dataValue?.firstName || '',
      lastName: dataValue?.lastName || '',
      dateOfBirth: dataValue?.dateOfBirth || new Date(),
      country: dataValue?.country || '',
      city: dataValue?.city || '',
      about: dataValue?.about || '',
    },
  })

  const { data, error, isLoading } = useGetCountriesListQuery()
  const [getCities, { data: citiesData, isLoading: citiesLoading }] = useGetCitiesListMutation()

  const [startDate, setStartDate] = useState<Date | undefined>(dataValue?.dateOfBirth || new Date())

  const selectedCountry = watch('country')
  const formId = useId()

  useEffect(() => {
    if (selectedCountry) {
      getCities({ country: selectedCountry }).then(() => {
        if (dataValue && dataValue.city) {
          setValue('city', dataValue.city)
        }
      })
    }
  }, [selectedCountry, getCities, dataValue, setValue])

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }))
    }
    return []
  }, [data, isLoading, error])

  const optionsCity = useMemo(() => {
    if (citiesData && !citiesLoading) {
      return citiesData.data.map(city => ({
        label: city,
        value: city,
      }))
    }
    return []
  }, [citiesData, citiesLoading])

  return (
    <div className={s.wrapper}>
      <form className={s.form} id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className={s.inputWrapper}>
          <ControlledInput
            control={control}
            label={'Username'}
            name={'userName'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={'First Name'}
            name={'firstName'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={'Last Name'}
            name={'lastName'}
            trigger={trigger}
            className={s.input}
          />
        </div>
        <ControlledDatePicker
          control={control}
          label={'Date of birth'}
          name={'dateOfBirth'}
          trigger={trigger}
          className={s.datePicker}
          setStartDate={setStartDate}
          startDate={startDate}
        />
        <div className={s.wrapperSelect}>
          <ControlledSelect
            control={control}
            label={'Select your country'}
            name={'country'}
            options={optionsCountry}
            className={s.select}
          />
          <ControlledSelect
            control={control}
            label={'Select your city'}
            name={'city'}
            options={optionsCity}
            disabled={!selectedCountry}
            className={s.select}
          />
        </div>
        <TextArea label={'About Me'} {...register('about')} className={s.textArea} name={'about'} />
        <span className={s.textAreaError}>{errors.about?.message}</span>
        <div className={s.buttonContainer}>
          <Button disabled={!isValid}>Save Change</Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
