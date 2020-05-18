// Represents a complex number
class Complex{
    public real: number;
    public imagenary: number;

    constructor(real: number, imagenary: number){
        this.real = real;
        this.imagenary = imagenary;
    }

    public add(real: number, imagenary: number): void{
        this.real += real;
        this.imagenary += imagenary;
    }

    public power(exponent: number): void{
        let outReal = this.real;
        let outImagenary = this.imagenary;

        for(let i = 1; i < exponent; i++){
            let oldReal = outReal;
            outReal = this.real * outReal - this.imagenary * outImagenary;
            outImagenary = this.real * outImagenary + this.imagenary * oldReal;
        }

        this.real = outReal;
        this.imagenary = outImagenary;
    }
}

// The base class for the mandelbrot set and line
abstract class MandelbrotBase{
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected center: Complex = new Complex(0, 0);
    protected visibleSize: number = 2;

    constructor(canvasId: string){
        this.canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d")!;
    }
}

// Draws the set
class MandelbrotSet extends MandelbrotBase{
    private power: number = 2;
    private iterations: number = 200;
    private smooth: boolean = false;

    constructor(){
        super("setCanvas");

        document.getElementById("zoomIn")!.addEventListener("click", () => {
            this.visibleSize /= 3;
            this.draw();
        });

        document.getElementById("zoomOut")!.addEventListener("click", () => {
            this.visibleSize *= 3;
            this.draw();
        });

        document.getElementById("reset")!.addEventListener("click", () => {
            this.visibleSize = 2;
            updateCenter(0, 0);
        });

        window.addEventListener("keydown", (ev) => {
            if(ev.key === "ArrowUp"){
                updateCenter(this.center.real, this.center.imagenary - this.visibleSize / 10);
            }
            else if(ev.key === "ArrowRight"){
                updateCenter(this.center.real - this.visibleSize / 10, this.center.imagenary);
            }
            else if(ev.key === "ArrowDown"){
                updateCenter(this.center.real, this.center.imagenary + this.visibleSize / 10);
            }
            else if(ev.key === "ArrowLeft"){
                updateCenter(this.center.real + this.visibleSize / 10, this.center.imagenary);
            }
        });

        window.addEventListener("wheel", (ev) => {
            if(ev.deltaY < 0){
                this.visibleSize /= -ev.deltaY / 100;
            }
            else{
                this.visibleSize *= ev.deltaY / 100;
            }
            
            this.draw();
        });

        let iterations = <HTMLInputElement>document.getElementById("iterations");
        iterations.addEventListener("change", () => {
            this.iterations = parseInt(iterations.value);
            this.draw();
        });

        document.getElementById("canvases")!.addEventListener("mousedown", (ev) => {
            updateCenter(this.visibleSize * (ev.offsetX - this.canvas.width / 2)
            / this.canvas.width + this.center.real, -this.visibleSize * (ev.offsetY - this.canvas.height / 2)
            / this.canvas.height + this.center.imagenary);
        });

        let exponent = <HTMLSelectElement>document.getElementById("exponent");
        exponent.addEventListener("change", (ev) => {
            this.power = parseInt(exponent.value);
            this.draw();
        });

        let centerReal = <HTMLInputElement>document.getElementById("centerReal");
        centerReal.addEventListener("change", (ev) => {
            let centerRealNumber = parseFloat(centerReal.value);
            if(!isNaN(centerRealNumber)){
                this.center.real = centerRealNumber;
                this.draw();
            }
        });

        let centerImagenary = <HTMLInputElement>document.getElementById("centerImagenary");
        centerImagenary.addEventListener("change", (ev) => {
            let centerImagenaryNumber = parseFloat(centerImagenary.value);
            if(!isNaN(centerImagenaryNumber)){
                this.center.imagenary = centerImagenaryNumber;
                this.draw();
            }
        });

        let colorType = <HTMLSelectElement>document.getElementById("color");
        colorType.addEventListener("change", () => {
            this.draw();
        });

        let smooth = <HTMLInputElement>document.getElementById("smooth");
        smooth.addEventListener("change", () => {
            this.smooth = !this.smooth;
            this.draw();
        });

        let _this = this;
        function updateCenter(real: number, imagenary: number): void{
            _this.center.real = real;
            _this.center.imagenary = imagenary;
            
            centerReal.value = real.toLocaleString();
            centerImagenary.value = imagenary.toLocaleString();

            _this.draw()
        }
    }

