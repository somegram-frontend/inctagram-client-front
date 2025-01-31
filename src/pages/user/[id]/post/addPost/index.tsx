import {PlusSquareOutline} from '@honor-ui/inctagram-ui-kit'
import {Dialog, DialogContent, DialogTrigger} from '@/components/dialog'
import style from '@/pages/auth/logOut/logOut.module.scss'
import {ChangeEvent, useMemo, useState} from 'react'
import {useAddUserPostsMutation} from '@/api/post/posts-api'
import {useGetProfileQuery} from '@/api/user/users-api'
import {useGetCountriesListQuery} from '@/api/countries/countries-api'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import {toast} from 'react-toastify'
import AddPhotoContent from './addPhotoContent'
import CroppingContent from './croppingContent'
import PublicationContent from './publicationContent'
import CloseContent from './closeContent'
import {Loader} from '@/components/loader'
import {MAX_POST_IMGE_SIZE_20MB} from '@/shared/const/sizes'
import {useTranslation} from "@/shared/hooks";

type Props = {
  setIsActiveCreate: (isActiveCreate: boolean) => void
}

export type Image = {
  url: string
  croppedUrl: string | undefined
  filter: string | undefined
}

const getImageUrls = (images: Array<Image>) => {
  return images.map(({url, croppedUrl}) => croppedUrl ?? url)
}

const DialogAddUserPost = ({setIsActiveCreate}: Props) => {
  const [
    sendPost,
    {isLoading: isCreateLoading, isSuccess: isCreateSuccess, isError: isCreateError, reset},
  ] = useAddUserPostsMutation()
  const {data: profileInfo} = useGetProfileQuery()
  const {data, error, isLoading} = useGetCountriesListQuery()

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)
  const [errorUpload, setErrorUpload] = useState('')
  const [publicPost, setPublicPost] = useState(false)
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<Array<Image>>([])
  const t = useTranslation()

  const MAX_CHARS = 500

  const optionsCountry = useMemo(() => {
    if (data && !isLoading && !error) {
      return data.data.map(country => ({
        label: country.country,
        value: country.country,
      }))
    }
    return []
  }, [data, isLoading, error])

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.currentTarget.files
    if (uploadedFiles) {
      const newFiles = Array.from(uploadedFiles)
      validateFiles(newFiles)
    }
  }

  const validateFiles = (uploadedFiles: File[]) => {
    const validFiles: File[] = []
    for (const file of uploadedFiles) {
      if (file.size > MAX_POST_IMGE_SIZE_20MB) {
        resetFile('The photo must be less than 20 Mb and have JPEG or PNG format')
        return
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        resetFile('Error! The format of the uploaded photo must be PNG or JPEG')
        return
      }
      validFiles.push(file)
    }
    setImages(prevImages => [
      ...prevImages,
      ...validFiles.map(file => {
        return {url: URL.createObjectURL(file), croppedUrl: undefined, filter: undefined}
      }),
    ])
    setErrorUpload('')
  }

  const resetFile = (errorMessage: string) => {
    setImages([])
    setErrorUpload(errorMessage)
  }

  const handlePublish = async () => {
    if (images.length > 0) {
      const imagePromises = images.map(({url, croppedUrl}, idx) => {
        return fetch(croppedUrl ?? url)
          .then(response => response.blob())
          .then(blob => {
            return new File([blob], `image${idx}`, {type: blob.type})
          })
      })
      try {
        const files = await Promise.all(imagePromises)
        await sendPost({files, description}).unwrap()
        images.forEach(({url, croppedUrl}) => {
          URL.revokeObjectURL(url)
          if (croppedUrl) {
            URL.revokeObjectURL(croppedUrl)
          }
        })
        resetPostState()
      } catch (e) {
      }
    }
  }

  const resetPostState = () => {
    setImages([])
    setPublicPost(false)
    setDescription('')
    setIsFirstModalOpen(false)
    setIsActiveCreate(false)
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const updateImage = (imageIdx: number, updatedImage: Image) => {
    setImages(images.map((img, idx) => (imageIdx === idx ? updatedImage : img)))
  }

  const handleCloseFirstModal = () => {
    setIsFirstModalOpen(false)
    setIsActiveCreate(false)
    setIsSecondModalOpen(false)
  }

  const handleReturnToFirstModal = () => {
    setIsSecondModalOpen(false)
  }

  const handleFirstModalOpenChange = (isFirstModalOpen: boolean) => {
    if (!isFirstModalOpen) {
      setIsSecondModalOpen(true)
      return
    }
    setIsFirstModalOpen(isFirstModalOpen)
    setIsActiveCreate(true)
  }

  const handleCustomBtnClickBack = () => {
    setIsSecondModalOpen(true)
  }

  const imageUrls = getImageUrls(images)

  if (isCreateLoading) return <Loader/>
  if (isCreateSuccess && !toast.isActive('toast-id')) {
    toast.success('Successfully published', {toastId: 'toast-id'})
    reset()
  }
  if (isCreateError) {
    toast.error('Publish failed')
  }
  return (
    <div>
      <Dialog open={isFirstModalOpen} onOpenChange={handleFirstModalOpenChange}>
        <DialogTrigger className={style.triggerButton}>
          <PlusSquareOutline/> {t.create}
        </DialogTrigger>
        {images.length === 0 ? (
          <DialogContent title={'Add Photo'}>
            <AddPhotoContent errorUpload={errorUpload} handleUpload={handleUpload}/>
          </DialogContent>
        ) : (
          <DialogContent
            customTitle={'Cropping'}
            customBtn={'Next'}
            onCustomBtnClickGo={() => setPublicPost(true)}
            onCustomBtnClickBack={handleCustomBtnClickBack}
          >
            <CroppingContent
              images={images}
              handleUpload={handleUpload}
              removeImage={removeImage}
              onUpdateImage={updateImage}
              getImageUrls={getImageUrls}
            />
          </DialogContent>
        )}
        {publicPost && profileInfo && (
          <DialogContent
            customTitle={'Publication'}
            customBtn={'Publish'}
            onCustomBtnClickGo={handlePublish}
            onCustomBtnClickBack={() => setPublicPost(false)}
          >
            <PublicationContent
              MAX_CHARS={MAX_CHARS}
              description={description}
              images={imageUrls}
              optionsCountry={optionsCountry}
              profileInfo={profileInfo}
              setDescription={setDescription}
            />
          </DialogContent>
        )}
      </Dialog>
      <Dialog open={isSecondModalOpen} onOpenChange={setIsSecondModalOpen}>
        <DialogContent title={'Close'}>
          <CloseContent
            handleCloseFirstModal={handleCloseFirstModal}
            handleReturnToFirstModal={handleReturnToFirstModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DialogAddUserPost
