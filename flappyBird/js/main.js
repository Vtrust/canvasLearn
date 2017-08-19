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
var birdSpeed = 0;
var birdA = 0.0008;

// 天空、地面、管道设置
var skySpeed = -0.01;
var landSpeed = -0.1;
var pipe1Speed = -0.1;

// 屏幕宽高
var WINDOW_WIDTH;
var WINDOW_HEIGHT;

// 缩放比例
var PROPORTION;

var cvs = document.getElementById("cvs");
var ctx = cvs.getContext("2d");
// polyfill 提供了这个方法用来获取设备的 pixel ratio
var getPixelRatio = function(context) {
    var backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    return (window.devicePixelRatio || 1) / backingStore;
};

var ratio = getPixelRatio(ctx);

var click = true;

window.onload = function () {
    //获得屏宽高
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.body.clientHeight;
    //设置全屏显示
    cvs.width=WINDOW_WIDTH*ratio;
    cvs.height=WINDOW_HEIGHT*ratio;
    cvs.style.width=WINDOW_WIDTH+"px";
    cvs.style.height=WINDOW_HEIGHT+"px";

    WINDOW_WIDTH=WINDOW_WIDTH*ratio;
    WINDOW_HEIGHT=WINDOW_HEIGHT*ratio;

    // 一些数据初始化
    var skyX = 0;
    var skyY = 0;
    var landY = 0;
    var drawHeight = 0;
    var landNum = 0;
    var pipelNum = 0;
    var birdY = 0;

    // 游戏状态
    var firstLoad=true;
    var gameOver = true;
    var clickOver = false;

    //时间初始化
    var preTime = Date.now();

    //屏幕长宽对比判断
    if (WINDOW_WIDTH > WINDOW_HEIGHT) {
        PROPORTION = WINDOW_WIDTH / 800;
        skyY = (PROPORTION * 600 - WINDOW_HEIGHT) * 2 / 3;
        if (WINDOW_HEIGHT * 1 / 5 < 112 * PROPORTION) {
            landY = WINDOW_HEIGHT * 4 / 5;
        } else {
            landY = WINDOW_HEIGHT - 112 * PROPORTION;
        }
        birdY = landY / 2;
    } else {
        PROPORTION = WINDOW_HEIGHT / 600;
        landY = WINDOW_HEIGHT - 112 * PROPORTION;
        birdY = WINDOW_HEIGHT / 2;
    }

    landNum = Math.ceil(WINDOW_WIDTH / (336 * PROPORTION) + 2);//地面块数
    pipelNum = Math.ceil(WINDOW_WIDTH / (200 * PROPORTION) + 2);//管道数量
    drawHeight = landY;// 小鸟飞行高度

    //加载图片
    load(imglist, function (imgEls) {
        start(imgEls);
    });


    //游戏开始函数
    function start(imgEls){
        if(!firstLoad){
            birdSpeed=-0.3;
        }

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


        //动画循环循环
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
            if(!firstLoad){
                bird.update(dt);
            }
            bird.draw();

            var birdX = bird.x;
            var birdY = bird.y;

            if (!gameOver) {
                // 分数显示
                ctx.fillText(pipes[0].getScore(), WINDOW_WIDTH / 2, WINDOW_HEIGHT / 6);
                // 碰到天和地
                if (bird.y <= 20) {
                    click = false;
                }
                else if (click) {
                    for (var m = 0; m < pipes.length; m++) {
                        if (pipes[m].hitTest(birdX, birdY, 28)) {
                            clickOver = true;
                            click = false;
                            break;
                        }
                    }
                }
                else if (!click && !clickOver) {
                    click = true;
                }
                if (bird.y >= landY - 35 * PROPORTION / 2) {
                    bird.y = landY - 35 * PROPORTION / 2;
                    requestAnimationFrame(run);
                    gameOver = true;
                }
                requestAnimationFrame(run);
            }
            else if(!firstLoad){
                end(ctx,pipes);
            }else {
                firstStart(ctx);
            }
        }

        requestAnimationFrame(run);

        //设置点击事件。给小鸟一个瞬时的向上速度
        cvs.addEventListener("click", function (event) {
            if (click) {
                bird.speed = -0.3 * PROPORTION;
            }
            if(firstLoad){
                preTime = Date.now();
                bird.speed = -0.3 * PROPORTION;
                gameOver=false;
                firstLoad=false;
                requestAnimationFrame(run);
            }
            if(gameOver){
                click=true;
                clickOver=false;
                gameOver=!gameOver;
                preTime = Date.now();
                start(imgEls);
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

    //第一次开始游戏
    function firstStart(ctx){
        //设置字体填充颜色
        ctx.fontWeight = "bold";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = 40*ratio+"px microsoft yahei";
        ctx.fillText("点击开始游戏", WINDOW_WIDTH / 2, WINDOW_HEIGHT /3);
    }

    //游戏结束函数
    function end(ctx,pipes){
        //设置字体填充颜色
        ctx.fontWeight = "bold";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = 40*ratio+"px microsoft yahei";
        ctx.fillText("游戏结束", WINDOW_WIDTH / 2, WINDOW_HEIGHT /3);
        ctx.font = 30*ratio+"px microsoft yahei";
        ctx.fillText("得分: "+pipes[0].getScore(), WINDOW_WIDTH / 2, WINDOW_HEIGHT *3/7);
        ctx.fillText("点击重新开始", WINDOW_WIDTH / 2, WINDOW_HEIGHT *4/7);
    }
};

