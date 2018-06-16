let particles_a = [];
let particles_b = [];
let particles_c = [];
let nums = 1500;
let noiseScale = 800;

let width = 800;
let height = 1600;

window.onload = function() {
    console.log('loaded')
    let canvas = document.getElementById('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    width = canvas.width - 32
    height = canvas.height - 32
    let ctx = canvas.getContext('2d')
    setup(ctx)
    draw(ctx)
}

function setup(ctx) {
    console.log('setup')
    noise.seed(Math.random())

    ctx.rect(0, 0, width, height)
    ctx.fillStyle = 'rgb(20, 8, 35)'
    ctx.fill()

    for (let i=0; i < nums; i++) {
        particles_b[i] = new Particle(random(0, width), random(0, height));
        particles_c[i] = new Particle(random(0, width), random(0, height));
        particles_a[i] = new Particle(random(0, width), random(0, height));
    }
}

let angle = Math.PI / 8
function draw(ctx) {
    let speed = 0.5
    let flow = new Vector(Math.cos(angle), Math.sin(angle)).mult(speed)
    // let flow = new Vector(0, 0)

    for (let i=0; i < nums; i++) {
        let radius = map(i, 0, nums, 1, 2);
        let alpha = map(i, 0, nums, 0, 250);

        ctx.strokeStyle = `rgba(152, 93, 242, ${alpha})`;
        particles_a[i].impulse(flow).move()
        particles_a[i].display(radius, ctx);

        ctx.strokeStyle = `rgba(0, 147, 32, ${alpha})`;
        particles_b[i].impulse(flow).move();
        particles_b[i].display(radius, ctx);

        ctx.strokeStyle = `rgba(79, 232, 204, ${alpha})`;
        particles_c[i].impulse(flow).move();
        particles_c[i].display(radius, ctx);
    }
    setTimeout(() => draw(ctx), 15);
}


function random(min, maxUpTo) {
    return Math.random() * (maxUpTo - min) + min
}

function Particle(x, y) {
    this.dir = new Vector(0, 0)
    this.vel = new Vector(0, 0)
    this.forces = new Vector(0, 0)
    this.pos = new Vector(x, y)
    this.speed = 1

    // move function for each tick
    this.move = function() {
        let angle = noise.perlin2(this.pos.x/noiseScale, this.pos.y/noiseScale)
                    * Math.PI * 2 * noiseScale;
        this.dir.x = Math.cos(angle);
        this.dir.y = Math.sin(angle);
        this.vel = this.dir.copy()
                           .add(this.forces)
                           .mult(this.speed);
        this.pos = this.pos.add(this.vel);
        // reset forces
        this.forces = new Vector(0, 0)
        return this
    }

    /**
     * add an external impulse like wind
     * @param  {Vector} velocity
     * @return {Particle}
     */
    this.impulse = function(velocity) {
        this.forces = this.forces.add(velocity)
        return this
    }

    this.checkEdge = function() {
        if (this.pos.x > width || this.pos.x < 0
         || this.pos.y > height || this.pos.y < 0) {
            this.pos.x = random(50, width)
        }
    }

    this.display = function(r, ctx) {
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, r, 0, 2*Math.PI)
        ctx.stroke()
    }
}


function ellipse(x, y, r1, r2) {
    throw new Error('implement ellipse!')
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
