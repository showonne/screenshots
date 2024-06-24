import React from 'react'
import { Popover, PopoverProps } from 'antd'
import useStore from './hooks/useStore'

export function CommonPopover ({ open, ...props }: PopoverProps) {
  const { mode } = useStore()

  return (
    <Popover
      open={mode === 'editor' ? false : open}
      placement='bottom'
      overlayClassName='operation-popover-overlay'
      {...props}
    >
      {props.children}
    </Popover>
  )
}
