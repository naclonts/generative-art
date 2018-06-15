/**
 * Dragon Curve
 *
 * Rules
 *  variables : X Y
 *  constants : F + -
 *  start : FX
 *  rules : (X → X+YF+), (Y → -FX-Y)
 *  angle : pi / 2
 */

let width = 800
let height = 1600

let pos
let angle = Math.PI / 2 // current angle
let stepLength = 10
let numSteps = 11
let iteration = 0

// To try: base hue on background image color
let hue = 300 // final hue value

// Angle change amount. Interesting values: pi/1.9, pi/2.1
let angleDelta = Math.PI / 2

// replacement rules
let productionRules = [
    ['X', 'X+YF+'],
    ['Y', '-FX-Y']
]


// get it started
window.onload = async function() {
    console.log('loaded')
    let canvas = document.getElementById('canvas')
    width = window.innerWidth - 32
    height = window.innerHeight * 2
    canvas.width = width
    canvas.height = height

    let ctx = canvas.getContext('2d')
    ctx.strokeStyle = 'black'

    pos = new Vector(width / 2, height / 2)

    setup(ctx)
    let start = 'FX' // initial rule
    ctx.moveTo(pos.x, pos.y)
    ctx.font = '16px sans-serif'
    await draw(ctx, start)
    console.log('done')
}

function setup(ctx) {

}

async function draw(ctx, instruction) {
    console.log(iteration)
    if (iteration++ > numSteps) return
    hue -= 360 / numSteps

    pos = new Vector(width/2, height/2)
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    ctx.fillText(`Iteration ${iteration}. Instruction length ${instruction.length}.`, 15, 15)
    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`

    // do drawing actions
    for (let c of instruction) {
        if (c == 'F') {
            // await wait(10) // 'animate' drawing
            ctx.beginPath()
            ctx.moveTo(pos.x, pos.y)

            let move = new Vector(
                Math.cos(angle) * stepLength,
                Math.sin(angle) * stepLength
            )
            pos = pos.add(move)

            hue += 360 / (instruction.length / 2)
            ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`

            ctx.lineTo(pos.x, pos.y)
            ctx.stroke()
        }
        if (c == '-') {
            angle -= angleDelta
        }
        if (c == '+') {
            angle += angleDelta
        }
    }

    // replace variables for next evolution
    let newInstr = '';
    for (let i=0; i < instruction.length; i++) {
        let hasRule = false
        for (let [match, replacement] of productionRules) {
            if (instruction[i] == match) {
                newInstr += replacement
                hasRule = true
            }
        }
        if (!hasRule) newInstr += instruction[i]
    }

    // stepLength = map(iteration, 0, numSteps, 100, 7)

    await wait(750)
    draw(ctx, newInstr)
}


function random(min, maxUpTo) {
    return Math.random() * (maxUpTo - min) + min
}


async function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}


/**
 * Translate value from one range of numbers to another.
 * @param  {Number} val
 * @param  {Number} min1 start of original range
 * @param  {Number} max1 end of original range
 * @param  {Number} min2 start of new range
 * @param  {Number} max2 end of new range
 * @return {Number} val translated into new range
 */
function map(val, min1, max1, min2, max2) {
    return min2 + (max2 - min2) * ((val-min1) / (max1-min1));
}
