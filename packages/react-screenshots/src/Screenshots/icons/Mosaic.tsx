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

export default function Mosaic (props: IconProps) {
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
      <g><path data-follow-stroke='currentColor' d='M3 1 1 3m12 8-2 2M6.333 1 1 6.333M9.667 1 1 9.667M13 1 1 13m12-8.667L4.333 13M13 7.667 7.667 13' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round' stroke={_stroke} /></g>
    </svg>
  )
}
