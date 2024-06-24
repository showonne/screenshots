import React, { ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import Screenshots, { ScreenshotsRef } from '../Screenshots'
import { Bounds } from '../Screenshots/types'
import './app.less'
import imageUrl from './basic.jpg'
import { Button, Popover } from 'antd'
import ScreenshotsSizeColor from '../Screenshots/ScreenshotsSizeColor'

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
  const [mode] = useState('screenshots')

  const [scale, setScale] = useState(1)

  const handleScaleChange = (scale: number) => {
    setScale(scale)
  }

  const [size, _setSize] = useState(3)
  const [color, _setColor] = useState('#F84135')

  const setSize = (size: number) => {
    console.log(size)
    // screenshotsRef.current!.updateSize(size)
  }

  const setColor = (color: string) => {
    _setColor(color)
    screenshotsRef.current!.updateColor(color)
  }

  const [operation, setOperation] = useState('Rectangle')

  const switchOperation = (operation: string) => {
    setOperation(operation)
    screenshotsRef.current!.switchOperation(operation)
  }

  const [history, setHistory] = useState({ redoDisabled: true, undoDisabled: true })

  const handleHistoryChange = (status: any) => {
    setHistory(status)
  }

  return (
    <div className='body' ref={rootRef}>
      <div className='drag-title' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <button onClick={() => location.reload()}>reload</button>
        <Popover
          open={operation === 'Rectangle'}
          content={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
        >
          <Button onClick={() => switchOperation('Rectangle')}>Rectangle</Button>
        </Popover>
        <Popover
          open={operation === 'Ellipse'}
          content={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
        >
          <Button onClick={() => switchOperation('Ellipse')}>Ellipse</Button>
        </Popover>
        <Popover
          open={operation === 'Arrow'}
          content={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
        >
          <Button onClick={() => switchOperation('Arrow')}>Arrow</Button>
        </Popover>
        <Popover
          open={operation === 'Brush'}
          content={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
        >
          <Button onClick={() => switchOperation('Brush')}>Brush</Button>
        </Popover>
        <Popover
          open={operation === 'Text'}
          content={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
        >
          <Button onClick={() => switchOperation('Text')}>Text</Button>
        </Popover>
        <Button onClick={() => switchOperation('Mosaic')}>Mosaic</Button>
        <Button disabled={history.undoDisabled} onClick={() => screenshotsRef.current?.undo()}>undo</Button>
        <Button disabled={history.redoDisabled} onClick={() => screenshotsRef.current?.redo()}>redo</Button>
      </div>
      <div
        className='image-container'
        ref={containRef as any}
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
          onHistoryChange={handleHistoryChange}
        />
      </div>
    </div>
  )
}
