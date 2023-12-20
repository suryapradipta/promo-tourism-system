/**
 * This service provides functionality to export a specified HTML element to a PDF file.
 * It uses html2canvas for rendering the HTML element as an image and jsPDF for creating the PDF.
 */
import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  /**
   * Export a specified HTML element to a PDF file.
   *
   * @param {string} elementId - The ID of the HTML element to be exported.
   * @param {string} fileName - The desired name of the PDF file (without extension).
   */
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
        useCORS: true,
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
