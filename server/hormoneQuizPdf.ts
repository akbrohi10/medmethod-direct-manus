import PDFDocument from "pdfkit";
import type { QuizAnswerText } from "./hormoneQuizModel";

export type QuizPdfData={ name:string;submitted_at:string;balance_index:number|null;score_band:string;answers:QuizAnswerText[] };
export function quizDocumentName(submittedAt:string){return `Hormone Symptom Quiz Report - ${submittedAt.slice(0,10)}`;}
export async function generateQuizReportPdf(data:QuizPdfData):Promise<Buffer>{
  return new Promise((resolve,reject)=>{
    const doc=new PDFDocument({size:"LETTER",margins:{top:48,bottom:48,left:48,right:48},bufferPages:true,info:{Title:quizDocumentName(data.submitted_at),Author:"MedMethod Direct"}});
    const chunks:Buffer[]=[];let total=0;
    doc.on("data",(chunk:Buffer)=>{total+=chunk.length;if(total>2*1024*1024){doc.destroy();reject(new Error("Quiz PDF unavailable."));return}chunks.push(chunk)});
    doc.on("error",()=>reject(new Error("Quiz PDF unavailable.")));doc.on("end",()=>resolve(Buffer.concat(chunks)));
    try{
      const width=doc.page.width-96;
      const paragraph=(text:string,bold=false,size=11)=>{doc.font(bold?"Helvetica-Bold":"Helvetica").fontSize(size).fillColor("#222222").text(text,{width,lineGap:3});};
      paragraph("MedMethod Direct",true,15);doc.moveDown(0.7);paragraph("Hormone Symptom Quiz Report",true,20);doc.moveDown(0.7);
      paragraph(`Name: ${data.name}`,true);paragraph(`Date: ${data.submitted_at.slice(0,10)}`);doc.moveDown(0.6);
      paragraph(`Balance Index: ${data.balance_index===null?"Not enough answers to calculate":`${data.balance_index} / 100`}`,true,14);
      paragraph(`Band: ${data.score_band}`,true,13);doc.moveDown(0.7);
      paragraph("Questions and answers",true,15);doc.moveDown(0.5);
      let section="",number=0;
      for(const answer of data.answers){
        doc.font("Helvetica-Bold").fontSize(11);const questionHeight=doc.heightOfString(answer.question,{width,lineGap:3});
        doc.font("Helvetica").fontSize(11);const answerHeight=doc.heightOfString(answer.answer,{width,lineGap:3});
        const header=answer.section!==section?32:0;
        if(doc.y+questionHeight+Math.min(answerHeight,120)+header+30>doc.page.height-64)doc.addPage();
        if(answer.section!==section){section=answer.section;doc.moveDown(0.3);paragraph(section,true,13);doc.moveDown(0.4)}
        const prefix=answer.id==="recognize"?"Quick check":answer.id==="weirdWorst"?"Follow-up":String(++number);
        paragraph(`${prefix}. ${answer.question}`,true);paragraph(answer.answer);doc.moveDown(0.65);
      }
      const pages=doc.bufferedPageRange();
      for(let page=pages.start;page<pages.start+pages.count;page++){
        doc.switchToPage(page);const bottom=doc.page.margins.bottom;doc.page.margins.bottom=0;
        doc.font("Helvetica").fontSize(9).fillColor("#666666").text(`MedMethod Direct · ${page+1} / ${pages.count}`,48,doc.page.height-34,{width,align:"center",lineBreak:false});
        doc.page.margins.bottom=bottom;
      }
      doc.end();
    }catch{doc.destroy();reject(new Error("Quiz PDF unavailable."));}
  });
}
