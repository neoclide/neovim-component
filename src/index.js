import Polymer from 'polymer'
import Neovim from './neovim'
import {checkResize} from './util'

Polymer({
  is: 'neovim-editor',

  properties: {
    width: Number,
    height: Number,
    fontSize: {
      type: Number,
      value: 12,
    },
    font: {
      type: String,
      value: 'monospace',
    },
    lineHeight: {
      type: Number,
      value: 1.3,
    },
    nvimCmd: {
      type: String,
      value: 'nvim',
    },
    argv: {
      type: Array,
      value: () => [],
    },
    disableAltKey: {
      type: Boolean,
      value: false,
    },
    disableMetaKey: {
      type: Boolean,
      value: false,
    },
    cursorDrawDelay: {
      type: Number,
      value: 10,
    },
    noBlinkCursor: {
      type: Boolean,
      value: true,
    },
    windowTitle: {
      type: String,
      value: 'Neovim',
    },
    editor: Object,
    onProcessAttached: Object,
    onQuit: Object,
    onError: Object,
    resizeHandler: Object,
  },

  ready: function() {
    this.editor = new Neovim(
      this.nvimCmd,
      this.argv,
      this.font,
      this.fontSize,
      this.lineHeight,
      this.disableAltKey,
      this.disableMetaKey,
      this.cursorDrawDelay,
      !this.noBlinkCursor,
      this.windowTitle
    )
    this.resizeHandler = null

    if (this.onError) {
      this.editor.on('error', this.onError)
    }

    if (this.onQuit) {
      this.editor.on('quit', this.onQuit)
    }

    if (this.onProcessAttached) {
      this.editor.on('process-attached', this.onProcessAttached)
    }
  },

  attached: function() {
    const canvas = this.querySelector('.neovim-canvas')
    const width = this.width || canvas.parentElement.offsetWidth
    const height = this.height || canvas.parentElement.offsetHeight
    this.editor.attachCanvas(width, height, canvas)
    let wrapper = this.querySelector('.neovim-wrapper')

    checkResize(wrapper, () => {
      this.editor.screen.checkShouldResize()
    })

    //window.addEventListener('resize', debounce(() => {
    //  this.editor.screen.checkShouldResize()
    //}, 100))
  },
  detached: function() {
    this.editor.emit('detach')
    if (this.unbind_resize) this.unbind_resize()
  },

  attributeChanged: function(name, type) {
    this.editor.emit('change-attribute', name, type)
  }
})
