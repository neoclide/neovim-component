export var Kind = {}

Kind[Kind["Bell"] = 0] = "Bell"
Kind[Kind["BusyStart"] = 1] = "BusyStart"
Kind[Kind["BusyStop"] = 2] = "BusyStop"
Kind[Kind["ChangeCursorDrawDelay"] = 3] = "ChangeCursorDrawDelay"
Kind[Kind["ClearAll"] = 4] = "ClearAll"
Kind[Kind["ClearEOL"] = 5] = "ClearEOL"
Kind[Kind["Cursor"] = 6] = "Cursor"
Kind[Kind["DisableMouse"] = 7] = "DisableMouse"
Kind[Kind["DisableAltKey"] = 8] = "DisableAltKey"
Kind[Kind["DisableMetaKey"] = 9] = "DisableMetaKey"
Kind[Kind["DragEnd"] = 10] = "DragEnd"
Kind[Kind["DragStart"] = 11] = "DragStart"
Kind[Kind["DragUpdate"] = 12] = "DragUpdate"
Kind[Kind["EnableMouse"] = 13] = "EnableMouse"
Kind[Kind["Highlight"] = 14] = "Highlight"
Kind[Kind["Input"] = 15] = "Input"
Kind[Kind["Mode"] = 16] = "Mode"
Kind[Kind["PutText"] = 17] = "PutText"
Kind[Kind["Resize"] = 18] = "Resize"
Kind[Kind["ScrollScreen"] = 19] = "ScrollScreen"
Kind[Kind["SetIcon"] = 20] = "SetIcon"
Kind[Kind["SetScrollRegion"] = 21] = "SetScrollRegion"
Kind[Kind["SetTitle"] = 22] = "SetTitle"
Kind[Kind["StartBlinkCursor"] = 23] = "StartBlinkCursor"
Kind[Kind["StopBlinkCursor"] = 24] = "StopBlinkCursor"
Kind[Kind["UpdateBG"] = 25] = "UpdateBG"
Kind[Kind["UpdateFG"] = 26] = "UpdateFG"
Kind[Kind["UpdateSP"] = 27] = "UpdateSP"
Kind[Kind["UpdateFontFace"] = 28] = "UpdateFontFace"
Kind[Kind["UpdateFontPx"] = 29] = "UpdateFontPx"
Kind[Kind["UpdateFontSize"] = 30] = "UpdateFontSize"
Kind[Kind["UpdateLineHeight"] = 31] = "UpdateLineHeight"
Kind[Kind["UpdateScreenBounds"] = 32] = "UpdateScreenBounds"
Kind[Kind["UpdateScreenSize"] = 33] = "UpdateScreenSize"
Kind[Kind["WheelScroll"] = 34] = "WheelScroll"
Kind[Kind["FocusChanged"] = 35] = "FocusChanged"
Kind[Kind["StartComposing"] = 36] = "StartComposing"
Kind[Kind["UpdateComposing"] = 37] = "UpdateComposing"
Kind[Kind["EndComposing"] = 38] = "EndComposing"
Kind[Kind["StartSearch"] = 39] = "StartSearch"
Kind[Kind["ChangeOpacity"] = 40] = "ChangeOpacity"

export function putText(text) {
  return {
    type: Kind.PutText,
    text,
  }
}

export function cursor(line, col) {
  return {
    type: Kind.Cursor,
    line, col,
  }
}

export function highlight(highlight) {
  return {
    type: Kind.Highlight,
    highlight,
  }
}

export function clearAll() {
  return {
    type: Kind.ClearAll,
  }
}

export function clearEndOfLine() {
  return {
    type: Kind.ClearEOL,
  }
}

export function resize(lines, cols) {
  return {
    type: Kind.Resize,
    lines, cols,
  }
}

export function updateForeground(color) {
  return {
    type: Kind.UpdateFG,
    color,
  }
}

export function updateBackground(color) {
  return {
    type: Kind.UpdateBG,
    color,
  }
}

export function updateSpecialColor(color) {
  return {
    type: Kind.UpdateSP,
    color,
  }
}

export function changeMode(mode) {
  return {
    type: Kind.Mode,
    mode,
  }
}

export function startBusy() {
  return {
    type: Kind.BusyStart,
  }
}

export function stopBusy() {
  return {
    type: Kind.BusyStop,
  }
}

export function updateFontSize(draw_width, draw_height, width, height) {
  return {
    type: Kind.UpdateFontSize,
    draw_width, draw_height,
    width, height,
  }
}

export function inputToNeovim(input) {
  return {
    type: Kind.Input,
    input,
  }
}

export function updateFontPx(font_px) {
  return {
    type: Kind.UpdateFontPx,
    font_px,
  }
}

export function updateFontFace(font_face) {
  return {
    type: Kind.UpdateFontFace,
    font_face,
  }
}

export function updateScreenSize(width, height) {
  return {
    type: Kind.UpdateScreenSize,
    width, height,
  }
}

// Note:
// This function has the same effect as resize() but resize() is used
// for neovim's UI event and this function is used to change screen bounds
// via NeovimScreen's API.
export function updateScreenBounds(lines, cols) {
  return {
    type: Kind.UpdateScreenBounds,
    lines, cols,
  }
}

export function enableMouse() {
  return {
    type: Kind.EnableMouse,
  }
}

export function disableMouse() {
  return {
    type: Kind.DisableMouse,
  }
}

export function dragStart(event) {
  return {
    type: Kind.DragStart,
    event,
  }
}

export function dragUpdate(event) {
  return {
    type: Kind.DragUpdate,
    event,
  }
}

export function dragEnd(event) {
  return {
    type: Kind.DragEnd,
    event,
  }
}

export function bell(visual) {
  return {
    type: Kind.Bell,
    visual,
  }
}

export function setTitle(title) {
  return {
    type: Kind.SetTitle,
    title,
  }
}

export function setIcon(icon_path) {
  return {
    type: Kind.SetIcon,
    icon_path,
  }
}

export function wheelScroll(event) {
  return {
    type: Kind.WheelScroll,
    event,
  }
}

export function scrollScreen(cols) {
  return {
    type: Kind.ScrollScreen,
    cols,
  }
}

export function setScrollRegion(region) {
  return {
    type: Kind.SetScrollRegion,
    region,
  }
}

export function notifyFocusChanged(focused) {
  return {
    type: Kind.FocusChanged,
    focused,
  }
}

export function updateLineHeight(line_height) {
  return {
    type: Kind.UpdateLineHeight,
    line_height,
  }
}

export function disableAltKey(disabled) {
  return {
    type: Kind.DisableAltKey,
    disabled,
  }
}

export function disableMetaKey(disabled) {
  return {
    type: Kind.DisableMetaKey,
    disabled,
  }
}

export function changeCursorDrawDelay(delay) {
  return {
    type: Kind.ChangeCursorDrawDelay,
    delay,
  }
}

export function startBlinkCursor() {
  return {
    type: Kind.StartBlinkCursor,
  }
}
export function stopBlinkCursor() {
  return {
    type: Kind.StopBlinkCursor,
  }
}

export function startComposing() {
  return {
    type: Kind.StartComposing
  }
}

export function updateComposing(input) {
  return {
    type: Kind.UpdateComposing,
    input
  }
}

export function endComposing() {
  return {
    type: Kind.EndComposing
  }
}

export function startSearch () {
  return {
    type: Kind.StartSearch
  }
}

export function changeOpacity(opacity) {
  return {
    type: Kind.ChangeOpacity,
    opacity
  }
}
