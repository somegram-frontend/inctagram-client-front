type IconPropsType = {
  width: number
  height: number
  iconId: string
  spriteSrc: string
  fill: string
}

export const SvgIcon: React.FC<IconPropsType> = (props: IconPropsType) => {
  const { width, height, iconId, spriteSrc, fill } = props
  return (
    <svg width={width} height={height}>
      <use href={`${spriteSrc}#${iconId}`} fill={fill} />
    </svg>
  )
}
