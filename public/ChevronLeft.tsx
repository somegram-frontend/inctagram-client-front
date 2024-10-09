import { type Ref, type SVGProps, forwardRef, memo } from 'react'

const SvgChevronLeft = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    fill={'currentColor'}
    height={10}
    ref={ref}
    width={7}
    xmlns={'http://www.w3.org/2000/svg'}
    {...props}
  >
    <path d={'M5 10 0 5l5-5 1.062 1.062L2.125 5l3.937 3.938z'} fill={'currentColor'} />
  </svg>
)
const ForwardRef = forwardRef(SvgChevronLeft)
const Memo = memo(ForwardRef)

export default Memo
