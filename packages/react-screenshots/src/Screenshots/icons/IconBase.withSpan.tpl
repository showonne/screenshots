import React, { useEffect, useRef } from 'react';
interface IconProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
    size?: string | number;
    width?: string | number;
    height?: string | number;
    spin?: boolean;
    rtl?: boolean;
    color?: string;
    fill?: string;
    stroke?: string;
}

export default function <%-PascalIconName%>(props: IconProps) {
    const root = useRef<SVGSVGElement>(null)
    const { size = '1em', width, height, spin, rtl, color, fill, stroke, className, ...rest } = props;
    const _width = width || size;
    const _height = height || size;
    const _stroke = stroke || color;
    const _fill = fill || color;
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
    const cls = [
      'i-icon',
      'i-icon-<%-iconCompKebabName%>',
      spin ? 'i-icon-spin' : '',
      rtl ? 'i-icon-rtl' : '',
      className,
    ].filter(Boolean)
    return (
      <span
        {...rest}
        className={cls.join(' ')}
      >
        <svg
          ref={root}
          width={_width} 
          height={_height}
          viewBox="<%-iconViewBox%>"
          preserveAspectRatio="xMidYMid meet"
          fill="<%-iconFill%>"
          role="presentation"
          xmlns="http://www.w3.org/2000/svg"
        >
          <%-iconSourceTpl%>
        </svg>
      </span>
    )
}
