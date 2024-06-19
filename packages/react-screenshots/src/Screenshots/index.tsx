import React, { MouseEvent, ReactElement, forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import composeImage from './composeImage'
import './icons/iconfont.less'
import './screenshots.less'
import ScreenshotsBackground, { ScreenshotsBackgroundRef } from './ScreenshotsBackground'
import ScreenshotsCanvas from './ScreenshotsCanvas'
import ScreenshotsContext from './ScreenshotsContext'
import ScreenshotsOperations from './ScreenshotsOperations'
import { Bounds, Emiter, History, Point } from './types'
import useGetLoadedImage from './useGetLoadedImage'
import zhCN, { Lang } from './zh_CN'
import { useThrottleFn } from 'ahooks'

export interface ScreenshotsProps {
  url?: string
  width: number
  height: number
  lang?: Partial<Lang>
  className?: string
  mode: 'screenshots' | 'editor'
  onScaleChange?: (scale: number) => void
  [key: string]: unknown
}

export interface ScreenshotsRef {
  manualSelect: (p1: Point, p2: Point) => void
  updateScale: (delta: number) => void
}

export default forwardRef(function Screenshots ({ url, container, lang, className, height: initHeight, width: initWidth, mode = 'screenshots', ...props }: ScreenshotsProps, ref: React.ForwardedRef<ScreenshotsRef>): ReactElement {
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

  const rootRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<ScreenshotsBackgroundRef>(null)
  const scaleHandlerRef = useRef<HTMLDivElement>(null)

  const width = initWidth * scale;
  const height = initHeight * scale;

  const store = {
    url,
    width,
    height,
    scale,
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
    operation
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
      if (bounds && canvasContextRef.current) {
        composeImage({
          image,
          width,
          height,
          history,
          bounds,
          scale,
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
          scale,
        }).then(blob => {
          call('onOk', blob, targetBounds)
          reset()
        })
      }
    },
    [image, history, bounds, width, height, call]
  )

  const onContextMenu = useCallback(
    (e: MouseEvent) => {
      if (e.button !== 2) {
        return
      }
      e.preventDefault()
      call('onCancel')
      reset()
    },
    [call]
  )

  // url变化，重置截图区域
  useLayoutEffect(() => {
    reset()
  }, [url])

  const { run: onWheel } = useThrottleFn((event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault(); // 阻止默认的缩放处理
      
      // deltaY值表示滚轮的方向和距离，负值表示放大，正值表示缩小
      const delta = event.deltaY < 0 ? 0.1 : -0.1
      setScale(prev => prev + delta)

      props.onScaleChange?.(scale + delta)
    }
  }, { wait: 50 })

  useEffect(() => {
    if (mode !== 'editor') return
    if (scaleHandlerRef.current) {
      scaleHandlerRef.current.addEventListener('wheel', onWheel);
    }
    manualSelect({ x: 0, y: 0 }, { x: width, y: height })
  }, [mode])

  const manualSelect = (p1: Point, p2: Point) => {
    backgroundRef.current?.manualSelect(p1, p2)
  }

  const updateScale = (delta: number) => {
    setScale(prev => prev + delta)
    props.onScaleChange?.(scale + delta)
  }

  useImperativeHandle(ref, () => {
    return {
      manualSelect,
      updateScale,
    }
  })

  return (
    <ScreenshotsContext.Provider value={{ store, dispatcher }}>
      <div className='root-wrapper' ref={scaleHandlerRef}
        style={{
          width,
          height,
          alignSelf: 'stretch',
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
