import React, { ReactElement, useCallback, useEffect, useReducer, useRef } from 'react'
import Screenshots, { ScreenshotsRef } from '../Screenshots'
import { Bounds } from '../Screenshots/types'
import './app.less'
import imageUrl from './image.jpg'

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

  const startEdit = () => {
    const rect = rootRef.current!.getBoundingClientRect()
    screenshotsRef.current?.manualSelect({ x: 0, y: 0 }, { x: rect.width, y: rect.height })
  }

  return (
    <div className='body'>
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}>
        <button onClick={startEdit}>start edit</button>
      </div>
      <div ref={rootRef}>
        <Screenshots
          ref={screenshotsRef}
          url={imageUrl}
          width={window.innerWidth}
          height={window.innerHeight}
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
