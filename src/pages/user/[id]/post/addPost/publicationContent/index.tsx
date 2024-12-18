import React from 'react'
import s from './publicationContent.module.scss'
import PhotoSlider from '../../../../../../components/photoSlider'
import Image from 'next/image'
import {PinOutline, Select, TextArea, Typography} from '@honor-ui/inctagram-ui-kit'
import {GetProfileSuccess} from '@/api/user/users-api.types'

interface Country {
  label: string
  value: string
}

type Props = {
  images: string[]
  profileInfo: GetProfileSuccess
  description: string
  setDescription: (value: string) => void
  MAX_CHARS: number
  optionsCountry: Country[]
  filter?: string
}

const PublicationContent: React.FC<Props> = ({
                                               images,
                                               profileInfo,
                                               description,
                                               setDescription,
                                               MAX_CHARS,
                                               optionsCountry,
                                               filter
                                             }) => {
  return (
    <>
      <div className={s.publicWrapper}>
        <PhotoSlider images={images} appliedFilter={filter}/>
        <div className={s.descriptionContainer}>
          <div className={s.userWrapper}>
            <Image
              src={profileInfo.avatar.url || ''}
              className={s.avatar}
              alt=""
              width={36}
              height={36}
            />
            <Typography as={'p'} variant={'bold_text16'} className={s.username}>
              {profileInfo.userName}
            </Typography>
          </div>
          <div className={s.textAreaWrapper}>
            <TextArea
              label={'Add publication descriptions'}
              name={'descriptions'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={MAX_CHARS}
            />
            <Typography variant={'small_text'} className={s.counter}>
              {description.length}/{MAX_CHARS}
            </Typography>
          </div>
          <hr className={s.line}/>
          <div className={s.selectWrapper}>
            <Select label={'Add location'} name={'location'} options={optionsCountry}/>
            <span className={s.customArrow}>
              <PinOutline/>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default PublicationContent
