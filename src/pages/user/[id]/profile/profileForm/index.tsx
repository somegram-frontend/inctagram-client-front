import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { useGetCitiesListMutation, useGetCountriesListQuery } from '@/api/countries/countries-api'
import { useEffect, useId, useMemo, useState } from 'react'
import { ControlledSelect } from '@/components/controlled/ControlledSelect'
import s from './profileForm.module.scss'
import { changeProfileSchema } from '@/shared/const/validationSchemas'
import { UserProfile } from '@/api/user/users-api.types'
import { ControlledDatePicker } from '@/components/controlled/ControlledDatePicker'
import { Loader } from '@/components/loader'

type Props = {
  isLoadingUpdate: boolean
  onSubmit: (data: UserProfile) => void
  dataValue?: UserProfile
}

const ProfileForm = ({ onSubmit, dataValue, isLoadingUpdate }: Props) => {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: zodResolver(changeProfileSchema),
    defaultValues: {
      userName: dataValue?.userName || '',
      firstName: dataValue?.firstName || '',
      lastName: dataValue?.lastName || '',
      dateOfBirth: dataValue?.dateOfBirth || '',
      country: dataValue?.country || '',
      city: dataValue?.city || '',
      about: dataValue?.about || '',
    },
  })

  const { data, error, isLoading } = useGetCountriesListQuery()
  const [getCities, { data: citiesData, isLoading: citiesLoading }] = useGetCitiesListMutation()
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(dataValue!.dateOfBirth))
  const setDatePicker = (d: Date | undefined) => {
    setStartDate(d || new Date())
  }

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

  if (isLoadingUpdate)
    return (
      <div className={s.loader}>
        <Loader />
      </div>
    )

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
          setStartDate={setDatePicker}
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
          <Button disabled={!!Object.keys(errors).length}>Save Change</Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
