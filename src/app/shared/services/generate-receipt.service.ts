import { Injectable } from '@angular/core';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Injectable({
  providedIn: 'root'
})
export class GenerateReceiptService {

  constructor() { }

  exportToPdf(elementId: string, fileName: string): void {

    const element = document.getElementById(elementId) as HTMLElement;

    // Convert HTMLCollection to an array
    const elementsToHide = Array.from(element.getElementsByClassName('hide-in-pdf'));

    // Hide elements with class 'hide-in-pdf' before capturing the HTML content
    elementsToHide.forEach(element => {
      (element as HTMLElement).style.display = 'none';
    });

    if (element) {
      html2canvas(element).then(canvas => {
        // convert the canvas into base64 string url
        const imgData = canvas.toDataURL('image/png');

        const pageWidth = 210;
        const pageHeight = 297;
        // calculate the image actual height to fit width canvas and pdf
        const height = canvas.height*pageWidth/canvas.width;

        const pdf = new jsPDF("p","mm", "a4");
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, height);
        pdf.save(fileName + '.pdf');
      });
    } else {
      console.error(`Element with id ${elementId} not found.`);
    }
  }
}
