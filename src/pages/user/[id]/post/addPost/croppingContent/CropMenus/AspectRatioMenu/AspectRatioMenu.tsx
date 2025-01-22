import { ImageOutline } from '@honor-ui/inctagram-ui-kit'
import type { Image } from '../../..'
import s from './aspectRatioMenu.module.scss'

type AspectRatioMenuProps = {
  onUpdateImage: (updatedImage: Image) => void
  activeImage: Image
}

const AspectRatioMenu = (props: AspectRatioMenuProps) => {
  const { onUpdateImage, activeImage } = props

  const JSXbuttons = [
    <button key={'default'} onClick={() => resize(onUpdateImage, activeImage, 'default')}>
      Оригинал
      <ImageOutline />
    </button>,
  ].concat(
    dimentions.map(dimention => {
      return (
        <button
          key={dimention}
          className={dimentionClassNamesMap[dimention]}
          onClick={() => resize(onUpdateImage, activeImage, dimention)}
        >
          {dimention}
        </button>
      )
    })
  )

  return <div className={s.aspectRatioMenuContainer}>{JSXbuttons}</div>
}

const dimentions = ['1:1', '4:5', '16:9']
const [oneToOne, fourToFive, sixteenToNine] = dimentions

const dimentionsMap = dimentions.reduce(
  (acc, dimention) => {
    const [width, height] = dimention.split(':').map(Number)
    acc[dimention] = { width, height }
    return acc
  },
  {} as { [key: string]: { width: number; height: number } }
)

const dimentionClassNamesMap = {
  [oneToOne]: s.oneToOne,
  [fourToFive]: s.fourToFive,
  [sixteenToNine]: s.sixteenToNine,
}

const getAspectRatio = (ratio: string) => {
  return dimentionsMap[ratio] ?? {}
}

const resize = (
  onUpdateImage: (updatedImage: Image) => void,
  activeImage: Image,
  ratio: string
) => {
  const { url } = activeImage
  const { width, height } = getAspectRatio(ratio)

  if (!width && !height) {
    if (activeImage.croppedUrl) {
      URL.revokeObjectURL(activeImage.croppedUrl)
    }
    onUpdateImage({ ...activeImage, croppedUrl: undefined })
    return
  }

  const img = new Image()
  img.src = url

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!

    const [imgWidth, imgHeight] = [img.width, img.height]

    const cropWidth = Math.min(imgWidth, imgHeight * (width / height))
    const cropHeight = Math.min(imgHeight, imgWidth * (height / width))

    const cropX = (imgWidth - cropWidth) / 2
    const cropY = (imgHeight - cropHeight) / 2

    ;[canvas.width, canvas.height] = [cropWidth, cropHeight]

    context.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

    context.canvas.toBlob(blob => {
      const croppedUrl = URL.createObjectURL(blob!)
      onUpdateImage({ ...activeImage, croppedUrl })
    }, 'image/jpeg')
  }
}

export default AspectRatioMenu
