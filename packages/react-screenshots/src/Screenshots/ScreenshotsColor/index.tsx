import React, { memo, ReactElement } from 'react'
import './index.less'

export interface ColorProps {
  value: string
  onChange: (value: string) => void
}

export default memo(function ScreenshotsColor ({ value, onChange }: ColorProps): ReactElement {
  const colors = ['#F84135', '#FFC814', '#01BC6A', '#056FFA', '#FFF', '#848E9C', '#000000']
  return (
    <div className='screenshots-color'>
      {colors.map(color => {
        const classNames = ['screenshots-color-item']
        if (color === value) {
          classNames.push('screenshots-color-active')
        }
        return (
          <div
            key={color}
            className={classNames.join(' ')}
            style={{ backgroundColor: color }}
            onClick={() => onChange && onChange(color)}
          />
        )
      })}
    </div>
  )
})
