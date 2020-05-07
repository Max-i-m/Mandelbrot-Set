"use strict";
var Fractal = /** @class */ (function () {
    function Fractal() {
        var _this = this;
        this.cr = 0.5;
        this.ci = 0.5;
        this.visibleCenterR = 0;
        this.visibleCenterI = 0;
        this.visibleSideLength = 2;
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.setCanvas = document.getElementById("setCanvas");
        this.setCtx = this.setCanvas.getContext("2d");
        this.canvas.addEventListener("mousemove", function (ev) {
            _this.cr = (ev.clientX - _this.canvas.width / 2) / _this.canvas.width * 2;
            _this.ci = -(ev.clientY - _this.canvas.height / 2) / _this.canvas.height * 2;
            //this.draw();
        });
        this.canvas.addEventListener("mousedown", function (ev) {
            _this.visibleCenterR = (ev.clientX - _this.canvas.width / 2) * _this.visibleSideLength / _this.canvas.width + _this.visibleCenterR;
            _this.visibleCenterI = -(ev.clientY - _this.canvas.height / 2) * _this.visibleSideLength / _this.canvas.height + _this.visibleCenterI;
            _this.drawSet();
        });
        window.addEventListener("keydown", function (ev) {
            if (ev.key === "+") {
                _this.visibleSideLength /= 2;
                _this.drawSet();
            }
            if (ev.key === "-") {
                _this.visibleSideLength *= 2;
                _this.drawSet();
            }
        });
    }
    Fractal.prototype.draw = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(1, -1);
        var zr = 0;
        var zi = 0;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(zr, zi);
        for (var i = 0; i < 200; i++) {
            var zrOld = zr;
            zr = zr * zr - zi * zi + this.cr;
            zi = 2 * zrOld * zi + this.ci;
            this.ctx.lineTo(zr * this.canvas.width / 2, zi * this.canvas.height / 2);
        }
        this.ctx.stroke();
        this.ctx.restore();
    };
    Fractal.prototype.drawSet = function () {
        this.setCtx.save();
        this.setCtx.translate(this.setCanvas.width / 2, this.setCanvas.height / 2);
        this.setCtx.scale(1, -1);
        for (var x = -this.setCanvas.width / 2; x < this.setCanvas.width / 2; x++) {
            for (var y = -this.setCanvas.height / 2; y < this.setCanvas.height / 2; y++) {
                var zr = 0;
                var zi = 0;
                //let cr = x / this.setCanvas.width * 2;
                //let ci = y / this.setCanvas.height * 2;
                var cr = this.visibleCenterR + this.visibleSideLength * x / this.canvas.width;
                var ci = this.visibleCenterI + this.visibleSideLength * y / this.canvas.height;
                var color = "black";
                for (var i = 0; i < 100; i++) {
                    var zrOld = zr;
                    zr = zr * zr - zi * zi + cr;
                    zi = 2 * zrOld * zi - ci;
                    if (zr > 2 || zi > 2 || zr < -2 || zi < -2) {
                        color = "hsl(" + i * 255 / 100 + ", 75%, 50%)";
                        break;
                    }
                }
                this.setCtx.fillStyle = color;
                this.setCtx.fillRect(x, y, 1, 1);
            }
        }
        this.setCtx.restore();
    };
    return Fractal;
}());
document.addEventListener("DOMContentLoaded", function () {
    var fractal = new Fractal();
    fractal.drawSet();
});
