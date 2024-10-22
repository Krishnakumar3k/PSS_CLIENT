import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import DashboardPdf from "../DashboardPdf";
import NavBarLetters from "./NavBarLetters";
import ExperienceForm from "./ExperinenceForm";

const Experience = () => {
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
        spaceWidth = (doc.getStringUnitWidth("  ") * fontSize) / doc.internal.scaleFactor;
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
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Unit no - 621-622, 6th Floor, Tower 1, Assotech Business Cresterra,", 200, 20, { align: "right" });
    doc.text("Sector 135, Noida - 201304, Uttar Pradesh", 200, 24, { align: "right" });
    doc.text("Mobile: +919888887651", 200, 28, { align: "right" });
    doc.text("Email: Hr@panoramasoftware.in", 200, 32, { align: "right" });
    doc.text("Website: www.panoramasoftwares.com", 200, 36, { align: "right" });

    doc.setTextColor(12, 112, 137);
    doc.setFont("helvetica", "bold");
    doc.line(9, 40, 201, 40);
    doc.setTextColor(12, 112, 137);
    // Add subject line
    doc.setFontSize(11);
    const text = "To Whomsoever It May Concern";
    doc.text(text, 105, 75, { align: "center" });

    const textWidth = doc.getTextWidth(text);
    doc.setTextColor(12, 112, 137);
    doc.line(76, 76, 76.5 + textWidth, 76); //Horizental Line
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
  // Initialize pronouns based on gender before using them
    const pronoun = data.gender === "female" ? "her" : "his";
    const pronounSubject = data.gender === "female" ? "She" : "He";
const paragraphs = [
  `This letter certifies that**${data.name}**was an employee in the role of **${data.designation}**with **PANORAMA SOFTWARE SOLUTIONS${formData.addPvtLtd ? ' PVT LTD' : ''}**during the period from **${data.date}** to **${data.enddate}**.`,
  `Throughout ${pronoun} tenure with us,**${data.name}**consistently demonstrated unwavering dedication and loyalty to ${pronoun} work and responsibilities. ${pronoun} commitment to excellence has significantly contributed to the success of our team and the organization as a whole.`,
  `${pronounSubject} has done an exemplary job while serving in this role. ${pronounSubject} has always maintained a professional and courteous attitude while working with our company.`,
  `${pronounSubject} decided to end ${pronoun} employment with our company, and we wish ${pronoun} all the best in future career opportunities.`,
  "Please contact us for any additional information.",
];

  let yPos = 100; 
  paragraphs.forEach((para) => {
   // doc.setFont("helvetica", "bold");
  
    yPos = addJustifiedText(para, yPos, 10, 5) + 3; 
  });

doc.text("Sincerely,", 20, 180);
 
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
            Generate Experience Letter
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <ExperienceForm
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

export default Experience;
