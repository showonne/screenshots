import React, { ReactElement, useCallback } from 'react'
import useStore from '../../hooks/useStore'
import useCall from '../../hooks/useCall'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useHistory from '../../hooks/useHistory'
import useReset from '../../hooks/useReset'
import ScreenshotsButton from '../../ScreenshotsButton'
import composeImage from '../../composeImage'
import './index.less'

export default function Ok (): ReactElement {
  const { image, width, height, history, bounds, lang, scale } = useStore()
  const canvasContextRef = useCanvasContextRef()
  const [, historyDispatcher] = useHistory()
  const call = useCall()
  const reset = useReset()

  const onClick = useCallback(() => {
    historyDispatcher.clearSelect()
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
        call('onOk', blob, bounds)
        reset()
      })
    })
  }, [canvasContextRef, historyDispatcher, image, width, height, history, bounds, call, reset])

  return <div className='screen-share-opt-btn primary' onClick={onClick}>Share</div>
}
