import { Button, ImageOutline, PlusSquareOutline } from '@honor-ui/inctagram-ui-kit'
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../dialog/Dialog'
import s from './dialogAddUserPost.module.scss'
import style from '../../pages/auth/logOut/logOut.module.scss'
import { ChangeEvent, FormEvent, useState } from 'react'
import Image from 'next/image'
import { useAddPhotoForPostMutation } from '@/api/posts-api'

const DialogAddUserPost = () => {
    const [uploadPhoto, { isLoading }] = useAddPhotoForPostMutation()
    const [file, setFile] = useState<File | null>(null)
    const [photo, setPhoto] = useState('')
    const [error, setError] = useState('')

    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!photo) {
            return
        }
        if (file) {
            uploadPhoto({ file })
        }
    }

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

    return (
        <div>
            <Dialog>
                <DialogTrigger className={style.triggerButton}>
                    <PlusSquareOutline /> Create
                </DialogTrigger>
                <DialogContent customTitle={'as'}>
                    <div className={s.wrapper}>
                        {photo ? (
                            <div className={s.photoContainer}>
                                <Image src={photo} className={s.photo} alt="" width={492} height={504} />
                            </div>
                        ) : (
                            <div className={s.defaultImageContainer}>
                                <ImageOutline />
                            </div>
                        )}
                        <form onSubmit={submitHandler}>
                            <label className={s.inputFile}>
                                <input type="file" name='photo_upload' accept='image/*' onChange={uploadHandler} />
                                {!photo ? <div className={s.btnWrapper}>
                                    <Button as='span' className={s.PhotoBtn}>
                                        Select from Computer
                                    </Button>
                                    <Button type='submit' variant='outlined'>
                                        Open Draft
                                    </Button>
                                </div>
                                    :
                                    <Button>save</Button>
                                }
                            </label>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default DialogAddUserPost

