import log from '../log'

const MouseButtonKind = [ 'Left', 'Middle', 'Right' ]

export default class ScreenDrag {
  static buildInputOf(e, type, line, col) {
    let seq = '<'
    if (e.ctrlKey) {
      seq += 'C-'
    }
    if (e.altKey) {
      seq += 'A-'
    }
    if (e.shiftKey) {
      seq += 'S-'
    }
    seq += MouseButtonKind[e.button] + type + '>'
    seq += `<${col},${line}>`
    return seq
  }

  constructor(store) {
    this.store = store
    this.line = 0
    this.col = 0
  }

  start(down_event) {
    down_event.preventDefault();
    [this.line, this.col] = this.getPos(down_event)
    log.info('Drag start', down_event, this.line, this.col)
    const input = ScreenDrag.buildInputOf(down_event, 'Mouse', this.line, this.col)
    log.debug('Mouse input: ' + input)
    return input
  }

  drag(move_event) {
    const [line, col] = this.getPos(move_event)
    if (line === this.line && col === this.col) {
      return null
    }
    move_event.preventDefault()
    log.debug('Drag continue', move_event, line, col)
    const input = ScreenDrag.buildInputOf(move_event, 'Drag', line, col)
    this.line = line
    this.col = col
    log.debug('Mouse input: ' + input)
    return input
  }

  end(up_event) {
    up_event.preventDefault();
    [this.line, this.col] = this.getPos(up_event)
    log.info('Drag end', up_event, this.line, this.col)

    const input = ScreenDrag.buildInputOf(up_event, 'Release', this.line, this.col)
    log.info('Mouse input: ' + input)
    return input
  }

  getPos(e) {
    const canvas = this.store.canvas
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - window.pageXOffset - rect.left
    const y = e.clientY - window.pageYOffset - rect.top
    return [
      Math.floor(y / this.store.font_attr.height),
      Math.floor(x / this.store.font_attr.width),
    ]
  }
}
