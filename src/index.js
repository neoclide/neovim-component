import Polymer from 'polymer'
import Neovim from './neovim'
import debounce from 'debounce'

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
    const canvas = document.querySelector('.neovim-canvas')
    const width = this.width || canvas.parentElement.offsetWidth
    const height = this.height || canvas.parentElement.offsetHeight
    this.editor.attachCanvas(width, height, canvas)
    this.resize_listener = debounce(() => {
      this.editor.screen.checkShouldResize()
    }, 100)
    window.addEventListener('resize', this.resize_listener)
  },
  detached: function() {
    this.editor.emit('detach')
    if (this.resize_listener) {
      window.removeEventListener('resize', this.resize_listener)
    }
  },

  attributeChanged: function(name, type) {
    this.editor.emit('change-attribute', name, type)
  }
})
