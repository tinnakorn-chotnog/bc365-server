import { Injectable } from '@nestjs/common';
import path from 'path';
import PdfPrinter, { PDFKit } from 'pdfmake';
@Injectable()
export class AppService {

  getData() {
    return new Promise<PDFKit.PDFDocument>( (resolve, reject) => {
      try {

        var fontDescriptors = {
          Roboto: {
            normal: path.join(__dirname, './assets/ttf/THSarabun.ttf'),
            bold: path.join(__dirname, '../assets/ttf/THSarabun Bold.ttf'),
            italics: path.join(__dirname, './assets/ttf/THSarabun Italic.ttf'),
            bolditalics: path.join(__dirname, './assets/ttf/THSarabun BoldItalic.ttf')
          }
        };

        const printer = new PdfPrinter(fontDescriptors);

        const docDef = {
          content: [
            'First paragraph นายทินกร โชตินอก',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
          ]
        }

        const doc = printer.createPdfKitDocument(docDef);

        resolve(doc)

      } catch(e) {
        console.log(e)
        reject(e)
      }
    })
  }
}