'use client'
import { Controller, useForm } from 'react-hook-form'
import s from './generalinformation.module.scss'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ControlledInput } from '@/components/controlled/ControlledInput'
import { Button, Select, TextArea } from '@honor-ui/inctagram-ui-kit'
import { ControlledSelect } from '@/components/controlled/ControledSelect'
import countryList from 'react-select-country-list'
import { useGetCountriesListQuery } from '@/api/countries-api'
import { useMemo } from 'react'

const changeGeneralInformationSchema = z.object({
  userName: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  firstName: z.string().nonempty({ message: 'Имя обязательно для заполнения' }),
  lastName: z.string().nonempty({ message: 'Фамилия обязательна для заполнения' }),
  datePicker: z.date().refine(date => date instanceof Date, {
    message: 'Дата рождения обязательна для заполнения',
  }),
  country: z.any(),
  city: z.any(),
})

export type FormChangeGeneralInformation = z.infer<typeof changeGeneralInformationSchema>

const GeneralInformation = () => {
  const { control, trigger, handleSubmit } = useForm<FormChangeGeneralInformation>({
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



  const onSubmit = (data: FormChangeGeneralInformation) => { }

  const { data, error, isLoading } = useGetCountriesListQuery()

  const optionsCountrys = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country, // или используйте код страны, если он доступен
      }));
    }
    return [];
  }, [data, isLoading, error]);

  const onChangeCityHandler = async (value: string) => {
    // setValue('city', value)

    trigger()
  }

  const onClickHandler = async () => {
    console.log(optionsCountrys)
  }

  const optionsCountry = [{ label: 'Беларусь', value: 'BY' }]

  const optionsCity = [
    { label: 'Минск', value: 'Minsk' },
    { label: 'Гомель', value: 'Gomel' },
    { label: 'Могилев', value: 'Mogilev' },
    { label: 'Витебск', value: 'Vitebsk' },
    { label: 'Гродно', value: 'Grodno' },
    { label: 'Брест', value: 'Brest' },
    { label: 'Барановичи', value: 'Baranovichi' },
    { label: 'Бобруйск', value: 'Bobruisk' },
    { label: 'Орша', value: 'Orsha' },
    { label: 'Слуцк', value: 'Slutsk' },
    { label: 'Пинск', value: 'Pinsk' },
  ]





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
          {/* <Controller
                        control={control}
                        name="datePicker"
                        render={({ field: { onChange, value } }) => {
                            console.log('datePicker')
                            return (
                                <DatePicker
                                setStartDate={onChange}
                                startDate={value}
                                label="Дата рождения"
                            />
                            )
                        }}/> */}
          {/* <DatePicker
                                setStartDate={() => new Date()}
                                startDate={new Date()}
                                label="Дата рождения"
                            /> */}
          <input type="date" />
          <ControlledSelect
            label={'Select your country'}
            name={'country'}
            options={optionsCountrys}
            control={control}
            onValueChange={onChangeCityHandler}
            placeholder={'Country'}
          />
          {/* <ControlledSelect
            label={'Select your city'}
            name={'city'}
            options={optionsCity}
            control={control}
            onValueChange={onChangeCityHandler}
            placeholder={'City'}
          /> */}
          <TextArea label={'About Me'} />
          <Button>Save Change</Button>
        </form>
        <Button onClick={onClickHandler}>test</Button>
      </div>
    </div>
  )
}

export default GeneralInformation
