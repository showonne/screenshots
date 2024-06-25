import React, { ReactElement, useCallback, useRef, useState } from 'react'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCursor from '../../hooks/useCursor'
import useHistory from '../../hooks/useHistory'
import useOperation from '../../hooks/useOperation'
import ScreenshotsButton from '../../ScreenshotsButton'
import ScreenshotsSizeColor from '../../ScreenshotsSizeColor'
import {
  HistoryItemEdit,
  HistoryItemSource,
  HistoryItemType,
  Point
} from '../../types'
import ScreenshotsTextarea from '../../ScreenshotsTextarea'
import useBounds from '../../hooks/useBounds'
import useDrawSelect from '../../hooks/useDrawSelect'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import useLang from '../../hooks/useLang'
import { useColor } from '../../hooks/useColor'
import { CommonPopover } from '../../CommonPopover'
import ScreenshotsColor from '../../ScreenshotsColor'
import useStore from '../../hooks/useStore'
import { draw, isHit } from './draw'

export interface TextData {
  size: number;
  color: string;
  fontFamily: string;
  x: number;
  y: number;
  text: string;
}

export interface TextEditData {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  scale: number;
}

export interface TextareaBounds {
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
}

const sizes: Record<number, number> = {
  3: 18,
  6: 32,
  9: 46
}

export default function Text (): ReactElement {
  const lang = useLang()
  const [history, historyDispatcher] = useHistory()
  const [bounds] = useBounds()
  const [operation, operationDispatcher] = useOperation()
  const [, cursorDispatcher] = useCursor()
  const canvasContextRef = useCanvasContextRef()
  const [size, setSize] = useState(3)
  const { color, setColor } = useColor()
  const { scale } = useStore()

  const textRef = useRef<HistoryItemSource<TextData, TextEditData> | null>(
    null
  )
  const textEditRef = useRef<HistoryItemEdit<TextEditData, TextData> | null>(
    null
  )
  const [textareaBounds, setTextareaBounds] = useState<TextareaBounds | null>(
    null
  )
  const [text, setText] = useState<string>('')

  const checked = operation === 'Text'

  const selectText = useCallback(() => {
    operationDispatcher.set('Text')
    cursorDispatcher.set('default')
  }, [operationDispatcher, cursorDispatcher])

  const onSelectText = useCallback(() => {
    if (checked) {
      return
    }
    selectText()
    historyDispatcher.clearSelect()
  }, [checked, selectText, historyDispatcher])

  const onSizeChange = useCallback((size: number) => {
    if (textRef.current) {
      textRef.current.data.size = sizes[size]
    }
    setSize(size)
  }, [])

  const onColorChange = useCallback((color: string) => {
    if (textRef.current) {
      textRef.current.data.color = color
    }
    setColor(color)
  }, [])

  const onTextareaChange = useCallback(
    (value: string) => {
      setText(value)
      if (checked && textRef.current) {
        textRef.current.data.text = value
      }
    },
    [checked]
  )

  const onTextareaBlur = useCallback(() => {
    if (textRef.current && textRef.current.data.text) {
      historyDispatcher.push(textRef.current)
    }
    textRef.current = null
    setText('')
    setTextareaBounds(null)
  }, [historyDispatcher])

  const onDrawSelect = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Text') {
        return
      }

      selectText()

      textEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX,
          y2: e.clientY,
          scale
        },
        source: action as HistoryItemSource<TextData, TextEditData>
      }

      historyDispatcher.select(action)
    },
    [selectText, historyDispatcher, scale]
  )

  const onMousedown = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current || textRef.current || !bounds) {
        return
      }
      const { left, top } =
        canvasContextRef.current.canvas.getBoundingClientRect()
      const fontFamily = window.getComputedStyle(
        canvasContextRef.current.canvas
      ).fontFamily
      const x = (e.clientX - left) / scale
      const y = (e.clientY - top) / scale

      textRef.current = {
        name: 'Text',
        type: HistoryItemType.Source,
        data: {
          size: sizes[size],
          color,
          fontFamily,
          x,
          y,
          text: ''
        },
        editHistory: [],
        draw,
        isHit
      }

      setTextareaBounds({
        x: e.clientX,
        y: e.clientY,
        maxWidth: bounds.width - x,
        maxHeight: bounds.height - y
      })
    },
    [checked, size, color, bounds, canvasContextRef, scale]
  )

  const onMousemove = useCallback(
    (e: MouseEvent): void => {
      if (!checked) {
        return
      }

      if (textEditRef.current) {
        textEditRef.current.data.x2 = e.clientX
        textEditRef.current.data.y2 = e.clientY
        textEditRef.current.data.scale = scale
        if (history.top !== textEditRef.current) {
          textEditRef.current.source.editHistory.push(textEditRef.current)
          historyDispatcher.push(textEditRef.current)
        } else {
          historyDispatcher.set(history)
        }
      }
    },
    [checked, history, historyDispatcher]
  )

  const onMouseup = useCallback((): void => {
    if (!checked) {
      return
    }

    textEditRef.current = null
  }, [checked])

  useDrawSelect(onDrawSelect)
  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <>
      <CommonPopover
        open={checked}
        content={
          <ScreenshotsColor value={color} onChange={onColorChange} />
        }
      >
        <ScreenshotsButton
          title={lang.operation_text_title}
          icon='Text'
          checked={checked}
          onClick={onSelectText}
        />
      </CommonPopover>
      {checked && textareaBounds && (
        <ScreenshotsTextarea
          x={textareaBounds.x}
          y={textareaBounds.y}
          maxWidth={textareaBounds.maxWidth}
          maxHeight={textareaBounds.maxHeight}
          size={sizes[size]}
          color={color}
          value={text}
          onChange={onTextareaChange}
          onBlur={onTextareaBlur}
        />
      )}
    </>
  )
}
