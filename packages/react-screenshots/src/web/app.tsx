import React, { ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import Screenshots, { ScreenshotsRef } from '../Screenshots'
import { Bounds } from '../Screenshots/types'
import './app.less'
import imageUrl from './basic.jpg'

export default function App (): ReactElement {
  const onSave = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log('save', blob, bounds)
    if (blob) {
      const url = URL.createObjectURL(blob)
      console.log(url)
      window.open(url)
    }
  }, [])
  const onCancel = useCallback(() => {
    console.log('cancel')
  }, [])
  const onOk = useCallback((blob: Blob | null, bounds: Bounds) => {
    console.log('ok', blob, bounds)
    if (blob) {
      const url = URL.createObjectURL(blob)
      console.log(url)
      window.open(url)
    }
  }, [])

  const rootRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef<ScreenshotsRef>(null)
  const containRef = useRef<HTMLDivElement>()
  const [rect, setRect] = useState({ height: 0, width: 0 })
  const [mode] = useState('editor')


  // const startEdit = () => {
  //   const rect = containRef.current!.getBoundingClientRect()
  //   screenshotsRef.current?.manualSelect({ x: 0, y: 0 }, { x: 900, y: 506 })
  // }

  // useEffect(() => {
  //   if (mode === 'editor') {
  //     startEdit()
  //   }
  // }, [])

  useEffect(() => {
    if (containRef.current) {
      const rect = containRef.current!.getBoundingClientRect()
      setRect(rect)
    }
  }, [containRef.current])

  const [scale, setScale] = useState(1)
  
  const handleScaleChange = (scale: number) => {
    setScale(scale)
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const handleCommit = useCallback(() => {
    screenshotsRef.current!.updateScale(Number(inputRef.current?.value))
  }, [])

  const increaseScale = () => {
    screenshotsRef.current!.updateScale(0.1)
  }

  const decreaseScale = () => {
    screenshotsRef.current!.updateScale(-0.1)
  }

  const startEdit = () => {
    screenshotsRef.current!.manualSelect({x: 0, y: 0}, {x: 900, y: 506})
  }

  return (
    <div className='body' ref={rootRef}>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
        <button onClick={startEdit}>start edit</button>
        <br />
        <button onClick={increaseScale}>+</button>
        <button onClick={decreaseScale}>-</button>
        <br />
        <input ref={inputRef}></input>
        <br/>
        <button onClick={handleCommit}>commit scale</button>
        <br/>
        current scale:{scale.toFixed(2)}
      </div>
      <div
        ref={containRef as any}
        style={{
          height: 708,
          width: 1024,
          display: 'flex',
          margin: '0 auto',
          alignItems: 'center',
          overflow: 'auto'
        }}
      >
        <Screenshots
          mode={mode}
          ref={screenshotsRef}
          url={imageUrl}
          width={900}
          height={506}
          lang={{
            operation_rectangle_title: 'Rectangle'
          }}
          onSave={onSave}
          onCancel={onCancel}
          onOk={onOk}
          onScaleChange={handleScaleChange}
        />
      </div>
    </div>
  )
}
