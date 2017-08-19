/**
 * Created by Administrator on 2016/8/23 0023.
 */
var Pipe = function (upImg, downImg, x, drawHeight, proportion, speed, ctx) {
    this.x = x * proportion;
    this.whight=150;
    this.upImg = upImg;
    this.downImg = downImg;
    this.width = upImg.width * proportion;
    this.height = upImg.height * proportion;
    this.speed = speed * proportion;
    this.drawHeight = drawHeight;
    this.proportion = proportion;
    this.ctx = ctx;
    this.r = (Math.random() * drawHeight * 0.5) + drawHeight * 0.1;
    this.ok=false;
};
Pipe.prototype.draw = function () {
    this.ctx.drawImage(
        this.upImg, this.x, this.r - this.height, this.width, this.height
    );
    this.ctx.drawImage(
        this.downImg, this.x, this.r + this.whight * this.proportion, this.width, this.height
    );
};
Pipe.prototype.setCount = function (count, gap) {
    Pipe.count = count;
    Pipe.gap = gap * this.proportion;
};
Pipe.prototype.update = function (dur) {
    this.x = this.x + this.speed * dur;
    if (this.x <= -this.upImg.width * this.proportion) {
        this.ok=false;
        this.x = this.x + Pipe.count * Pipe.gap;
        this.r = (Math.random() * this.drawHeight * 0.5) + this.drawHeight * 0.1;
    }
};
Pipe.prototype.hitTest = function (x, y, diameter) {
    var radius = diameter / 2;
    var x1 = this.x;
    var x2 = this.x + this.width;
    var y1 = this.r;
    var y2 = this.r + this.whight * this.proportion;
    if ((y < y1 || y > y2) && x + radius > x1 && x - radius < x1 || (y < y1 || y > y2) && x + radius > x1 && x - radius < x2) {
        return true;
    }
    else if (x>x1&&x<x2&&(y+radius>y2||y-radius<y1)) {
        return true;
    }else if( !this.ok&&x>x2 ){
        this.ok=true;
        Pipe.score=Pipe.score+1;
        console.log(Pipe.score)
    }
    return false;
    /*    return ((x-width*this.proportion/2 >= this.x )&& (x-width*this.proportion/2 <= this.x + this.width)||(x+width*this.proportion/2 >= this.x )&& (x+width*this.proportion/2 <= this.x + this.width)) &&(! (y-height*this.proportion/2 >this.r  && y+height*this.proportion/2 < this.r +100*this.proportion));*/
};

Pipe.prototype.distance = function (x1, y1, x2, y2) {
    var d1 = (x1 - x2);
    var d2 = (y1 - y2);
    return Math.sqrt(d1 * d1 + d2 * d2);
};

Pipe.prototype.setScore =function (num) {
    Pipe.score = num;
};
Pipe.prototype.getScore =function () {
    return Pipe.score
};