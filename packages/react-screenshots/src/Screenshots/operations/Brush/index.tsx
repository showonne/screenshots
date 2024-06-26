import React, { ReactElement, useCallback, useRef, useState } from 'react'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import ScreenshotsButton from '../../ScreenshotsButton'
// import ScreenshotsSizeColor from '../../ScreenshotsSizeColor'
import useCursor from '../../hooks/useCursor'
import useOperation from '../../hooks/useOperation'
import useHistory from '../../hooks/useHistory'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import { HistoryItemEdit, HistoryItemSource, HistoryItemType, Point } from '../../types'
import useDrawSelect from '../../hooks/useDrawSelect'
import { isHit } from '../utils'
import draw from './draw'
import useLang from '../../hooks/useLang'
import { useColor } from '../../hooks/useColor'
import { CommonPopover } from '../../CommonPopover'
import ScreenshotsColor from '../../ScreenshotsColor'
import useStore from '../../hooks/useStore'

export interface BrushData {
  size: number
  color: string
  points: Point[]
}

export interface BrushEditData {
  x1: number
  y1: number
  x2: number
  y2: number
  scale: number
}

export default function Brush (): ReactElement {
  const lang = useLang()
  const [, cursorDispatcher] = useCursor()
  const [operation, operationDispatcher] = useOperation()
  const canvasContextRef = useCanvasContextRef()
  const [history, historyDispatcher] = useHistory()
  const [size, setSize] = useState(3)
  const brushRef = useRef<HistoryItemSource<BrushData, BrushEditData> | null>(null)
  const brushEditRef = useRef<HistoryItemEdit<BrushEditData, BrushData> | null>(null)
  const { color, setColor } = useColor()
  const { scale } = useStore()

  const checked = operation === 'Brush'

  const selectBrush = useCallback(() => {
    operationDispatcher.set('Brush')
    cursorDispatcher.set('default')
  }, [operationDispatcher, cursorDispatcher])

  const onSelectBrush = useCallback(() => {
    if (checked) {
      return
    }
    selectBrush()
    historyDispatcher.clearSelect()
  }, [checked, selectBrush, historyDispatcher])

  const onDrawSelect = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Brush') {
        return
      }

      selectBrush()

      brushEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX,
          y2: e.clientY,
          scale
        },
        source: action as HistoryItemSource<BrushData, BrushEditData>
      }

      historyDispatcher.select(action)
    },
    [selectBrush, historyDispatcher, scale]
  )

  const onMousedown = useCallback(
    (e: MouseEvent): void => {
      if (!checked || brushRef.current || !canvasContextRef.current) {
        return
      }

      const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()

      brushRef.current = {
        name: 'Brush',
        type: HistoryItemType.Source,
        data: {
          size,
          color,
          points: [
            {
              x: (e.clientX - left) / scale,
              y: (e.clientY - top) / scale
            }
          ]
        },
        editHistory: [],
        draw,
        isHit
      }
    },
    [checked, canvasContextRef, size, color, scale]
  )

  const onMousemove = useCallback(
    (e: MouseEvent): void => {
      if (!checked || !canvasContextRef.current) {
        return
      }

      if (brushEditRef.current) {
        brushEditRef.current.data.x2 = e.clientX
        brushEditRef.current.data.y2 = e.clientY
        brushEditRef.current.data.scale = scale
        if (history.top !== brushEditRef.current) {
          brushEditRef.current.source.editHistory.push(brushEditRef.current)
          historyDispatcher.push(brushEditRef.current)
        } else {
          historyDispatcher.set(history)
        }
      } else if (brushRef.current) {
        const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()

        brushRef.current.data.points.push({
          x: (e.clientX - left) / scale,
          y: (e.clientY - top) / scale
        })

        if (history.top !== brushRef.current) {
          historyDispatcher.push(brushRef.current)
        } else {
          historyDispatcher.set(history)
        }
      }
    },
    [checked, history, canvasContextRef, historyDispatcher, scale]
  )

  const onMouseup = useCallback((): void => {
    if (!checked) {
      return
    }

    if (brushRef.current) {
      historyDispatcher.clearSelect()
    }

    brushRef.current = null
    brushEditRef.current = null
  }, [checked, historyDispatcher])

  useDrawSelect(onDrawSelect)
  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <CommonPopover
      open={checked}
      content={
        <ScreenshotsColor value={color} onChange={setColor} />
      }
    >
      <ScreenshotsButton
        title={lang.operation_brush_title}
        icon='Brush'
        checked={checked}
        onClick={onSelectBrush}
      />
    </CommonPopover>
  )
}
