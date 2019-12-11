import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';
import { async } from 'q';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
    @ViewChild('imageCanvas', { static: false }) canvas: any;
    canvasElement: any;
    saveX: number;
    saveY: number;

    selectedColor = '#9e2956';
    colors = [ '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];

    drawing = false;
    lineWidth = 5;

    constructor(
        private plt: Platform,
        private base64ToGallery: Base64ToGallery,
        private toastCtrl: ToastController
    ) {}

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        this.canvasElement.width = this.plt.width() + '';
        this.canvasElement.height = 200;
    }

    startDrawing(ev) {
        this.drawing = true;
        let canvasPosition = this.canvasElement.getBoundingClientRect();
        this.saveX = ev.pageX - canvasPosition.x;
        this.saveY = ev.pageY - canvasPosition.y;
    }

    endDrawing() {
        this.drawing = false;
    }

    selectColor(color) {
        this.selectedColor = color;
    }

    setBackground() {
        let background = new Image();
        background.src = './assets/code.jpg';
        let ctx = this.canvasElement.getContext('2d');

        background.onload = () => {
            ctx.drawImage(background, 0, 0, this.canvasElement.width, this.canvasElement.height);
        }
    }

    moved(ev) {
        if (!this.drawing) return;

        let canvasPosition = this.canvasElement.getBoundingClientRect();
        let ctx = this.canvasElement.getContext('2d');

        let currentX = ev.pageX - canvasPosition.x;
        let currentY = ev.pageY - canvasPosition.y;

        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.selectedColor;
        ctx.lineWidth = this.lineWidth;

        ctx.beginPath();
        ctx.moveTo(this.saveY, this.saveY);
        ctx.lineTo(currentX, currentY);
        ctx.closePath();

        ctx.stroke();

        this.saveX = currentX;
        this.saveY = currentY;
    }

    exportCanvasImage() {
        let dataUrl = this.canvasElement.toDataURL();

        let ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (this.plt.is('cordova')) {
            const options: Base64ToGalleryOptions = {
                prefix: 'canvas_',
                mediaScanner: true
            };

            this.base64ToGallery.base64ToGallery(dataUrl, options).then(
                async res => {
                    const toast = await this.toastCtrl.create({
                        message: 'Image saved to camera roll',
                        duration: 2000
                    });
                    toast.present();
                },
                err => {
                    console.log('Error when saving image to gallery', err);
                }
            );
        }
        else {
            const data = dataUrl.split(',')[1];
            let blob = this.b64toBlob(data, 'image/png');

            let a = window.document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'canvasimage.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    b64toBlob(b64Data, contentType) {
        contentType = contentType || '';
        const sliceSize = 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, { type: contentType });

        return blob;
    }

}
