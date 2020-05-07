class Fractal{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private setCanvas: HTMLCanvasElement;
    private setCtx: CanvasRenderingContext2D;
    private cr: number = 0.5;
    private ci: number = 0.5;
    private visibleCenterR: number = 0;
    private visibleCenterI: number = 0;
    private visibleSideLength: number = 2;

    constructor(){
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.setCanvas = <HTMLCanvasElement>document.getElementById("setCanvas");
        this.setCtx = this.setCanvas.getContext("2d")!;

        this.canvas.addEventListener("mousemove", (ev) => {
            this.cr = (ev.clientX - this.canvas.width / 2) / this.canvas.width * 2;
            this.ci = -(ev.clientY - this.canvas.height / 2) / this.canvas.height * 2;
            //this.draw();
        });

        this.canvas.addEventListener("mousedown", (ev) => {
            this.visibleCenterR = (ev.clientX - this.canvas.width / 2) * this.visibleSideLength / this.canvas.width + this.visibleCenterR;
            this.visibleCenterI = -(ev.clientY - this.canvas.height / 2) * this.visibleSideLength / this.canvas.height + this.visibleCenterI;
            this.drawSet();
        });

        window.addEventListener("keydown", (ev) => {
            if(ev.key === "+"){
                this.visibleSideLength /= 2;
            
                this.drawSet();
            }

            if(ev.key === "-"){
                this.visibleSideLength *= 2;
                
                this.drawSet();
            }
        });
    }

    private draw(): void{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.scale(1, -1);

            let zr = 0;
            let zi = 0; 

            this.ctx.beginPath();
                this.ctx.strokeStyle = "white";
                this.ctx.moveTo(zr, zi);
                for(let i = 0; i < 200; i++){
                    let zrOld = zr;
                    zr = zr * zr - zi * zi + this.cr;
                    zi = 2 * zrOld * zi + this.ci;
                    this.ctx.lineTo(zr * this.canvas.width / 2, zi * this.canvas.height / 2);
                }
            this.ctx.stroke();
        this.ctx.restore();
    }

    public drawSet(): void{
        this.setCtx.save();
            this.setCtx.translate(this.setCanvas.width / 2, this.setCanvas.height / 2);
            this.setCtx.scale(1, -1);

            for(let x = -this.setCanvas.width / 2; x < this.setCanvas.width / 2; x++){
                for(let y = -this.setCanvas.height / 2; y < this.setCanvas.height / 2; y++){    
                    let zr = 0;
                    let zi = 0;
                    //let cr = x / this.setCanvas.width * 2;
                    //let ci = y / this.setCanvas.height * 2;
                    let cr = this.visibleCenterR + this.visibleSideLength * x / this.canvas.width;
                    let ci = this.visibleCenterI + this.visibleSideLength * y / this.canvas.height;
                    let color = "black";

                    for(let i = 0; i < 100; i++){
                        let zrOld = zr;
                        zr = zr * zr - zi * zi + cr;
                        zi = 2 * zrOld * zi - ci;

                        if(zr > 2 || zi > 2 || zr < -2 || zi < -2){
                            color = `hsl(${i * 255 / 100}, 75%, 50%)`;
                            break;
                        }
                    }

                    this.setCtx.fillStyle = color;
                    this.setCtx.fillRect(x, y, 1, 1);
                }
            }
        this.setCtx.restore();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let fractal = new Fractal();

    fractal.drawSet();
});