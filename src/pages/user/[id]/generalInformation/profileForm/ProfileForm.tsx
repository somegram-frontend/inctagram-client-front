import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { useGetCitiesListMutation, useGetCountriesListQuery } from '@/api/countries-api'
import { useEffect, useId, useMemo, useState } from 'react'
import { ControlledSelect } from '@/components/controlled/ControledSelect'
import { DatePicker } from '@/components/datePicker'
import { format } from 'date-fns'

import s from './profileForm.module.scss'
import { changeGeneralInformationSchema } from '@/shared/utils/loginSchemas'

type Props = {
  onSubmit: (data: FormChangeGeneralInformation) => void
  defaultDataValue?: FormChangeGeneralInformation
}

export type FormChangeGeneralInformation = z.infer<typeof changeGeneralInformationSchema>

const ProfileForm = ({ onSubmit, defaultDataValue }: Props) => {
  const {
    control,
    register,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormChangeGeneralInformation>({
    resolver: zodResolver(changeGeneralInformationSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      about: '',
    },
  })

  const { data, error, isLoading } = useGetCountriesListQuery()
  const [getCities, { data: citiesData, isLoading: citiesLoading }] = useGetCitiesListMutation()

  const [startDate, setStartDate] = useState<Date | undefined>(undefined)

  const selectedCountry = watch('country')
  const formId = useId()

  useEffect(() => {
    if (defaultDataValue) {
      setValue('userName', defaultDataValue.userName)
      setValue('firstName', defaultDataValue.firstName)
      setValue('lastName', defaultDataValue.lastName)
      setValue('country', defaultDataValue.country)
      const setCityValue = async () => {
        await getCities({ country: defaultDataValue.country })
        setValue('city', defaultDataValue.city)
      }
      setCityValue()
      setValue('about', defaultDataValue.about)
      setValue('dateOfBirth', format(defaultDataValue.dateOfBirth, 'dd.MM.yyyy'))
      setStartDate(new Date(defaultDataValue.dateOfBirth))
    }
  }, [defaultDataValue, setValue, getCities])

  useEffect(() => {
    if (selectedCountry) {
      getCities({ country: selectedCountry }).then(() => {
        if (defaultDataValue && defaultDataValue.city) {
          setValue('city', defaultDataValue.city)
        }
      })
    }
  }, [selectedCountry, getCities, defaultDataValue, setValue])

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
        <DatePicker
          label={'Date of birth'}
          setStartDate={date => {
            setStartDate(date)
            setValue('dateOfBirth', date ? format(date, 'dd.MM.yyyy') : '')
          }}
          startDate={startDate}
          errorMessage={errors.dateOfBirth?.message}
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
        <TextArea label={'About Me'} {...register('about')} className={s.textArea} />
        <div className={s.buttonContainer}>
          <Button>Save Change</Button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm
