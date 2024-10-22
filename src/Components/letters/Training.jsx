import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import DashboardPdf from "../DashboardPdf";
import NavBarLetters from "./NavBarLetters";
import TrainingForm from "./TrainingForm";

const Training = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);

  const generatePDF = (data) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // function to add justified text---------------------kkk
   /*  const addJustifiedText = (text, startY, fontSize = 10, lineHeight = 5) => {
      doc.setFontSize(fontSize);
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      const words = text.split(' ');
      let line = '';
      let y = startY;

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const testWidth = doc.getStringUnitWidth(testLine) * fontSize / doc.internal.scaleFactor;

        if (testWidth > maxWidth) {
          // Justify the line
          if (line.trim() !== '') {
            const spaces = line.split(' ').length - 1;
            const spaceWidth = (maxWidth - doc.getStringUnitWidth(line.trim()) * fontSize / doc.internal.scaleFactor) / spaces;
            let xOffset = margin;
            line.trim().split(' ').forEach((word, index) => {
              doc.text(word, xOffset, y);
              xOffset += doc.getStringUnitWidth(word + ' ') * fontSize / doc.internal.scaleFactor;
              if (index < spaces) xOffset += spaceWidth;
            });
          }
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      // Add any remaining text
      doc.text(line.trim(), margin, y);

      return y + lineHeight; // Return the new Y position
    }; */

     // function to add justified text---------------------kkk
   const addJustifiedText = (text, startY, fontSize = 10, lineHeight = 5) => {
    doc.setFontSize(fontSize);
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20; // Default margin
    const maxWidth = pageWidth - 2 * margin;
  
    const lines = text.split("\n");
    let y = startY;
  
    lines.forEach((line, lineIndex) => {
      const segments = line.split(/(\*\*.*?\*\*)/);
      let lineContent = [];
      let currentLineWidth = 0;
  
      segments.forEach((segment) => {
        const isBold = segment.startsWith("**") && segment.endsWith("**");
        const text = isBold ? segment.slice(2, -2) : segment;
        const words = text.split(" ");
  
        words.forEach((word) => {
          const wordWidth =
            (doc.getStringUnitWidth(word) * fontSize) /
            doc.internal.scaleFactor;
          const spaceWidth =
            (doc.getStringUnitWidth("  ") * fontSize) /
            doc.internal.scaleFactor;
  
          if (
            currentLineWidth + wordWidth + spaceWidth > maxWidth &&
            lineContent.length > 0
          ) {
            // Print the current line
            printJustifiedLine(
              doc,
              lineContent,
              margin, // Use default margin
              y,
              maxWidth,
              fontSize,
              false
            );
            y += lineHeight;
            lineContent = [];
            currentLineWidth = 0;
          }
  
          lineContent.push({ text: word, isBold, width: wordWidth });
          currentLineWidth += wordWidth + spaceWidth;
        });
      });
  
      // Print the last line of the paragraph
      if (lineContent.length > 0) {
        printJustifiedLine(
          doc,
          lineContent,
          margin, // Use default margin
          y,
          maxWidth,
          fontSize,
          true
        );
        y += lineHeight;
      }
  
      // Add extra space between paragraphs
      if (lineIndex < lines.length - 1) {
        y += lineHeight / 2;
      }
    });
  
    return y;
  };
  
  const printJustifiedLine = (
    doc,
    lineContent,
    margin,
    y,
    maxWidth,
    fontSize,
    isLastLine
  ) => {
    const lineWidth = lineContent.reduce((sum, item) => sum + item.width, 0);
    const spaces = lineContent.length - 1;
  
    let spaceWidth;
    if (isLastLine || spaces === 0) {
      spaceWidth = (doc.getStringUnitWidth(" ") * fontSize) / doc.internal.scaleFactor;
    } else {
      spaceWidth = (maxWidth - lineWidth) / spaces;
    }
  
    let xOffset = margin;
    lineContent.forEach((item, index) => {
      // Set bold or normal font based on `isBold`
      doc.setFont("times", item.isBold ? "bold" : "normal");
      doc.text(item.text, xOffset, y);
      xOffset += item.width + (index < spaces ? spaceWidth : 0);
    });
  };

    // Company logo
    const logoPath = "../images/panorama.png";
    doc.addImage(logoPath, "PNG", 10, 12, 69, 14, { align: "left" });
  
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    const companyName = formData.addPvtLtd ? "PANORAMA SOFTWARE SOLUTIONS PVT LTD" : "PANORAMA SOFTWARE SOLUTIONS";
    doc.text(companyName, 200, 15, { align: "right" });
    // doc.text("PANORAMA SOFTWARE SOLUTIONS PVT LTD", 200, 15, { align: "right" });
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Unit no - 621-622, 6th Floor, Tower 1, Assotech Business Cresterra,", 200, 20, { align: "right" });
    doc.text("Sector 135, Noida - 201304, Uttar Pradesh", 200, 24, { align: "right" });
    doc.text("Mobile: +919888887651", 200, 28, { align: "right" });
    doc.text("Email: Hr@panoramasoftware.in", 200, 32, { align: "right" });
    doc.text("Website: www.panoramasoftwares.com", 200, 36, { align: "right" });

    doc.setTextColor(12, 112, 137);
    doc.setFont("helvetica", "bold");

    // divider top
    doc.line(9, 40, 201, 40);
    doc.setTextColor(12, 112, 137);
    doc.setFont("helvetica", "bold");
    // Add subject line
    doc.setFontSize(11);
    const text = "To Whomever It May Concern";
    doc.text(text, 105, 75, { align: "center" });

    const textWidth = doc.getTextWidth(text);
    doc.setTextColor(12, 112, 137);
    doc.line(78, 76, 78.5 + textWidth, 76); //Horizental Line
    doc.setFontSize(10);
     doc.setFont("helvetica", "normal");

    // Initialize pronouns based on gender before using them
    const pronoun = data.gender === "female" ? "her" : "his";
    const pronounSubject = data.gender === "female" ? "She" : "He";
  // const name = data.name.setFont("helvetica", "bold")
    const paragraphs = [
        `This letter certifies that**${data.name}**has been working with  Panorama Software Solutions Pvt Ltd in the capacity of**${data.designation}**from**${data.date}**to**${data.enddate}**. ${pronounSubject} has done an excellent job during his to engagement with the IT department of the company.`,
        `During ${pronoun} tenure,**${data.name}**consistently delivered a high level of performance, exceeding expectations. ${pronounSubject} exhibited a proactive and accountable approach to his tasks, demonstrating a keen attention to detail and a strong commitment to excellence. His work ethic, reliability, and integrity were exemplary, earning him the confidence and respect of the management.`,
        `I would like to take this opportunity to express my appreciation to**${data.name}**for his services and wish him all the very best for his future endeavors`
      ];
  
    // Adding the paragraphs to the PDF
    let yPos = 100;
    paragraphs.forEach((para) => {
      yPos = addJustifiedText(para, yPos, 10, 5) + 3; // Adjust line height and gap between paragraphs
    });

    
        doc.text("Sincerely,", 20, 170);
 
    //Signature-------code-------------
 // Signature
