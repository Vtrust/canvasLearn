/**
 * Created by pancake on 2016/11/26 0026.
 */
var WINDOW_WIDTH ;
var WINDOW_HEIGHT ;
var balls = [];
var canvas = document.getElementById("cvs");
var context = canvas.getContext("2d");
var mX;
var mY;
window.onload = function () {


    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

	//mX=WINDOW_WIDTH/2;
	//mY=WINDOW_HEIGHT/2;

    addBall(50,8);
    setInterval(
        function(){
            render(context);
            update();
        },
        30
    );
}

function render(cxt) {
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    var back=cxt.createRadialGradient(WINDOW_WIDTH/2,WINDOW_HEIGHT/2,0,WINDOW_WIDTH/2,WINDOW_HEIGHT/2,WINDOW_WIDTH);

    back.addColorStop(0.0,"#353535");
    back.addColorStop(0.75,"black");
    cxt.fillStyle=back;
    cxt.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);

    drawBalls(cxt);


    canvas.addEventListener("mousemove",detect);
	canvas.addEventListener("touchmove",detect);

    centerBalls(20);
    drawLine(200,0.3,mX,mY);
}

function centerBalls(n){
    for(var i=0;i<balls.length;i=i+Math.floor(balls.length/n)){
        var x=balls[i].x;
        var y=balls[i].y;
        drawLine(200,0.01,x,y);
    }
}

function detect(event){
    var x=event.clientX-canvas.getBoundingClientRect().left;
    var y=event.clientY-canvas.getBoundingClientRect().top;

    mX=x;
    mY=y;
}



function drawLine(distant,n,x,y){
    for(var i=0;i<balls.length;i++){
        if(getDistant(x,y,balls[i].x,balls[i].y)<distant){
            context.moveTo(balls[i].x,balls[i].y);
            context.lineTo(x,y);
            context.lineWidth=n;
            context.strokeStyle="#fff";
            context.stroke();
        }
    }
}

function getDistant(x1,y1,x2,y2){
    return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function drawBalls(cxt) {
    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle =  balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, balls[i].r, 0, Math.PI * 2, true);
        cxt.closePath();

        cxt.fill();
    }
}

function getRandomColor(){

    return  '#' +
        (function(color){
            return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
            && (color.length == 6) ?  color : arguments.callee(color);
        })('');
}

function addBall(num,r1) {
    for (var i = 0; i < num; i++) {
        //var r1=Math.random() * 60 + 10;
        var color1=getRandomColor();
        var ball = {

            r: r1,
            x: Math.random() * (WINDOW_WIDTH - 2 * r1)+r1,
            y: Math.random() * (WINDOW_HEIGHT - 2 * r1)+r1,
            g: 3,
            vx: (Math.random()*0.5) * Math.pow(-1, Math.ceil(Math.random() * 1000)),
            vy: (Math.random()*0.5) * Math.pow(-1, Math.ceil(Math.random() * 1000)),
            color: "#fff"
        };

        balls.push(ball);
    }

}

function update() {
    updateBalls();
}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x = balls[i].x + balls[i].vx;
        balls[i].y = balls[i].y + balls[i].vy;
        if (balls[i].x <= balls[i].r || balls[i].x >= WINDOW_WIDTH - balls[i].r) {
            balls[i].vx = -balls[i].vx;
        }
        if (balls[i].y <= balls[i].r || balls[i].y >= WINDOW_HEIGHT - balls[i].r) {
            balls[i].vy = -balls[i].vy;
        }
    }
}
