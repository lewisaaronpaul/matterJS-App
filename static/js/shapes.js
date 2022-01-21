// Two separate things that matter.js needs
// First thing: An engine - this does computation and math
// Second thing: A renderer - this draws what is happening

// Where is matter being deployed
const matterSectionTag = document.querySelector("section.shapes")

// What's the width and height of the page
const w = window.innerWidth
const h = window.innerHeight

// module aliases
// const Engine = Matter.Engine
// const Render = Matter.Render
// const Runner = Matter.Runner
// const Bodies = Matter.Bodies
// const Composite = Matter.Composite
const {Engine, Render, Bodies, World, MouseConstraint, Composites, Query} = Matter

// Creat engine and renderer
const engine = Engine.create()
const renderer = Render.create({
    element: matterSectionTag,
    engine: engine,
    options: {
        width: w,
        height: h,
        background: "#000000",
        wireframes: false,
        pixelRatio: window.devicePixelRatio
    }
})

// Function to create a shape
const createShape = function (x, y) {
    const randomNum = Math.random()

    if (randomNum > 0.5) {
        return Bodies.rectangle(x, y, 38, 50, {
            frictionAir: 0.010,  //Adding air friction
            render: {
                // fillStyle: "red",
                sprite: {
                    texture: "../static/images/BZE.png",
                    xScale: 0.8,
                    yScale: 0.8
                }
            }
        })
    } else {
        return Bodies.circle(x, y, 25, {
            frictionAir: 0.010,  //Adding air friction
            render: {
                // fillStyle: "red",
                sprite: {
                    texture: "../static/images/12-ball.png",
                    xScale: 0.1,
                    yScale: 0.1
                }
            }
        })  
    }

}

const bigBall = Bodies.circle(w / 2, h / 2, Math.min(w / 4, h / 4), {
    isStatic: true,
    render: {
        fillStyle: "#ffffff"
    }
})

const wallOptions = {
    isStatic: true,
    render: {
        visible: true,
        fillStyle: "#f68432"
    }
}

const ground = Bodies.rectangle(w / 2, h, w + 100, 25, wallOptions)
const ceiling = Bodies.rectangle(w / 2, 0, w + 100, 25, wallOptions)
const leftWall = Bodies.rectangle(0, h / 2, 25, h + 100, wallOptions)
const rightWall = Bodies.rectangle(w, h / 2, 25, h + 100, wallOptions)

// We want the mouse to interact with the objects
const mouseControl = MouseConstraint.create(engine, {
    element: matterSectionTag,
    constraint: {
        render: {
            visible: false
        }
    }
})

const initialShapes = Composites.stack(50, 50, 20, 5, 40, 40, function (x, y) {
    return createShape(x, y)
})

// Add to the engine.world
World.add(engine.world, [
    bigBall, 
    ground, 
    ceiling, 
    leftWall, 
    rightWall, 
    mouseControl,
    initialShapes
])

// The event listeners

// On click, add a new shape
document.addEventListener("click", function(event) {

    const shape = createShape(event.pageX, event.pageY)

    // initialShapes.bodies.push(shape)
    World.add(engine.world, [shape])
})

// // On click, add a new shape
// document.addEventListener("touchstart", function(event) {

//     const shape = createShape(event.pageX, event.pageY)

//     // initialShapes.bodies.push(shape)
//     World.add(engine.world, [shape])
// })


// When we move our mouse, check matter for any collision
// Does the mouse touch a body?
// document.addEventListener("mousemove", function (event) {
//     const vector = {
//         x: event.pageX,
//         y: event.pageY
//     }
//     const hoveredShapes = Query.point(initialShapes.bodies, vector)

//     hoveredShapes.forEach(shape => {
//         shape.render.sprite = null
//         shape.render.fillStyle = "red"
//     })
// })



// Run both the engine and the renderer
Engine.run(engine)
Render.run(renderer)

let time = 0
const changeGravity = function () {
    time = time + 0.01

    const gravityX = Math.cos(time)
    const gravityY = Math.sin(time)

    engine.world.gravity.x = gravityX
    engine.world.gravity.y = gravityY

    requestAnimationFrame(changeGravity)
}

changeGravity()

// Respond to the device orientation
window.addEventListener("deviceorientation", function (event) {
    engine.world.gravity.x = event.gamma / 30
    engine.world.gravity.y = event.beta / 30
})


