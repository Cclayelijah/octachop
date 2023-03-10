import type p5Type from 'p5'

let x = 50
let y = 50

let canvasX: number
let canvasY: number

export const setup = (p5: p5Type, canvasParentRef: Element): void => {
  canvasX = p5.windowWidth
  canvasY = p5.windowHeight
  p5.createCanvas(canvasX, canvasY).parent(canvasParentRef)
}

export const draw = (p5: p5Type): void => {
  p5.background(0)
  p5.ellipse(x, y, 70, 70)
  if (x !== canvasX - 50 && y === 50) {
    x++
  }

  if (x === canvasX - 50 && y !== canvasY - 50) {
    y++
  }

  if (y === canvasY - 50 && x !== 50) {
    x--
  }

  if (y !== 50 && x === 50) {
    y--
  }
}
