import React, { useEffect, useRef } from 'react'
import styles from './style.module.css'
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    width?: string | number;
    height?: string | number;
    spin?: boolean;
    rtl?: boolean;
    color?: string;
    fill?: string;
    stroke?: string;
}

export default function Undo (props: IconProps) {
  const root = useRef<SVGSVGElement>(null)
  const { size = '1em', width, height, spin, rtl, color, fill, stroke, className, ...rest } = props
  const _width = width || size
  const _height = height || size
  const _stroke = stroke || color
  const _fill = fill || color
  useEffect(() => {
    if (!_fill) {
      (root.current as SVGSVGElement)?.querySelectorAll('[data-follow-fill]').forEach(item => {
        item.setAttribute('fill', item.getAttribute('data-follow-fill') || '')
      })
    }
    if (!_stroke) {
      (root.current as SVGSVGElement)?.querySelectorAll('[data-follow-stroke]').forEach(item => {
        item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '')
      })
    }
  }, [stroke, color, fill])
  return (
    <svg
      ref={root}
      width={_width}
      height={_height}
      viewBox='0 0 14 10'
      preserveAspectRatio='xMidYMid meet'
      fill='none'
      role='presentation'
      xmlns='http://www.w3.org/2000/svg'
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g><path data-follow-fill='currentColor' d='M.612 4.335 4.407.268a.837.837 0 0 1 .44-.251.794.794 0 0 1 .493.056.878.878 0 0 1 .383.343 1 1 0 0 1 .143.517v2.046c1.714.145 3.353.817 4.728 1.938 1.375 1.122 2.428 2.646 3.037 4.394a.202.202 0 0 1 .003.113.188.188 0 0 1-.058.095.16.16 0 0 1-.198.012c-2.27-1.506-4.855-2.362-7.512-2.484v2.02c0 .184-.05.364-.143.517a.876.876 0 0 1-.383.343.793.793 0 0 1-.493.056.837.837 0 0 1-.44-.251L.612 5.665a.942.942 0 0 1-.189-.305 1.008 1.008 0 0 1 0-.72.944.944 0 0 1 .189-.305Z' fill={_fill} /></g>
    </svg>
  )
}
