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

  const startEdit = () => {
    const rect = containRef.current!.getBoundingClientRect()
    screenshotsRef.current?.manualSelect({ x: 0, y: 0 }, { x: rect.width, y: rect.height })
  }

  useEffect(() => {
    if (containRef.current) {
      const rect = containRef.current!.getBoundingClientRect()
      setRect(rect)
    }
  }, [containRef.current])

  console.log(rect, '...')

  return (
    <div className='body' ref={rootRef}>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
        <button onClick={startEdit}>start edit</button>
      </div>
      <div ref={containRef as any} style={{ height: 300, width: 600 }}>
        <Screenshots
          ref={screenshotsRef}
          // container={containRef.current}
          url={imageUrl}
          width={rect?.width}
          height={rect?.height}
          lang={{
            operation_rectangle_title: 'Rectangle'
          }}
          onSave={onSave}
          onCancel={onCancel}
          onOk={onOk}
        />
      </div>
    </div>
  )
}
