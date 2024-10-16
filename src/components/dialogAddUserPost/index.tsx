import { Button, ImageOutline, PlusSquareOutline } from '@honor-ui/inctagram-ui-kit'
import { Dialog, DialogContent, DialogTrigger } from '../dialog/Dialog'
import s from './dialogAddUserPost.module.scss'
import style from '../../pages/auth/logOut/logOut.module.scss'
import { ChangeEvent, useState } from 'react'
import Image from 'next/image'
import { useAddPhotoForPostMutation } from '@/api/posts-api'
import { Loader } from '@/components/loader/Loader'

const DialogAddUserPost = () => {
    const [uploadPhoto, { isLoading }] = useAddPhotoForPostMutation()
    const [file, setFile] = useState<File | null>(null)
    const [photo, setPhoto] = useState('')
    const [error, setError] = useState('')

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

    const handleCustomButtonClickGo = () => {
        if (file) {
            uploadPhoto({ file })
        }
    }

    const handleCustomButtonClickBack = () => {
        setPhoto('')
    }

    return (
        <div>
            <Dialog>
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
                    <DialogContent customTitle={'Cropping'} customBtn={'Next'} onCustomBtnClickGo={handleCustomButtonClickGo} onCustomBtnClickBack={handleCustomButtonClickBack}>
                        <div className={s.wrapper}>
                            {isLoading
                                ?
                                (<div className={s.loader}>
                                    <Loader />
                                </div>)
                                :
                                (<div className={s.photoContainer}>
                                    <Image src={photo} className={s.photo} alt="" width={492} height={504} />
                                </div>)}
                        </div>
                    </DialogContent>
                }
            </Dialog>
        </div >
    )
}

export default DialogAddUserPost

