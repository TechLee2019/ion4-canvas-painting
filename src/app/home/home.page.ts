import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { Base64ToGallery, Base64ToGalleryOptions } from '@ionic-native/base64-to-gallery/ngx';

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

}
