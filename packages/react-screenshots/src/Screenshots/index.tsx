import React, { MouseEvent, ReactElement, forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import composeImage from './composeImage'
// import './icons/iconfont.less'
import './screenshots.less'
import ScreenshotsBackground, { ScreenshotsBackgroundRef } from './ScreenshotsBackground'
import ScreenshotsCanvas from './ScreenshotsCanvas'
import ScreenshotsContext from './ScreenshotsContext'
import ScreenshotsOperations from './ScreenshotsOperations'
import { Mode, Bounds, Emiter, History, HistoryItemType, Point } from './types'
import useGetLoadedImage from './useGetLoadedImage'
import zhCN, { Lang } from './zh_CN'
import { useMemoizedFn, useThrottleFn } from 'ahooks'
import mitt, { Emitter, EventType } from 'mitt'

export { default as ScreenshotsColor } from './ScreenshotsColor'

export interface ScreenshotsProps {
  url?: string
  width: number
  height: number
  lang?: Partial<Lang>
  className?: string
  mode?: Mode,
  onScaleChange?: (scale: number) => void
  onHistoryChange?: (status: { redoDisabled: boolean, undoDisabled: boolean }) => void
  onOperationChange?: (operation: string) => void
  scaleable?: boolean
  [key: string]: unknown
}

type IEventType = 'onOk' | 'onCancel' | 'onSave'

export interface ScreenshotsRef {
  manualSelect: (p1: Point, p2: Point) => void
  updateScale: (scale: number) => void
  // updateSize: (size: number) => void
  updateColor: (color: string) => void
  redo: () => void
  undo: () => void
  // enum
  switchOperation: (operation: string) => void
  invoke: (event: IEventType) => void
}

const globalEvents: Emitter<Record<EventType, unknown>> = mitt()

export default forwardRef(function Screenshots ({ url, container, lang, className, height: initHeight, width: initWidth, mode = Mode.Screenshot, onHistoryChange, onOperationChange, scaleable = false, ...props }: ScreenshotsProps, ref: React.ForwardedRef<ScreenshotsRef>): ReactElement {
  const image = useGetLoadedImage(url)
  const canvasContextRef = useRef<CanvasRenderingContext2D>(null)
  const emiterRef = useRef<Emiter>({})
  const [history, setHistory] = useState<History>({
    index: -1,
    stack: []
  })
  const [bounds, setBounds] = useState<Bounds | null>(null)
  const [cursor, setCursor] = useState<string | undefined>('move')
  const [operation, setOperation] = useState<string | undefined>(undefined)
  const [scale, setScale] = useState(1)
  const [editing, setEditing] = useState(mode === 'editor')

  const rootRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<ScreenshotsBackgroundRef>(null)
  const scaleHandlerRef = useRef<HTMLDivElement>(null)

  const width = initWidth * scale
  const height = initHeight * scale

  const store = {
    url,
    width,
    height,
    scale,
    editing,
    image,
    lang: {
      ...zhCN,
      ...lang
    },
    emiterRef,
    canvasContextRef,
    history,
    bounds,
    cursor,
    operation,
    mode,
    globalEvents
  }

  const call = useCallback(
    <T extends unknown[]>(funcName: string, ...args: T) => {
      const func = props[funcName]
      if (typeof func === 'function') {
        func(...args)
      }
    },
    [props]
  )

  const dispatcher = {
    call,
    setHistory,
    setBounds,
    setCursor,
    setOperation
  }

  const classNames = ['screenshots']

  if (className) {
    classNames.push(className)
  }

  if (mode === 'editor') {
    classNames.push('editor-mode')
  }

  const reset = () => {
    emiterRef.current = {}
    setHistory({
      index: -1,
      stack: []
    })
    setBounds(null)
    setCursor('move')
    setOperation(undefined)
  }

  const onDoubleClick = useCallback(
    async (e: MouseEvent) => {
      if (e.button !== 0 || !image) {
        return
      }
      if (mode !== 'screenshots') return

      if (bounds && canvasContextRef.current) {
        composeImage({
          image,
          width,
          height,
          history,
          bounds,
          scale
        }).then(blob => {
          call('onOk', blob, bounds)
          reset()
        })
      } else {
        const targetBounds = {
          x: 0,
          y: 0,
          width,
          height
        }
        composeImage({
          image,
          width,
          height,
          history,
          bounds: targetBounds,
          scale
        }).then(blob => {
          call('onOk', blob, targetBounds)
          reset()
        })
      }
    },
    [image, history, bounds, width, height, call, mode]
  )

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 2) {
        return
      }
      if (mode === 'editor') return
      e.preventDefault()
      call('onCancel')
      reset()
    },
    [call, mode]
  )

  // url变化，重置截图区域
  useLayoutEffect(() => {
    reset()
  }, [url])

  const { run: onWheel } = useThrottleFn((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault() // 阻止默认的缩放处理

      // deltaY值表示滚轮的方向和距离，负值表示放大，正值表示缩小
      const delta = event.deltaY < 0 ? 0.1 : -0.1

      const _scale = parseFloat((scale + delta).toFixed(2))
      setScale(_scale)
      props.onScaleChange?.(_scale)
    }
  }, { wait: 50 })

  const manualSelect = (p1: Point, p2: Point) => {
    backgroundRef.current?.manualSelect(p1, p2)
  }

  const updateScale = (_scale: number) => {
    setScale(_scale)
    props.onScaleChange?.(_scale)
  }

  // const updateSize = (size: number) => {
  // }

  const updateColor = (color: string) => {
    globalEvents.emit('update:color', color)
  }

  // enum
  const switchOperation = (operation: string) => {
    setOperation(operation)

    // todo
    setCursor('crosshair')
  }

  const redo = useMemoizedFn(() => {
    const { index, stack } = history
    const item = stack[index + 1]

    if (item) {
      if (item.type === HistoryItemType.Source) {
        item.isSelected = false
      } else if (item.type === HistoryItemType.Edit) {
        item.source.editHistory.push(item)
      }
    }

    setHistory?.({
      index: index >= stack.length - 1 ? stack.length - 1 : index + 1,
      stack
    })
  })

  const undo = useMemoizedFn(() => {
    const { index, stack } = history
    const item = stack[index]

    if (item) {
      if (item.type === HistoryItemType.Source) {
        item.isSelected = false
      } else if (item.type === HistoryItemType.Edit) {
        item.source.editHistory.pop()
      }
    }

    setHistory?.({
      index: index <= 0 ? -1 : index - 1,
      stack
    })
  })

  useEffect(() => {
    if (mode !== 'editor') return

    // default operation
    manualSelect({ x: 0, y: 0 }, { x: width, y: height })
    setOperation('Rectangle')
    setCursor('crosshair')
  }, [mode])

  useEffect(() => {
    if (!scaleable) return

    if (scaleHandlerRef.current) {
      scaleHandlerRef.current.addEventListener('wheel', onWheel)
    }

    return () => scaleHandlerRef.current?.removeEventListener('wheel', onWheel)
  }, [scaleable])

  useEffect(() => {
    if (onHistoryChange) {
      const redoDisabled = !history.stack.length || history.stack.length - 1 === history.index
      const undoDisabled = history.index === -1

      onHistoryChange({
        redoDisabled,
        undoDisabled
      })
    }
  }, [history])

  const invoke = useCallback((eventName: IEventType) => {
    if (eventName === 'onCancel') return call(eventName)

    history.stack.forEach(item => {
      if (item.type === HistoryItemType.Source) {
        item.isSelected = false
      }
    })

    setHistory?.({ ...history })

    setTimeout(() => {
      if (!canvasContextRef.current || !image || !bounds) {
        return
      }
      composeImage({
        image,
        width,
        height,
        history,
        bounds,
        scale
      }).then(blob => {
        call(eventName, blob, bounds)
        if (mode === 'editor') return
        reset()
      })
    })
  }, [canvasContextRef, history, image, width, height, history, bounds, call, reset, mode])

  useEffect(() => {
    if (operation) {
      onOperationChange?.(operation)
    }
  }, [operation])

  useImperativeHandle(ref, () => {
    return {
      manualSelect,
      updateScale,
      // updateSize,
      updateColor,
      switchOperation,
      redo,
      undo,
      invoke
    }
  })

  return (
    <ScreenshotsContext.Provider value={{ store, dispatcher }}>
      <div
        className='root-wrapper' ref={scaleHandlerRef}
        style={{
          width,
          height
          // alignSelf: 'strench',
        }}
      >
        <div
          className={classNames.join(' ')}
          style={{ width, height, display: 'block' }}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
          ref={rootRef}
        >
          <ScreenshotsBackground ref={backgroundRef} />
          <ScreenshotsCanvas ref={canvasContextRef} />
          <ScreenshotsOperations />
        </div>
      </div>
    </ScreenshotsContext.Provider>
  )
})
