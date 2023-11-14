/**
 * This service provides functionality to export the content of an HTML element
 * as a PDF document using html2canvas and jspdf libraries. It allows hiding
 * specific elements with the class 'hide-in-pdf' before capturing the HTML content.
 *
 * @author I Nyoman Surya Pradipta (E1900344)
 */

import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class GenerateReceiptService {
  constructor() {}

  /**
   * Export the content of an HTML element as a PDF document.
   *
   * @param {string} elementId - The ID of the HTML element to be exported.
   * @param {string} fileName - The desired file name for the exported PDF.
   */
  exportToPdf(elementId: string, fileName: string): void {
    // Get the HTML element by its ID
    const element = document.getElementById(elementId) as HTMLElement;

    // Convert HTMLCollection to an array for elements with class 'hide-in-pdf'
    const elementsToHide = Array.from(
      element.getElementsByClassName('hide-in-pdf')
    );

    // Hide elements with class 'hide-in-pdf' before capturing the HTML content
    elementsToHide.forEach((element) => {
      (element as HTMLElement).style.display = 'none';
    });

    if (element) {
      // Use html2canvas to capture the HTML content and convert it to a canvas
      html2canvas(element).then((canvas) => {
        // Convert the canvas into a base64 string URL
        const imgData = canvas.toDataURL('image/png');

        // Define PDF dimensions and calculate the image height to fit the page width
        const pageWidth = 210;
        const pageHeight = 297;
        // calculate the image actual height to fit width canvas and pdf
        const height = (canvas.height * pageWidth) / canvas.width;

        // Create a new jsPDF instance and add the image to the PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, height);

        // Save the PDF with the specified file name
        pdf.save(fileName + '.pdf');
      });
    } else {
      console.error(`Element with id ${elementId} not found.`);
    }
  }
}
