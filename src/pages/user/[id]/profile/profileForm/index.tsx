import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { useEffect, useId, useMemo, useState } from 'react'
import { ControlledSelect } from '@/components/controlled/ControlledSelect'
import s from './profileForm.module.scss'
import { changeProfileSchema } from '@/shared/const/validationSchemas'
import { UserProfile } from '@/api/user/users-api.types'
import { ControlledDatePicker } from '@/components/controlled/ControlledDatePicker'
import { Loader } from '@/components/loader'
import { useTranslation } from '@/shared/hooks'
import { useGetCitiesListQuery, useGetCountriesListQuery } from '@/api/countries/countries-api'
import { City } from '@/api/countries/countries-api.type'

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
    formState: { errors },
  } = useForm<UserProfile>({
    resolver: zodResolver(changeProfileSchema),
    defaultValues: {
      userName: dataValue?.userName || '',
      firstName: dataValue?.firstName || '',
      lastName: dataValue?.lastName || '',
      dateOfBirth: dataValue?.dateOfBirth || '',
      country: dataValue?.country ?? '',
      city: dataValue?.city ?? '',
      about: dataValue?.about || '',
    },
  })

  const [startDate, setStartDate] = useState<Date | undefined>(
    dataValue?.dateOfBirth ? new Date(dataValue.dateOfBirth) : undefined,
  )
  const [countryId, setCountryId] = useState('')

  const t = useTranslation('generalInformation')

  const { data: countries, error, isLoading } = useGetCountriesListQuery()
  const {
    data: cities,
    error: citiesError,
    isLoading: citiesLoading,
  } = useGetCitiesListQuery(countryId, {
    skip: !countryId,
  })

  const setDatePicker = (d: Date | undefined) => {
    setStartDate(d || new Date())
  }

  const selectedCountry = watch('country')
  const formId = useId()

  useEffect(() => {
    const countryId = countries?.find((c: any) => c.name === selectedCountry)?.id
    if(countryId){
      setCountryId(countryId)
    }
  }, [selectedCountry]);

  const optionsCountry = useMemo(() => {
    if (Array.isArray(countries) && !isLoading && !error) {
      return countries.map((country: any) => ({
        label: country.name,
        value: country.name,
      }))
    }
    return []
  }, [countries, isLoading, error])

  const optionsCity = useMemo(() => {
    if (cities && !citiesLoading) {
      return cities.map((city: City) => ({
        label: city.name.toString(),
        value: city.name.toString(),
      }))
    }
    return []
  }, [cities, citiesLoading])

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
            label={t.username}
            name={'userName'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={t.firstName}
            name={'firstName'}
            trigger={trigger}
            className={s.input}
          />
          <ControlledInput
            control={control}
            label={t.lastName}
            name={'lastName'}
            trigger={trigger}
            className={s.input}
          />
        </div>
        <ControlledDatePicker
          control={control}
          label={t.dateOfBirth}
          name={'dateOfBirth'}
          trigger={trigger}
          className={s.datePicker}
          setStartDate={setDatePicker}
          startDate={startDate}
        />
        <div className={s.wrapperSelect}>
          <ControlledSelect
            control={control}
            label={t.selectYourCountry}
            name={'country'}
            options={optionsCountry}
            className={s.select}
          />
          <ControlledSelect
            control={control}
            label={t.selectYourCity}
            name={'city'}
            options={optionsCity}
            disabled={citiesLoading || !selectedCountry}
            className={s.select}
          />
        </div>
        <TextArea label={t.aboutMe} {...register('about')} className={s.textArea} name={'about'} />
        <span className={s.textAreaError}>{errors.about?.message}</span>
        <div className={s.buttonContainer}>
          <Button disabled={!!Object.keys(errors).length}>{t.saveChanges}</Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
