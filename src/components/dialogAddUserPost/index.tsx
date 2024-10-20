import { Button, ImageOutline, PlusSquareOutline, Select, TextArea } from '@honor-ui/inctagram-ui-kit'
import { Dialog, DialogContent, DialogTrigger } from '../dialog/Dialog'
import s from './dialogAddUserPost.module.scss'
import style from '../../pages/auth/logOut/logOut.module.scss'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { useAddUserPostsMutation } from '@/api/posts-api'
import { Loader } from '@/components/loader/Loader'
import { PinOutline } from '@honor-ui/inctagram-ui-kit'

const DialogAddUserPost = () => {
    const [sendPost] = useAddUserPostsMutation()
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [photo, setPhoto] = useState('')
    const [error, setError] = useState('')
    const [publicPost, setPublicPost] = useState(false)
    const [description, setDescription] = useState('')

    const uploadHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.files && e.currentTarget.files.length) {
            const file = e.currentTarget.files[0]
            if (file.size > 10000000) {
                setPhoto('')
                setError('Error! Photo size must be less than 10 MB!')
            } else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                setPhoto('')
                setError('Error! The format of the uploaded photo must be PNG and JPEG')
            } else {
                setFile(file)
                setError('')
                const blob = new Blob([file], { type: 'image/jpeg' })
                const downloadUrl = window.URL.createObjectURL(blob)
                setPhoto(downloadUrl)
            }
        }
    }

    const handleCustomButtonClickNext = () => {
        if (file) {
            setPublicPost(true)
        }
    }

    const handleCustomButtonClickBackToPhoto = () => {
        setPhoto('')
    }

    const handleCustomButtonClickBackToCropping = () => {
        setPublicPost(false)
    }

    const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const handleCustomButtonClickPublish = () => {
        if (file) {
            sendPost({ files: [file], description })
            console.log({ files: [file], description })
            setPhoto('')
            setPublicPost(false)
            setDescription('')
            setOpen(false)
        }
    }


    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className={style.triggerButton}>
                    <PlusSquareOutline /> Create
                </DialogTrigger>
                {!photo ? <DialogContent title={'Add Photo'}>
                    <div className={s.uploadPhotoErrorContainer}>
                        {error && <span className={s.uploadPhotoError}>{error}</span>}
                    </div>
                    <div className={s.wrapper}>
                        <div className={s.defaultImageContainer}>
                            <ImageOutline />
                        </div>
                        <label className={s.inputFile}>
                            <input type="file" name='photo_upload' accept='image/*' onChange={uploadHandler} />
                            <div className={s.btnWrapper}>
                                <Button as='span' className={s.PhotoBtn}>
                                    Select from Computer
                                </Button>
                                <Button variant='outlined'>
                                    Open Draft
                                </Button>
                            </div>
                        </label>
                    </div>
                </DialogContent> :
                    <DialogContent
                        customTitle={'Cropping'}
                        customBtn={'Next'}
                        onCustomBtnClickGo={handleCustomButtonClickNext}
                        onCustomBtnClickBack={handleCustomButtonClickBackToPhoto}>
                        <div className={s.wrapper}>
                            <div className={s.photoContainer}>
                                <Image src={photo} className={s.photo} alt="" width={492} height={504} />
                            </div>
                        </div>
                    </DialogContent>
                }
                {publicPost
                    ?
                    (<DialogContent
                        customTitle={'Publication'}
                        customBtn={'Publish'}
                        onCustomBtnClickGo={handleCustomButtonClickPublish}
                        onCustomBtnClickBack={handleCustomButtonClickBackToCropping}>
                        <div className={s.publicWrapper}>
                            <div className={s.photoContainer}>
                                <Image src={photo} className={s.photo} alt="" width={492} height={504} />
                            </div>
                            <div>
                                <TextArea
                                    label={'Add publication descriptions'}
                                    name={'descriptions'}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                                <div className={s.selectWrapper}>
                                    <Select label={'Add location'} name={'location'} options={[]} className={s.select} />
                                    <span className={s.customArrow}>
                                        <PinOutline /> {/* Вставляем иконку */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </DialogContent>)
                    :
                    ''}
            </Dialog>
        </div >
    )
}

export default DialogAddUserPost

