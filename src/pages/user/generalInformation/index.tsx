'use client'
import { useForm } from 'react-hook-form'
import s from './generalinformation.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { useGetCitiesListMutation, useGetCountriesListQuery } from '@/api/countries-api'
import { useEffect, useMemo } from 'react'
import { ControlledSelect } from '@/components/controlled/ControledSelect'

const changeGeneralInformationSchema = z.object({
  userName: z
    .string()
    .min(6, { message: 'Minimum 6 characters' })
    .max(30, { message: 'Maximum 30 characters' })
    .refine(value => /^[0-9A-Za-z_\-]+$/.test(value), {
      message: 'Allowed characters: 0-9, A-Z, a-z, _, -',
    }),
  firstName: z
    .string()
    .min(1, { message: 'Minimum 1 character' })
    .max(50, { message: 'Maximum 50 characters' })
    .refine(value => /^[A-Za-zА-Яа-я]+$/.test(value), {
      message: 'Allowed characters: A-Z, a-z, А-Я, а-я',
    }),
  lastName: z
    .string()
    .min(1, { message: 'Minimum 1 character' })
    .max(50, { message: 'Maximum 50 characters' })
    .refine(value => /^[A-Za-zА-Яа-я]+$/.test(value), {
      message: 'Allowed characters: A-Z, a-z, А-Я, а-я',
    }),
  datePicker: z
    .string()
    .min(10, { message: 'Enter the date in the format dd.mm.yyyy' })
    .max(10, { message: 'Enter the date in the format dd.mm.yyyy' })
    .refine(value => /^\d{2}\.\d{2}\.\d{4}$/.test(value), {
      message: 'Invalid date format, use dd.mm.yyyy',
    }),
  country: z.string(),
  city: z.string(),
  aboutMe: z
    .string()
    .max(200, { message: 'Maximum 200 characters' })
    .refine(value => /^[0-9A-Za-zА-Яа-я\s\-_.,!]*$/.test(value), {
      message: 'Allowed characters: 0-9, A-Z, a-z, А-Я, а-я, and special characters',
    }),
});

export type FormChangeGeneralInformation = z.infer<typeof changeGeneralInformationSchema>;

const GeneralInformation = () => {
  const { control, trigger, handleSubmit, setValue, watch } = useForm<FormChangeGeneralInformation>({
    resolver: zodResolver(changeGeneralInformationSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      datePicker: '',
      country: '',
      city: '',
    },
  })

  const onSubmit = (data: FormChangeGeneralInformation) => { }

  const { data, error, isLoading } = useGetCountriesListQuery()
  const [getCities, { data: citiesData, error: citiesError, isLoading: citiesLoading }] = useGetCitiesListMutation()

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }));
    }
    return [];
  }, [data, isLoading, error]);

  const selectedCountry = watch('country')

  useEffect(() => {
    if (selectedCountry) {
      getCities({ country: selectedCountry }); // Передаем значение страны в мутацию
    }
  }, [selectedCountry, getCities]);

  const optionsCity = useMemo(() => {
    if (citiesData && !citiesLoading) {
      return citiesData.data.map(city => ({
        label: city,
        value: city,
      }));
    }
    return [];
  }, [citiesData, citiesLoading]);

  const onChangeCityHandler = async (value: string) => {
    // setValue('city', value)

    trigger()
  }

  const onClickHandler = async () => {
    console.log(optionsCountry)
  }

  return (
    <div className={s.wrapper}>
      <div className={s.uploadPhoto}>photo</div>
      <div className={s.fillProfile}>
        <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
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
          <ControlledSelect
            control={control}
            label={'Select your country'}
            name={'country'}
            options={optionsCountry} />
          <ControlledSelect
            control={control}
            label={'Select your city'}
            name={'city'}
            options={optionsCity}
            disabled={!selectedCountry} />
          <TextArea label={'About Me'} />
          <Button>Save Change</Button>
        </form>
        <Button onClick={onClickHandler}>test</Button>
      </div>
    </div>
  )
}

export default GeneralInformation
