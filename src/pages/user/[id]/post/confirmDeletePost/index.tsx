import React from 'react'
import { Button } from '@honor-ui/inctagram-ui-kit'
import s from './ConfirmDeletePost.module.scss'

type ConfirmDeletePostProps = {
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDeletePost: React.FC<ConfirmDeletePostProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className={s.modalOverlay}>
      <div className={s.modalContainer}>
        <div className={s.deletePostAndExit}>
          <div>Delete Post</div>
          <button style={{ cursor: 'pointer' }} onClick={onCancel}>
            X
          </button>
        </div>

        <div className={s.textSure}>Are you sure you want to delete this post?</div>

        <div className={s.modalButtons}>
          <Button onClick={onConfirm}>Yes</Button>
          <Button onClick={onCancel}>No</Button>
        </div>
      </div>
    </div>
  )
}
