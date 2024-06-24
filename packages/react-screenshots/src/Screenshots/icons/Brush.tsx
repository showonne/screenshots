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

export default function Brush (props: IconProps) {
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
      viewBox='0 0 13 12'
      preserveAspectRatio='xMidYMid meet'
      fill='none'
      role='presentation'
      xmlns='http://www.w3.org/2000/svg'
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g><path data-follow-stroke='currentColor' d='M1.625 10.875V8.708a2.167 2.167 0 1 1 2.167 2.167H1.625Z' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round' stroke={_stroke} /><path data-follow-stroke='currentColor' d='M11.375 1.125A8.667 8.667 0 0 0 4.442 6.65m6.933-5.525A8.667 8.667 0 0 1 5.85 8.058' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round' stroke={_stroke} /><path data-follow-stroke='currentColor' d='M5.742 4.375a4.875 4.875 0 0 1 2.383 2.383' strokeWidth='1.67' strokeLinecap='round' strokeLinejoin='round' stroke={_stroke} /></g>
    </svg>
  )
}
