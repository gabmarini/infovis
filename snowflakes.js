//constants start
var w = 900, //canvas width
    h = 560, //canvas height
    maxRadius = 20, //max snowflake radius
    minRadius = 6, //min snowflake radius
    maxFall = 5, //max direction changes (and path segments from top to bottom) possible for a snowflake (influence velocity) 
    minFall = 3, //min direction changes (and path segments from top to bottom) possible for a snowflake (influence velocity)
    snowflakeBorder = 35, //snowflake's border dimension (useful to scale snowflakes)
    snowflakeHorizontalMoveMax = 100, //maximum left/right snowflake movement for a single transition
    snowflakeRotMax = 20, //not used
    snowflakeRotMin = 10 //not used


//appending canvas to the body with specified width and height
var svg = d3.select('body').append('svg:svg')
    .attr('width', w)
    .attr('height', h)

//snowflake path:d string
var snowflake

//extracting snowflake path:d
d3.xml('snowflake.svg',
    function(error, documentFragment) {

        if (error) {
            return
        }

        var svgNode = documentFragment
            .getElementsByTagName('svg')[0]
            .getElementsByTagName('g')[0]
            .getElementsByTagName('path')[0]

        snowflake = d3.select(svgNode).attr('d')

    })

//appending a borderbox which will contain the snowflakes
var borderbox = svg.append('rect').classed('border-box', true)
    .attr({
        width: w,
        height: h
    })

//appending a fancy background
svg.append('svg:image')
    .attr('href', 'http://www.spriteland.com/sprites/downloads/dark-mountain-vector-background_PNG.png')
    .attr('preserveAspectRatio', 'none')
    .attr('width', w)
    .attr('height', h)


//main cicle start
setInterval(function() {
    //spawn 3 random flakes above the canvas. For info about the flakes read below
    appendToCanvas(RandomFlakes(3))

    //starting main transition
    transition()

}, 1000)

//orchestrating function
function transition() {

    /** 
     *   select all moving flakes that have already completed their transition and restart a new transition.
     *   The attribute T is used to control the state of the transition in act.
     */
    d3.selectAll('.moving')
        .filter(function(d) {
            return d3.select(this).attr('T') == 1
        })
        .attr('T', 0)
        .transition()
        .ease('linear')
        .duration(2000)
        .attr('T', 1)
        .attr('transform', function(d) {
            if (d.y != h - d.radius * 2) {
                var mov = (Math.random() * (d.x + snowflakeHorizontalMoveMax - d.x + snowflakeHorizontalMoveMax)) + (d.x - snowflakeHorizontalMoveMax)
                d.x = Math.max(0, Math.min(w - 2 * d.radius, mov))
            }
            var fall = d.y + d.fall
            if (fall >= h - d.radius * 2) { // if the next point is below the canvas adjust the fall value
                fall = h - d.radius * 2
                d.y = fall
                d3.select(this)
                    .classed('near-end', true) //mark the snowflake as near the end and no more moving
                    .classed('moving', false)
            } else {
                d.y = fall
            }
            return 'translate(' + d.x + ',' + d.y + ') ' + 'scale(' + (d.radius * 2 / 35) + ',' + (d.radius *
                2 / 35) + ')'
        })
        .attr('cx', function(d) {
            return d.x
        })
        .attr('cy', function(d) {
            return d.y
        })
        .attr('r', function(d) {
            return d.radius
        })
        //.tween('attr', checkCollision())
        .each('end', function(d) { //restart the transition from the beginning, marking the stopped snowflakes as "ended"
            d3.selectAll('.near-end')
                .filter(function(d) {
                    return d3.select(this).attr('T') == 1
                })
                .classed('near-end', false)
                .classed('ended', true)
            transition()
        })

}

//function used to control the collision between the flakes, WORKING but NOT USED
function checkCollision() {
    return function(d, i, a) {
        return function(t) {
            if (collide(this)) {

            } else {}
        }
    }
}

/**
 *    collision detection function, the naive approach is quite heavy (O(n^2) where n is the number of flakes on the canvas),
 *    turned off because it slow the animation a lot.
 */
