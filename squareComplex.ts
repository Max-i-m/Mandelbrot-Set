class SquareComplex{
    private ctx: CanvasRenderingContext2D;
    private mouseX: number = 0;
    private mouseY: number = 0;

    constructor(){
        this.ctx = (<HTMLCanvasElement>document.getElementById("canvas")).getContext("2d")!;
    
        window.addEventListener("mousemove", (ev) => {
            this.mouseX = ev.clientX - this.ctx.canvas.width / 2;
            this.mouseY = ev.clientY - this.ctx.canvas.height / 2;
        });

        let resize = (): void => {
            this.ctx.canvas.width = window.innerWidth;
            this.ctx.canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();
    }

    public draw(): void{
        let ctx = this.ctx;
        let halfWidth = ctx.canvas.width / 2;
        let halfHeight = ctx.canvas.height / 2;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.save();
        {
            ctx.translate(halfWidth, ctx.canvas.height / 2);

            let step = ctx.canvas.width / 6;

            ctx.beginPath();
            {
                ctx.strokeStyle = "5px darkgray";
                
                ctx.moveTo(-halfWidth, 0);
                ctx.lineTo(halfWidth, 0);
                
                ctx.moveTo(0, -halfHeight);
                ctx.lineTo(0, halfHeight);

                for(let i = -3; i <= 3; i++){
                    ctx.moveTo(step * i, 10);
                    ctx.lineTo(step * i, -10);

                    ctx.moveTo(10, step * i);
                    ctx.lineTo(-10, step * i);
                }

                ctx.moveTo(step, 0);
                ctx.arc(0, 0, step, 0, 2 * Math.PI);

                ctx.font = "italic 30px 'Times New Roman'";
                ctx.fillText("1", step + 15, 30);
                ctx.fillText("i", 15, step + 30);
                ctx.fillText("-1", -step - 30, 30);
                ctx.fillText("-i", 15, -step - 15);
            }
            ctx.stroke();

            let real = this.mouseX / step;
            let imagenary = this.mouseY / step;
            let real2 = (real**2 - imagenary**2) * step;
            let imagenary2 = (real * imagenary * 2) * step;

            ctx.beginPath();
            {
                ctx.lineWidth = 3;
                ctx.strokeStyle = "crimson";
                ctx.moveTo(0, 0);
                ctx.lineTo(this.mouseX, this.mouseY);
            }
            ctx.stroke();

            ctx.beginPath();
            {
                ctx.fillStyle = "crimson";
                ctx.arc(this.mouseX, this.mouseY, 10, 0, 2 * Math.PI);
            }
            ctx.fill();

            ctx.beginPath();
            {
                ctx.strokeStyle = "navy";
                ctx.moveTo(0, 0);
                ctx.lineTo(real2, imagenary2);   
            }
            ctx.stroke();

            ctx.beginPath();
            {
                ctx.fillStyle = "navy";
                ctx.arc(real2, imagenary2, 10, 0, Math.PI * 2);
            }
            ctx.fill();        
        }
        ctx.restore();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let squareComplex = new SquareComplex();
    function mainDraw(): void{
        squareComplex.draw();
        window.requestAnimationFrame(mainDraw);
    }
    mainDraw();
});