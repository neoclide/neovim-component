// Note:
// Use renderer's node.js integration to avoid using ipc for large data transfer
const child_process = require('child_process')
import {attach} from 'promised-neovim-client'
import * as Action from './actions'
import log from '../log'

export default class NeovimProcess {
  constructor( store, command, argv) {
    this.store = store
    this.command = command
    this.argv = argv
    this.started = false
    this.argv.unshift('--embed')
  }

  attach(lines, columns) {
    this.client = null

    this.neovim_process = child_process.spawn(
        this.command, this.argv,
        {stdio: ['pipe', 'pipe', process.stderr]})

    return new Promise((resolve, reject) => {
      this.neovim_process.on('error', err => {
        reject(err)
      })
      if (!this.neovim_process.pid) return reject(new Error('neovim process not started'))
      attach(this.neovim_process.stdin, this.neovim_process.stdout)
        .then(nvim => {
          this.client = nvim
          nvim.on('request', this.onRequested.bind(this))
          nvim.on('notification', this.onNotified.bind(this))
          nvim.on('disconnect', this.onDisconnected.bind(this))
          nvim.uiAttach(columns, lines, true, true /*notify*/)
          this.started = true
          log.info(`nvim attached: ${this.neovim_process.pid} ${lines}x${columns} ${JSON.stringify(this.argv)}`)
          this.store.on('input', i => nvim.input(i))
          this.store.on('update-screen-bounds', (lines, cols) => nvim.uiTryResize(cols, lines))

          // Note:
          // Neovim frontend has responsiblity to emit 'GUIEnter' on initialization.
          setTimeout(() => {
            this.client.command('silent doautocmd <nomodeline> GUIEnter')
          }, 0)
          resolve(nvim)
        }, reject)
    })
  }

  onRequested(method, args, response) {
    log.info('requested: ', method, args, response)
  }

  onNotified(method, args) {
    if (method === 'redraw') {
      this.redraw(args)
    } else {
      // User defined notifications are passed here.
      log.debug('Unknown method', method, args)
    }
  }

  onDisconnected() {
    log.info('disconnected: ' + this.neovim_process.pid)
    // TODO:
    // Uncomment below line to close window on quit.
    // I don't do yet for debug.
    //global.require('electron').remote.getCurrentWindow().close()
    this.started = false
  }

  finalize() {
    return this.client.uiDetach().then(() => {
      this.client.quit()
      this.started = false
    })
  }

 redraw(events) {
    const d = this.store.dispatcher
    for (const e of events) {
      const name = e[0]
      const args = e[1]
      switch (name) {
        case 'put':
          e.shift()
          if (e.length !== 0) {
            d.dispatch(Action.putText(e))
          }
          break
        case 'cursor_goto':
          d.dispatch(Action.cursor(args[0], args[1]))
          break
        case 'highlight_set':
          e.shift()
          {
          const highlights = [].concat.apply([], e)
          highlights.unshift({})
          const merged_highlight = Object.assign.apply(Object, highlights)

          d.dispatch(Action.highlight(merged_highlight))
          }
          break
        case 'clear':
          d.dispatch(Action.clearAll())
          break
        case 'eol_clear':
          d.dispatch(Action.clearEndOfLine())
          break
        case 'scroll':
          d.dispatch(Action.scrollScreen(args[0]))
          break
        case 'set_scroll_region':
          d.dispatch(Action.setScrollRegion({
            top: args[0],
            bottom: args[1],
            left: args[2],
            right: args[3]
          }))
          break
        case 'resize':
          d.dispatch(Action.resize(args[1], args[0]))
          break
        case 'update_fg':
          d.dispatch(Action.updateForeground(args[0]))
          break
        case 'update_bg':
          d.dispatch(Action.updateBackground(args[0]))
          break
        case 'update_sp':
          d.dispatch(Action.updateSpecialColor(args[0]))
          break
        case 'mode_change':
          d.dispatch(Action.changeMode(args[0]))
          break
        case 'busy_start':
          d.dispatch(Action.startBusy())
          break
        case 'busy_stop':
          d.dispatch(Action.stopBusy())
          break
        case 'mouse_on':
          d.dispatch(Action.enableMouse())
          break
        case 'mouse_off':
          d.dispatch(Action.disableMouse())
          break
        case 'bell':
          d.dispatch(Action.bell(false))
          break
        case 'visual_bell':
          d.dispatch(Action.bell(true))
          break
        case 'set_title':
          d.dispatch(Action.setTitle(args[0]))
          break
        case 'set_icon':
          d.dispatch(Action.setIcon(args[0]))
          break
        default:
          log.warn('Unhandled event: ' + name, args)
          break
      }
    }
  }
}

