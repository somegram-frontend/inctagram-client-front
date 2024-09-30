import { type Ref, type SVGProps, forwardRef, memo } from 'react'

const SvgChevronRight = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    fill={'currentColor'}
    height={10}
    ref={ref}
    width={7}
    xmlns={'http://www.w3.org/2000/svg'}
    {...props}
  >
    <path d={'M2 10 .938 8.938 4.875 5 .938 1.062 2 0l5 5z'} fill={'currentColor'} />
  </svg>
)
const ForwardRef = forwardRef(SvgChevronRight)
const Memo = memo(ForwardRef)

export default Memo