    // S and L are percentages
    // Converts an HSL color to RGB
    private HSLtoRGB(rgb: number[], h: number, s: number, l: number): number[]{
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        }
        else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        }
        else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        }
        else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        }
        else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        }
        else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }

        rgb[0] = Math.round((r + m) * 255);
        rgb[1] = Math.round((g + m) * 255);
        rgb[2] = Math.round((b + m) * 255);
        
        return rgb;
    }

    // Draws the set
    public draw(): void{
        //let start = performance.now();
        this.ctx.save();
        {
            let halfWidth = this.canvas.width / 2;
            let halfHeight = this.canvas.height / 2;

            this.ctx.translate(halfWidth, halfHeight);
            this.ctx.scale(1, -1);

            let colorType = (<HTMLSelectElement>document.getElementById("color")).value;
            let z = new Complex(0, 0);

            let maxCheck = this.iterations;
            let buffer = this.ctx.createImageData(this.canvas.width, 1);

            let xScale = this.visibleSize / this.canvas.width;
            let yScale = this.visibleSize / this.canvas.height;

            let rgb = [0, 0, 0];

            for(let y = -halfHeight; y < halfHeight; y++){
                let offset = 0;
                for(let x = -halfWidth; x < halfWidth; x++){
                    //let color = "black";

                    let r = 0, g = 0, b = 0;                
                    
                    if(colorType === "ice"){
                        r = g = b = 255;
                    }

                    z.real = 0;
                    z.imagenary = 0;

                    let cReal = x * xScale + this.center.real;
                    let cImagenary = y * yScale + this.center.imagenary;

                    for(let i = 0; i < maxCheck; i++){
                        // Z = Z^exp + C
                        z.power(this.power);
                        z.add(cReal, cImagenary);
                        
                        // Squared length
                        let sqLength = z.real**2 + z.imagenary**2;

                        // If radius is more than two (squared radius > 4) its non-stable
                        if(sqLength > 4){
                            let si = i;                            
                            if(this.smooth){
                                // Smoothness formula taken from: https://iquilezles.org/www/articles/mset_smooth/mset_smooth.htm
                                si = i - Math.log2(Math.log2(sqLength)) + 4;
                            }
                        
                            if(colorType === "rainbow"){                           
                                rgb = this.HSLtoRGB(rgb, si * 256 / 100, 0.5, 0.5);
                                r = rgb[0];
                                g = rgb[1];
                                b = rgb[2];
                            }
                            else if(colorType === "water"){
                                r = Math.sqrt(si / maxCheck * 60000);
                                g = (Math.sin(si / maxCheck * Math.PI * 2) + 1) * 50;
                                b = (Math.cos(si / maxCheck * Math.PI * 2) + 1) * 50;
                            }
                            else if(colorType === "coffee"){
                                r = 125 + 125 * Math.cos(si * 0.15);
                                g = 125 + 125 * Math.cos(0.5 + si * 0.15);
                                b = 125 + 125 * Math.cos(1 + si * 0.15);
                            }
                            else if(colorType === "magma"){
                                r = si / maxCheck * 200 + 55;
                                g = 10;
                                b = 10;
                            }
                            else if(colorType === "forest"){
                                r = 10;
                                g = si / maxCheck * 200 + 55;
                                b = 10;
                            }
                            else if(colorType === "ice"){
                                r = si / maxCheck * 50 + 20;
                                g = si / maxCheck * 100 + 40;
                                b = si / maxCheck * 155 + 80;
                            }

                            break;
                        }
                    }

                    buffer.data[offset] = r;
                    buffer.data[++offset] = g;
                    buffer.data[++offset] = b;
                    buffer.data[++offset] = 255;
                    offset++; 
                }
                
                this.ctx.putImageData(buffer, 0, this.canvas.height - (y + halfHeight) - 1);
            }
        }
        this.ctx.restore();

        //console.log(performance.now() - start);
    }
}

// Draws the line for the default zoom and center
class MandelbrotLine extends MandelbrotBase{
    private cr: number = 0;
    private ci: number = 0;
    private line: boolean = false;

    constructor(){
        super("lineCanvas");

        document.getElementById("line")!.addEventListener("change", () => {
            this.line = !this.line;
        });

        this.canvas.addEventListener("mousemove", (ev) => {
            this.cr = (ev.offsetX / this.canvas.width * 2 - 1);
            this.ci = -(ev.offsetY / this.canvas.height * 2 - 1);

            this.draw();
        });
    }

    private draw(): void{
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        if(this.line){
            let exponent = parseInt((<HTMLSelectElement>document.getElementById("exponent")).value);

            this.ctx.save();
                this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.scale(1, -1);

                let z = new Complex(0, 0);
                
                this.ctx.beginPath();

                this.ctx.strokeStyle = "white";
                this.ctx.moveTo(z.real, z.imagenary);

                for(let i = 0; i < 200; i++){
                    z.power(exponent);
                    z.add(this.cr, this.ci);

                    this.ctx.lineTo(z.real * this.canvas.width / 2, z.imagenary * this.canvas.height / 2);
                }
                this.ctx.stroke();            

            this.ctx.restore();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MandelbrotLine();
    new MandelbrotSet().draw();
});