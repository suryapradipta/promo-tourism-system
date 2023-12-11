import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor() { }

  exportToPdf(elementId: string, fileName: string): void {
    const element = document.getElementById(elementId) as HTMLElement;

    const elementsToHide = Array.from(
      element.getElementsByClassName('hide-in-pdf')
    );

    elementsToHide.forEach((element: Element) => {
      (element as HTMLElement).style.display = 'none';
    });

    if (element) {
      html2canvas(element, {
        useCORS: true
      }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');

        const pageWidth = 210;
        const height = (canvas.height * pageWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, height);

        pdf.save(fileName + '.pdf');
      });
    } else {
      console.error(`Element with id ${elementId} not found.`);
    }
  }
}
