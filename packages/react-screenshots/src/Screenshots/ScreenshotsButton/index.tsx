import React, {
  memo,
  ReactElement,
  PointerEvent,
  ReactNode,
  useCallback,
  useMemo,
  FC
} from 'react'
import './index.less'
import { ArrowIcon as Arrow, BrushIcon as Brush, CancelIcon as Cancel, EllipseIcon as Ellipse, MosaicIcon as Mosaic, OkIcon as Ok, RectangleIcon as Rectangle, RedoIcon as Redo, SaveIcon as Save, UndoIcon as Undo, TextIcon as Text } from '../icons'

const ICONS_MAP = {
  Rectangle,
  Arrow,
  Ellipse,
  Mosaic,
  Ok,
  Redo,
  Undo,
  Save,
  Text,
  Brush,
  Cancel
}
export interface ScreenshotsButtonProps {
  title: string;
  icon: string;
  checked?: boolean;
  disabled?: boolean;
  option?: ReactNode;
  onClick?: (e: PointerEvent<HTMLDivElement>) => unknown;
  size?: number
}

export default memo(function ScreenshotsButton ({
  title,
  icon,
  checked,
  disabled,
  option,
  onClick,
  size = 14
}: ScreenshotsButtonProps): ReactElement {
  const classNames = ['screenshots-button']

  const onButtonClick = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (disabled || !onClick) {
        return
      }
      onClick(e)
    },
    [disabled, onClick]
  )

  if (checked) {
    classNames.push('screenshots-button-checked')
  }
  if (disabled) {
    classNames.push('screenshots-button-disabled')
  }

  const Icon: FC<any> = ICONS_MAP[icon as (keyof typeof ICONS_MAP)]

  const color = useMemo(() => {
    return disabled ? 'rgba(183, 189, 198, 1)' : 'rgba(132, 142, 156, 1)'
  }, [disabled])

  return (
    // <ScreenshotsOption open={checked} content={option}>
    <div
      className={classNames.join(' ')}
      title={title}
      onClick={onButtonClick}
    >
      <Icon size={size} color={color} />
    </div>
    // </ScreenshotsOption>
  )
})
