"use strict";
class Square {
    constructor() {
        this.mouseX = 0;
        this.ctx = document.getElementById("canvas").getContext("2d");
        window.addEventListener("mousemove", (ev) => {
            this.mouseX = ev.clientX;
        });
        let resize = () => {
            this.ctx.canvas.width = window.innerWidth;
            this.ctx.canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();
    }
    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        {
            let distance = this.ctx.canvas.width / 12;
            let halfWidth = this.ctx.canvas.width / 2;
            this.ctx.translate(halfWidth, this.ctx.canvas.height / 2);
            this.ctx.beginPath();
            {
                this.ctx.strokeStyle = "5px darkgray";
                this.ctx.moveTo(-halfWidth, 0);
                this.ctx.lineTo(halfWidth, 0);
                for (let i = -6; i < 6; i++) {
                    this.ctx.moveTo(distance * i, 10);
                    this.ctx.lineTo(distance * i, -10);
                    this.ctx.font = "24px arial";
                    this.ctx.fillText(i.toString(), distance * i - this.ctx.measureText(i.toString()).width / 2, 35);
                }
            }
            this.ctx.stroke();
            this.ctx.beginPath();
            {
                let num = (this.mouseX - halfWidth) / distance;
                if (num >= -1 && num <= 1) {
                    this.ctx.fillStyle = "blue";
                }
                else {
                    this.ctx.fillStyle = "red";
                }
                for (let i = 0; i < 50; i++) {
                    this.ctx.arc(num * distance, 0, 10, 0, 2 * Math.PI);
                    num *= num;
                }
            }
            this.ctx.fill();
        }
        this.ctx.restore();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let square = new Square();
    function mainDraw() {
        square.draw();
        window.requestAnimationFrame(mainDraw);
    }
    mainDraw();
});
