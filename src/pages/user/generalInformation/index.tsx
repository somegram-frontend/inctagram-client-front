'use client'
import { Controller, useForm } from 'react-hook-form'
import s from './generalinformation.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, TextArea } from '@honor-ui/inctagram-ui-kit'
import { ControlledSelect } from '@/components/controlled/ControledSelect'
import countryList from 'react-select-country-list'
import { useGetCountriesListQuery } from '@/api/countries-api'
import { useMemo, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { TestSelect } from './testSelect'

const changeGeneralInformationSchema = z.object({
  userName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  datePicker: z.date().refine(date => date instanceof Date, {
    message: 'Дата рождения обязательна для заполнения',
  }),
  country: z.any(),
  city: z.any(),
})

export type FormChangeGeneralInformation = z.infer<typeof changeGeneralInformationSchema>

const GeneralInformation = () => {
  const { control, trigger, handleSubmit, setValue, watch } = useForm<FormChangeGeneralInformation>({
    resolver: zodResolver(changeGeneralInformationSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      datePicker: new Date(),
      country: '',
      city: '',
    },
  })

  const selectedCountry = watch('country')
  const [countryValue, setCountryValue] = useState('country')

  const onSubmit = (data: FormChangeGeneralInformation) => { }

  const { data, error, isLoading } = useGetCountriesListQuery()

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }));
    }
    return [];
  }, [data, isLoading, error]);

  const onChangeCityHandler = async (value: string) => {
    // setValue('city', value)

    trigger()
  }

  const onClickHandler = async () => {
    console.log(optionsCountry)
    console.log(countryValue)
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
          {/* <input type="date" /> */}
          <Select onValueChange={(value) => setValue('country', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent className={s.dropdownMenu} position='popper'>
              {optionsCountry.map((option, index) => (
                <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TestSelect options={optionsCountry}/>
          <TextArea label={'About Me'} />
          <Button>Save Change</Button>
        </form>
        <Button onClick={onClickHandler}>test</Button>
      </div>
    </div>
  )
}

export default GeneralInformation
