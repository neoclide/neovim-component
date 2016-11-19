import Emitter from 'component-emitter'
import log from '../log'
import {dragEnd} from './actions'

function borderColor(bg) {
  const ms = bg.match(/\((\d+),\s*(\d+),\s*(\d+)/)
  if (!ms) return '#ffffff'
  return `rgb(${255 - ms[1]}, ${255 - ms[2]}, ${255 - ms[3]})`
}

function close(a, b) {
  return Math.abs(a - b) < 2
}

class CursorBlinkTimer extends Emitter {
  constructor(interval) {
    super()
    this.interval = interval
    this.token = null
    this.enabled = false
    this.shown = true
    this.callback = this._callback.bind(this)
  }

  start() {
    if (this.enabled) return
    this.shown = true
    this.token = window.setTimeout(this.callback, this.interval)
    this.enabled = true
  }

  stop() {
    if (!this.enabled) return
    if (this.token !== null) {
      window.clearTimeout(this.token)
      this.token = null
    }
    this.enabled = false
  }

  reset() {
    if (this.enabled) {
      this.stop()
      this.start()
    }
  }

 _callback() {
    this.shown = !this.shown
    this.emit('tick', this.shown)
    this.token = window.setTimeout(this.callback, this.interval)
  }
}

export default class NeovimCursor {
  constructor(store, screen_ctx) {
    this.store = store
    this.screen_ctx = screen_ctx
    this.delay_timer = null
    this.blink_timer = new CursorBlinkTimer(this.store.cursor_blink_interval)
    this.element = document.querySelector('.neovim-cursor')
    this.element.style.top = '0px'
    this.element.style.left = '0px'
    this.ctx = this.element.getContext('2d', {alpha: false})
    this.updateSize()
    this.blink_timer.on('tick', (shown) => {
      if (shown) {
        this.redraw()
      } else {
        this.dismiss()
      }
    })

    this.element.addEventListener('mouseup', (e) => {
      this.store.dispatcher.dispatch(dragEnd(e))
    })
    this.element.addEventListener('click', (e) => {
      e.preventDefault()
      const i = document.querySelector('.neovim-input')
      if (i) i.focus()
    })
    this.ime = window.keyboardLayout && window.keyboardLayout != 'com.apple.keylayout.US'
    window.addEventListener('layoutChange', e => {
      this.ime = e.detail !== 'com.apple.keylayout.US'
      this.redraw()
    })

    this.store.on('update-bg', () => {
      const bg = this.store.bg_color
      const ms = bg.match(/\((\d+),\s*(\d+),\s*(\d+)/)
      if (ms) {
        this.bgColors = {r: ms[1], g: ms[2], b: ms[3]}
      } else {
        this.bgColors = {r: 0, g: 0, b: 0}
      }
    })
    this.store.on('cursor', this.updateCursorPos.bind(this))
    this.store.on('update-fg', () => this.redraw())
    this.store.on('font-size-changed', this.updateSize.bind(this))
    this.store.on('busy', () => this.updateCursorBlinking())
    this.store.on('focus-changed', () => this.updateCursorBlinking())
    this.store.on('mode', () => this.updateCursorBlinking())
    this.updateCursorBlinking()
  }
  shouldBlink() {
    const store = this.store
    return store.focused && store.mode != 'normal'
  }

  invertColor(image) {
    const d = image.data
    const {ime, bgColors} = this
    for (let i = 0; i < d.length; i+=4) {
      if (ime && close(d[i], bgColors.r)
          && close(d[i + 1], bgColors.g)
          && close(d[i + 2], bgColors.b)) {
        d[i] = 255
        d[i + 1] = 193
        d[i + 2] = 7
      } else {
        d[i] = 255 - d[i]
        d[i+1] = 255 - d[i+1]
        d[i+2] = 255 - d[i+2]
      }
    }
    return image
  }

  updateSize() {
    const f = this.store.font_attr
    this.element.style.width = f.width + 'px'
    this.element.style.height = f.height + 'px'
    this.element.width = f.draw_width
    this.element.height = f.draw_height
    this.redraw()
  }

  dismiss() {
    this.ctx.clearRect(0, 0, this.element.width, this.element.height)
  }

  redraw(clear = true) {
    if (this.store.cursor_draw_delay <= 0) {
      this.redrawImpl()
      return
    }
    if (this.delay_timer !== null) {
      clearTimeout(this.delay_timer)
    } else if (clear){
      this.ctx.clearRect(0, 0, this.element.width, this.element.height)
    }
    this.delay_timer = setTimeout(this.redrawImpl.bind(this), this.store.cursor_draw_delay)
  }

  updateCursorPos() {
    const {line, col} = this.store.cursor
    const {width, height} = this.store.font_attr

    const x = col * width
    const y = line * height

    this.element.style.left = x + 'px'
    this.element.style.top = y + 'px'
    log.debug(`Cursor is moved to (${x}, ${y})`)
    this.redraw()
    this.blink_timer.reset()
  }

  redrawImpl() {
    this.delay_timer = null
    const {focused, mode, font_attr, cursor} = this.store
    const cursor_width = mode !== 'normal' ? (window.devicePixelRatio || 1) : font_attr.draw_width
    const cursor_height = font_attr.draw_height
    const x = cursor.col * font_attr.draw_width
    const y = cursor.line * font_attr.draw_height
    const captured = this.screen_ctx.getImageData(x, y, cursor_width, cursor_height)
    if (focused) {
      this.ctx.putImageData(this.invertColor(captured), 0, 0)
    } else if (mode == 'normal') {
      this.ctx.putImageData(captured, 0, 0)
      const color = borderColor(font_attr.bg)
      this.ctx.strokeStyle = color
      this.ctx.lineWidth = window.devicePixelRatio
      //this.ctx.strokeRect(x, y, font_attr.draw_width - 2*window.devicePixelRatio, font_attr.draw_height) 
      this.ctx.strokeRect(0, 0, font_attr.draw_width - 2, font_attr.draw_height)
    }
  }

  updateCursorBlinking() {
    if (this.shouldBlink()) {
      this.blink_timer.start()
      this.redraw()
    } else {
      this.blink_timer.stop()
      this.redraw()
    }
  }
}