doc.setFont("helvetica", "bold");
doc.text("HR Executive", 20, 225);
// Check if Pvt Ltd should be added
const companySignature = formData.addPvtLtd ? "Panorama Software Solutions Pvt Ltd"  : "Panorama Software Solutions";
doc.text(companySignature, 20, 231);
doc.text("Noida, UP, India", 20, 237);



    // divider bottom
    doc.line(9, 279, 201, 279);

    // Add footer
    doc.setFontSize(9.5);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "normal");
    doc.text("Unit no - 621-622, 6th Floor, Tower 1, Assotech Business Cresterra, Sector 135, Noida - 201304, Uttar Pradesh", 105, 285, { align: "center" });
    doc.text("Classification: Confidential", 105, 290, { align: "center" });

    // Generate PDF preview
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
  };

  useEffect(() => {
    if (formData) {
      generatePDF(formData);
    }
    return () => URL.revokeObjectURL(pdfUrl);
  }, [formData]);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowForm(false);
  };

  return (
    <div className="mx-auto bg-gray-50">
      <NavBarLetters />
      <div className="max-w-7xl mx-auto">
        <div className="mt-5">
          <button
            onClick={() => setShowForm(true)}
            className="py-1 px-4 mx-24 rounded-md bg-pano-blue text-white shadow-lg font-sans hover:bg-blue-600 transition-colors"
          >
            Generate Training Letter
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <TrainingForm
                onSubmit={handleFormSubmit}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {formData && (
          <div className="bg-gray-50 shadow-lg flex md:px-7 lg:px-20 flex-col mt-3 rounded-2xl w-full h-screen sm:px-5">
            <iframe
              src={pdfUrl}
              style={{ width: "100%", height: "800px" }}
              frameBorder="0"
              title="Experience Letter Preview"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default Training;
