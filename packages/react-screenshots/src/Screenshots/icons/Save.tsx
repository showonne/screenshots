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

export default function Save (props: IconProps) {
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
      viewBox='0 0 14 14'
      preserveAspectRatio='xMidYMid meet'
      fill='none'
      role='presentation'
      xmlns='http://www.w3.org/2000/svg'
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g><path data-follow-stroke='currentColor' d='M1.667 10.333v1.334A1.333 1.333 0 0 0 3 13h8a1.333 1.333 0 0 0 1.333-1.333v-1.334m-8.666-4L7 9.667m0 0 3.333-3.334M7 9.667v-8' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round' stroke={_stroke} /></g>
    </svg>
  )
}
