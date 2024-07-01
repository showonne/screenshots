import Ok from './Ok'
import Cancel from './Cancel'
import Save from './Save'
import Redo from './Redo'
import Undo from './Undo'
import Mosaic from './Mosaic'
import Text from './Text'
import Brush from './Brush'
import Arrow from './Arrow'
import Ellipse from './Ellipse'
import Rectangle from './Rectangle'

// share screen button
import ShareOk from './ShareScreen/OK'
import ShareCancel from './ShareScreen/Cancel'

export {
  Ok,
  Cancel,
  Save,
  Redo,
  Undo,
  Mosaic,
  Text,
  Brush,
  Arrow,
  Ellipse,
  Rectangle
}

export default [Rectangle, Ellipse, Arrow, '|', Text, Brush, Mosaic, '|', Undo, Redo, '|', Save, Cancel, Ok]

export const ShareScreenButtons = [ShareCancel, ShareOk]
