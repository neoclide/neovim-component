import raf from 'raf'

export function checkResize(el, fn) {
  let w
  let h
  function check() {
    let {width, height} = el.getBoundingClientRect()
    if (w && h && (w !== width || h !== height)) {
        fn()
    }
    w = width
    h = height
    setTimeout(() => {
      raf(check)
    }, 200)
  }
  raf(check)
} 
