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
import Rectangle from '../icons/Rectangle'
import Arrow from '../icons/Arrow'
import Ellipse from '../icons/Ellipse'
import Mosaic from '../icons/Mosaic'
import Ok from '../icons/Ok'
import Redo from '../icons/Redo'
import Undo from '../icons/Undo'
import Save from '../icons/Save'
import Text from '../icons/Text'
import Brush from '../icons/Brush'
import Cancel from '../icons/Cancel'

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
}

export default memo(function ScreenshotsButton ({
  title,
  icon,
  checked,
  disabled,
  option,
  onClick
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

  const onColorChange = () => {
    // globalEvents.emit('update:color', color)
  }
  console.log(option)

  return (
    // <ScreenshotsOption open={checked} content={option}>
    <div
      className={classNames.join(' ')}
      title={title}
      onClick={onButtonClick}
    >
      <Icon size={14} color={color} />
    </div>
    // </ScreenshotsOption>
  )
})
