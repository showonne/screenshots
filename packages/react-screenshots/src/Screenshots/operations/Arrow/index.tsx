import React, { ReactElement, useCallback, useRef, useState } from 'react'
import ScreenshotsButton from '../../ScreenshotsButton'
import ScreenshotsSizeColor from '../../ScreenshotsSizeColor'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import { HistoryItemEdit, HistoryItemSource, HistoryItemType } from '../../types'
import useCursor from '../../hooks/useCursor'
import useOperation from '../../hooks/useOperation'
import useHistory from '../../hooks/useHistory'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import { isHit, isHitCircle } from '../utils'
import useDrawSelect from '../../hooks/useDrawSelect'
import draw, { getEditedArrowData } from './draw'
import useLang from '../../hooks/useLang'
import { useColor } from '../../hooks/useColor'
import { CommonPopover } from '../../CommonPopover'
import ScreenshotsColor from '../../ScreenshotsColor'
import useStore from '../../hooks/useStore'

export interface ArrowData {
  size: number
  color: string
  x1: number
  x2: number
  y1: number
  y2: number
}

export enum ArrowEditType {
  Move,
  MoveStart,
  MoveEnd
}

export interface ArrowEditData {
  type: ArrowEditType
  x1: number
  x2: number
  y1: number
  y2: number
}

export default function Arrow (): ReactElement {
  const lang = useLang()
  const [, cursorDispatcher] = useCursor()
  const [operation, operationDispatcher] = useOperation()
  const [history, historyDispatcher] = useHistory()
  const canvasContextRef = useCanvasContextRef()
  const [size, setSize] = useState(3)
  const arrowRef = useRef<HistoryItemSource<ArrowData, ArrowEditData> | null>(null)
  const arrowEditRef = useRef<HistoryItemEdit<ArrowEditData, ArrowData> | null>(null)
  const { color, setColor } = useColor()
  const { scale } = useStore()

  const checked = operation === 'Arrow'

  const selectArrow = useCallback(() => {
    operationDispatcher.set('Arrow')
    cursorDispatcher.set('default')
  }, [operationDispatcher, cursorDispatcher])

  const onSelectArrow = useCallback(() => {
    if (checked) {
      return
    }
    selectArrow()
    historyDispatcher.clearSelect()
  }, [checked, selectArrow, historyDispatcher])

  const onDrawSelect = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Arrow' || !canvasContextRef.current) {
        return
      }

      const source = action as HistoryItemSource<ArrowData, ArrowEditData>
      selectArrow()

      const { x1, y1, x2, y2 } = getEditedArrowData(source)
      let type = ArrowEditType.Move
      if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x1,
          y: y1
        }, scale)
      ) {
        type = ArrowEditType.MoveStart
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x2,
          y: y2
        }, scale)
      ) {
        type = ArrowEditType.MoveEnd
      }

      arrowEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          type,
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX,
          y2: e.clientY
        },
        source
      }

      historyDispatcher.select(action)
    },
    [canvasContextRef, selectArrow, historyDispatcher]
  )

  const onMousedown = useCallback(
    (e: MouseEvent) => {
      if (!checked || arrowRef.current || !canvasContextRef.current) {
        return
      }

      const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()
      arrowRef.current = {
        name: 'Arrow',
        type: HistoryItemType.Source,
        data: {
          size,
          color,
          x1: (e.clientX - left) / scale,
          y1: (e.clientY - top) / scale,
          x2: (e.clientX - left) / scale,
          y2: (e.clientY - top) / scale
        },
        editHistory: [],
        draw,
        isHit
      }
    },
    [checked, color, size, canvasContextRef, scale]
  )

  const onMousemove = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current) {
        return
      }
      if (arrowEditRef.current) {
        arrowEditRef.current.data.x2 = e.clientX
        arrowEditRef.current.data.y2 = e.clientY
        if (history.top !== arrowEditRef.current) {
          arrowEditRef.current.source.editHistory.push(arrowEditRef.current)
          historyDispatcher.push(arrowEditRef.current)
        } else {
          historyDispatcher.set(history)
        }
      } else if (arrowRef.current) {
        const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()

        arrowRef.current.data.x2 = (e.clientX - left) / scale
        arrowRef.current.data.y2 = (e.clientY - top) / scale

        if (history.top !== arrowRef.current) {
          historyDispatcher.push(arrowRef.current)
        } else {
          historyDispatcher.set(history)
        }
      }
    },
    [checked, history, canvasContextRef, historyDispatcher, scale]
  )

  const onMouseup = useCallback(() => {
    if (!checked) {
      return
    }

    if (arrowRef.current) {
      historyDispatcher.clearSelect()
    }

    arrowRef.current = null
    arrowEditRef.current = null
  }, [checked, historyDispatcher])

  useDrawSelect(onDrawSelect)
  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <CommonPopover
      open={checked}
      content={<ScreenshotsColor value={color} onChange={setColor} />}
    >
      <ScreenshotsButton
        title={lang.operation_arrow_title}
        icon='Arrow'
        checked={checked}
        onClick={onSelectArrow}
        size={12}
      />
    </CommonPopover>
  )
}
