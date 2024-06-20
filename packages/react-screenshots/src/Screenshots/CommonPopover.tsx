import React from 'react'
import { Popover, PopoverProps } from 'antd'

export function CommonPopover (props: PopoverProps) {
  return (
    <Popover
      placement='bottom'
      overlayClassName='operation-popover-overlay'
      {...props}
    >
      {props.children}
    </Popover>
  )
}
