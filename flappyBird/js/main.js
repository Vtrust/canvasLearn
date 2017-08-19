/**
 * Created by 14798 on 2017/8/16.
 */
// 文件列表
var imglist = [
    {"name": "birds", "src": "res/birds.png"},
    {"name": "land", "src": "res/land.png"},
    {"name": "pipe1", "src": "res/pipe1.png"},
    {"name": "pipe2", "src": "res/pipe2.png"},
    {"name": "sky", "src": "res/sky.png"}
];

// 小鸟设置
const birdSpeed = 0.0003;
const birdA = 0.0005;

// 天空、地面、管道设置
var skySpeed = -0.01;
var landSpeed = -0.1;
var pipe1Speed = -0.1;

// 屏幕宽高
var WINDOW_WIDTH;
var WINDOW_HEIGHT;

// 缩放比例
var PROPORTION;

// 分数
var SCORE = 0;


var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");

var click = true;

window.onload = function () {

    //获得屏宽高
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    //设置全屏显示
    cvs.width = WINDOW_WIDTH;
    cvs.height = WINDOW_HEIGHT;

    // 对天空的处理
    var skyX = 0;
    var skyY = 0;
    var landY = 0;
    var drawHeight = 0;
    var landNum = 0;
    var pipelNum = 0;
    var birdY = 0;

    //屏幕长宽对比判断
    if (WINDOW_WIDTH > WINDOW_HEIGHT) {
        PROPORTION = WINDOW_WIDTH / 800;
        skyY = (PROPORTION * 600 - WINDOW_HEIGHT) * 2 / 3;
        if (WINDOW_HEIGHT * 1 / 5 < 112 * PROPORTION) {
            landY = WINDOW_HEIGHT * 4 / 5;
        } else {
            landY = WINDOW_HEIGHT - 112 * PROPORTION;
        }
        birdY = landY / 3;
    } else {
        PROPORTION = WINDOW_HEIGHT / 600;
        landY = WINDOW_HEIGHT - 112 * PROPORTION;
        birdY = WINDOW_HEIGHT / 3;
    }
    landNum = Math.ceil(WINDOW_WIDTH / (336 * PROPORTION) + 1);
    pipelNum = Math.ceil(WINDOW_WIDTH / (200 * PROPORTION) + 1);
    drawHeight = landY;

    load(imglist, function (imgEls) {
        start(imgEls);
    });



    function start(imgEls){
        //天空背景图
        var sky1 = new Sky(imgEls["sky"], skyX, skyY, PROPORTION, skySpeed, ctx);
        //地面初始化
        var lands = [];
        for (var i = 0; i < landNum; i++) {
            lands[i] = new Land(imgEls["land"], i, landY, PROPORTION, landSpeed, ctx);
        }
        //管道初始化
        var pipes = [];
        for (var j = 0; j < pipelNum; j++) {
            pipes[j] = new Pipe(imgEls["pipe2"], imgEls["pipe1"], (400 + j * 200), drawHeight, PROPORTION, pipe1Speed, ctx);
        }
        pipes[0].setCount(pipelNum, 200);
        pipes[0].setScore(0);
        //小鸟初始化
        var bird = new Bird(imgEls["birds"], WINDOW_WIDTH / 4, birdY, PROPORTION, birdSpeed, birdA, ctx);
        //时间初始化
        var preTime = Date.now();
        var gameOver = false;
        var clickOver = false;

        //主体循环
        function run() {
            var now = Date.now();
            var dt = now - preTime; // 毫秒差
            preTime = now;
            ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
            //--------图片绘制区域-------

            sky1.draw();

            pipes.forEach(function (pipe) {
                if(!clickOver){
                    pipe.update(dt);
                }
                pipe.draw();
            });

            lands.forEach(function (land) {
                if(!clickOver) {
                    land.update(dt);
                }
                land.draw();
            });
            lands[0].setCount(landNum);

            bird.update(dt);
            bird.draw();


            // 分数显示

            //设置字体填充颜色
            ctx.font = "30px microsoft yahei";
            ctx.fontWeight = "bold";
            ctx.textAlign = "center";
            ctx.fillStyle = "#fff";
            if(gameOver){
                //从坐标点(50,50)开始绘制文字
                ctx.font = "40px microsoft yahei";
                ctx.fillText("游戏结束", WINDOW_WIDTH / 2, WINDOW_HEIGHT /3);
                ctx.font = "30px microsoft yahei";
                ctx.fillText("得分: "+pipes[0].getScore(), WINDOW_WIDTH / 2, WINDOW_HEIGHT *3/7);
                ctx.fillText("点击重新开始", WINDOW_WIDTH / 2, WINDOW_HEIGHT *4/7);
            }else {
                ctx.fillText(pipes[0].getScore(), WINDOW_WIDTH / 2, WINDOW_HEIGHT / 6);
            }

            //-------------------------
            // 任何违规都会触发 gameOver=true；
            var birdX = bird.x;
            var birdY = bird.y;


            if (!gameOver) {


                //碰到天和地
                if (bird.y <= 20) {
                    click = false;
                }
                else if (click) {
                    for (var m = 0; m < pipes.length; m++) {
                        if (pipes[m].hitTest(birdX, birdY, 25)) {
                            clickOver = true;
                            click = false;
                            break;
                        }
                    }
                }
                else if (!click && !clickOver) {
                    click = true;
                }
                console.log(click);
                if (bird.y >= landY - 35 * PROPORTION / 2) {
                    bird.y = landY - 35 * PROPORTION / 2;
                    requestAnimationFrame(run);
                    gameOver = true;
                }
                requestAnimationFrame(run);
            }
        }

        requestAnimationFrame(run);

        //设置点击事件。给小鸟一个瞬时的向上速度

        cvs.addEventListener("click", function (event) {
            console.log(event);
            if (click) {
                bird.speed = -0.25 * PROPORTION;
            }
            if(gameOver){
                start(imgEls);
                click=true;
                gameOver=!gameOver;
            }

        });

        document.onkeydown = function (event) {
            if (click) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode === 32) { // 按 Esc
                    bird.speed = -0.3 * PROPORTION;
                }
            }
        };
    }
};

