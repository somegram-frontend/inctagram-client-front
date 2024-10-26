import s from './addPhotoContent.module.scss'
import style from '../dialogAddUserPost.module.scss'
import { Button, ImageOutline } from '@honor-ui/inctagram-ui-kit'

type Props = {
  errorUpload: string
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AddPhotoContent: React.FC<Props> = ({ errorUpload, handleUpload }) => {
  return (
    <>
      <div className={s.uploadPhotoErrorContainer}>
        {errorUpload && <span className={s.uploadPhotoError}>{errorUpload}</span>}
      </div>
      <div className={s.wrapper}>
        <div className={s.defaultImageContainer}>
          <ImageOutline />
        </div>
        <label className={style.inputFile}>
          <input
            type="file"
            name="photo_upload"
            accept="image/*"
            onChange={handleUpload}
            multiple
          />
          <div className={style.btnWrapper}>
            <Button as="span" className={s.btn}>
              Select from Computer
            </Button>
            <Button variant="outlined">Open Draft</Button>
          </div>
        </label>
      </div>
    </>
  )
}

export default AddPhotoContent
