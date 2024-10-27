import { Button, Typography } from '@honor-ui/inctagram-ui-kit'
import s from './closeContent.module.scss'

type Props = {
  handleReturnToFirstModal: () => void
  handleCloseFirstModal: () => void
}

const CloseContent: React.FC<Props> = ({ handleReturnToFirstModal, handleCloseFirstModal }) => {
  return (
    <>
      <div className={s.secondModalWrapper}>
        <Typography variant="regular_text14" className={s.closeTypography}>
          Do you really want to close the creation of a publication ?
          <br />
          If you close everything will be delete
        </Typography>
        <div className={s.modalBtnWrapper}>
          <Button onClick={handleReturnToFirstModal} variant="outlined">
            Discard
          </Button>
          <Button onClick={handleCloseFirstModal}>Save draft</Button>
        </div>
      </div>
    </>
  )
}

export default CloseContent
