import React, { ReactElement, useCallback } from 'react'
import useCall from '../../hooks/useCall'
import useLang from '../../hooks/useLang'
import useReset from '../../hooks/useReset'
import './index.less'

export default function Cancel (): ReactElement {
  const call = useCall()
  const reset = useReset()
  const lang = useLang()

  const onClick = useCallback(() => {
    call('onCancel')
    reset()
  }, [call, reset])

  return <div onClick={onClick} className='screen-share-opt-btn'>Cancel</div>
}
