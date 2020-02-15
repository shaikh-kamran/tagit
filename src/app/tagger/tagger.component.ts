import {
    Component,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    ElementRef
} from '@angular/core';

@Component({
    selector: "app-tagger",
    templateUrl: "./tagger.component.html",
    styleUrls: ["./tagger.component.scss"]
})
export class TaggerComponent {

    name = "Angular";
    constructor() { }
    drawItems = []
    @Input('ImageHeight') ImageHeight = 300
    @Input('ImageWidth') ImageWidth = 300
    @Output() selected = new EventEmitter();
    taggedItem = ""
    showInput: boolean = false;
    isMoving: boolean;
    public imgWidth: number;
    public uniX: number;
    public uniY: number;
    public uniX2: number;
    public uniY2: number;
    public initX: number;
    public initY: number;
    public imgHeight: number;
    public url: string;
    public image;

    @ViewChild("layer1", { static: false }) layer1Canvas: ElementRef;
    private context: CanvasRenderingContext2D;
    private layer1CanvasElement: any;

    onSelectBox() {

    }

    delete(i) {
        console.log(i)
        this.drawItems.splice(i, 1);
        this.drawRect("red", 0, 0, 1);
    }

    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = event => {
                this.image = new Image();
                this.image.src = reader.result;
                this.image.onload = () => {
                    this.image.width = this.ImageWidth;
                    this.image.height = this.ImageHeight;
                    this.showImage();
                };
            };
        }
    }

    showImage() {
        this.layer1CanvasElement = this.layer1Canvas.nativeElement;
        this.context = this.layer1CanvasElement.getContext("2d");
        this.layer1CanvasElement.width = this.ImageWidth;
        this.layer1CanvasElement.height = this.ImageHeight;
        this.context.drawImage(this.image, 0, 0, this.ImageWidth, this.ImageHeight);
        let parent = this;
        this.layer1CanvasElement.addEventListener("mousedown", (e) => {
            this.isMoving = true
            this.initX = e.offsetX;
            this.initY = e.offsetY;
        });

        this.layer1CanvasElement.addEventListener("mouseup", (e) => {
            this.isMoving = false
            this.showInput = true
            this.drawItems.push({
                name: "",
                x0: this.initX,
                y0: this.initY,
                x1: this.uniX,
                y1: this.uniY
            });
            parent.drawRect("red", e.offsetX - this.initX, e.offsetY - this.initY, 0);
            this.uniX = undefined
            this.uniY = undefined
        });

        this.layer1CanvasElement.addEventListener("mousemove", (e) => {
            if (this.isMoving) {
                parent.drawRect("red", e.offsetX - this.initX, e.offsetY - this.initY, 0);
            }
        });

    }

    drawRect(color = "black", height, width, flag) {
        if (this.uniX | flag) {
            this.context.drawImage(this.image, 0, 0, this.ImageWidth, this.ImageHeight);
        }
        this.uniX = height
        this.uniY = width
        this.uniX2 = height
        this.uniY2 = width
        for (var i = 0; i < this.drawItems.length; i++) {
            this.context.beginPath();
            this.context.rect(
                this.drawItems[i].x0,
                this.drawItems[i].y0,
                this.drawItems[i].x1,
                this.drawItems[i].y1
            );
            this.context.lineWidth = 3;
            this.context.strokeStyle = color;
            this.context.stroke();
        }
    }

}
