import Emitter from 'component-emitter'
import Process from './neovim/process'
import Screen from './neovim/screen'
import NeovimStore from './neovim/store'
import {
  updateFontPx,
  updateFontFace,
  updateScreenSize,
  updateLineHeight,
  disableAltKey,
  disableMetaKey,
  changeCursorDrawDelay,
  startBlinkCursor,
  setTitle
} from './neovim/actions'

export default class Neovim extends Emitter {
  constructor(
    command, argv, font, font_size, line_height, disable_alt_key,
    disable_meta_key, draw_delay, blink_cursor, window_title) {
    super()
    this.store = new NeovimStore()
    this.store.dispatcher.dispatch(updateLineHeight(line_height))
    this.store.dispatcher.dispatch(updateFontFace(font))
    this.store.dispatcher.dispatch(updateFontPx(font_size))
    if (disable_alt_key) {
      this.store.dispatcher.dispatch(disableAltKey(true))
    }
    if (disable_meta_key) {
      this.store.dispatcher.dispatch(disableMetaKey(true))
    }
    this.store.dispatcher.dispatch(changeCursorDrawDelay(draw_delay))
    if (blink_cursor) {
      this.store.dispatcher.dispatch(startBlinkCursor())
    }
    this.store.dispatcher.dispatch(setTitle(window_title))
    this.process = new Process(this.store, command, argv)
  }

  attachCanvas(width, height, canvas) {
    Object.defineProperty(this.store, 'canvas', {
      get: function () {
        return canvas
      }
    })
    this.store.dispatcher.dispatch(updateScreenSize(width, height))
    this.screen = new Screen(this.store, canvas)
    const {lines, cols} = this.store.size
    this.process
      .attach(lines, cols)
      .then(() => {
        this.process.client.on('disconnect', () => this.emit('quit'))
        this.emit('process-attached')
      }).catch(err => this.emit('error', err))
  }

  quit() {
    this.process.finalize()
  }

  getClient() {
    return this.process.client
  }

  focus() {
    this.screen.focus()
  }

  // Note:
  // It is better to use 'argv' property of <neovim-client> for apps using Polymer.
  setArgv(argv) {
    if (!this.process.started) {
      throw new Error("Process is not attached yet.  Use 'process-attached' event to ensure to specify arguments.")
    }
    return this.process.client.command('args ' + argv.join(' '))
  }
}