function collide(node) {
    var nodeID = +d3.select(node).attr('id')
    var dx = +d3.select(node).attr('cx')
    var dy = +d3.select(node).attr('cy')
    var r = +d3.select(node).attr('r'),
        nx1 = dx - r,
        nx2 = dx + r,
        ny1 = dy - r,
        ny2 = dy + r
    var colliding = false
    d3.selectAll('g').each(function(point, i) {
        var pointID = +d3.select(this).attr('id')
        var pr = +d3.select(this).attr('r')
        var px = +d3.select(this).attr('cx')
        var py = +d3.select(this).attr('cy')
        var x1 = px - pr,
            y1 = py - pr,
            x2 = px + pr,
            y2 = py + pr
        var x = dx - px,
            y = dy - py,
            l = Math.sqrt(x * x + y * y),
            rad = r + pr
        if (l < rad) {
            l = (l - rad) / l * .5

            if (!isFinite(l)) {
                l = 0
            }
            x *= l
            y *= l
            dx -= x
            dy -= y
            px += x
            py += y

            if (d3.select(this).classed('ended') && d3.select(this).attr('T') == 1) {
                d3.select(node).attr('cx', Math.max(r, Math.min(w - r, dx)))
                d3.select(this).attr('cx', Math.max(pr, Math.min(w - pr, px)))

            } else if (d3.select(node).classed('ended') && d3.select(node).attr('T') == 1) {
                d3.select(node).attr('cx', Math.max(r, Math.min(w - r, dx)))
                d3.select(this).attr('cx', Math.max(pr, Math.min(w - pr, px)))
            } else {
                d3.select(node).attr('cx', Math.max(r, Math.min(w - r, dx)))
                d3.select(node).attr('cy', Math.max(r, Math.min(h - r, dy)))
                d3.select(this).attr('cx', Math.max(pr, Math.min(w - pr, px)))
                d3.select(this).attr('cy', Math.max(py, Math.min(h - pr, py)))
            }



        }
        if (!(nx1 > x2 || nx2 < x1 || ny1 > y2 || ny2 < y1) && pointID != nodeID)
            colliding = true
    })
    return colliding
}

/**
 * This function append the flakes passed as parameter to the canvas, moreover it makes them move marking them as new flakes,
 * as soon the transition ends, the new flakes are marked as "moving" flakes so they can be controlled from the main "transition" function
 */
function appendToCanvas(flakes) {

    var g = svg.selectAll()
        .data(flakes)
        .enter()
        .append('g')
        .classed('new snowflake', true)
        .style('fill-opacity', function(d) {
            return (d.radius - minRadius) / (maxRadius - minRadius)
        })
        .attr('T', 0)
        .attr('transform', function(d) {
            var y = d.y = d.y - d.radius * 2
            return 'translate(' + d.x + ',' + y + ') ' + 'scale(' + (d.radius * 2 / snowflakeBorder) + ',' + (d.radius *
                2 / snowflakeBorder) + ') '
        })
        .attr('cx', function(d) {
            return d.x
        })
        .attr('cy', function(d) {
            return d.y
        })
        .attr('r', function(d) {
            return d.radius
        })
        .attr('id', function(d) {
            return d.id
        })

    g.append('path')
        .attr('d', snowflake)

    g.transition()
        .ease('linear')
        .duration(2000)
        .attr('T', 1)
        .attr('transform', function(d) {
            if (d.y != h - d.radius) {
                var mov = (Math.random() * (d.x + snowflakeHorizontalMoveMax - d.x + snowflakeHorizontalMoveMax)) + (d.x - snowflakeHorizontalMoveMax)
                d.x = Math.max(2 * d.radius, Math.min(w - 2 * d.radius, mov))
            }
            d.y = d.y + d.fall
            return 'translate(' + d.x + ',' + d.y + ') ' + 'scale(' + (d.radius * 2 / snowflakeBorder) + ',' + (d.radius *
                2 / snowflakeBorder) + ') '
        })
        .each('end', function(d) {
            if (!d3.select(this).classed('near-end')) {
                d3.select(this).classed('moving', true)
            }
            d3.select(this).classed('new', false)
            transition()
        })

}

/**
 * Function used to create "num" json object used to render the snowflakes, this function is invoked once every second,
 * the json objects are then passed to the render function.
 */
function RandomFlakes(num) {
    return d3.range(num).map(function() {
        var r = Math.random() * (maxRadius - minRadius) + minRadius
        var numfall = Math.random() * (maxFall - minFall) + minFall
        numfall = numfall / ((r - minRadius) / (maxRadius - minRadius))
        var fallingY = h / numfall
        var rot = Math.floor(Math.random() * (snowflakeRotMax - snowflakeRotMin) + snowflakeRotMin)
        return {
            radius: r,
            x: Math.random() * w - r * 2,
            y: -r,
            id: Math.random(),
            fall: fallingY,
            rot: rot
        }
    })
}