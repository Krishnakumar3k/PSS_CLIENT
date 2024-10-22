import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { ToWords } from "to-words";
import NavBarLetters from "./NavBarLetters";
import AppointmentForm from "./AppointmentForm";

// Initialize ToWords
const toWords = new ToWords({
  localeCode: "en-IN",
  converterOptions: {
    currency: true,
    ignoreDecimal: true,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: "Rupee",
      plural: "Rupees",
      symbol: "₹",
    },
  },
});

export default function Appointment() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);

  const generatePDF = (data) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Helper function to add justified text------------------kkk
    const addJustifiedText = (text, startY, fontSize = 10, lineHeight = 5) => {
      
      doc.setFontSize(fontSize);
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20; // Default margin
      const bulletOffset = 10; // Offset to shift bullet points
      const maxWidth = pageWidth - 2 * margin;

      const lines = text.split("\n");
      let y = startY;

      lines.forEach((line, lineIndex) => {
        const isBullet = line.trim().startsWith("•"); // Check if it's a bullet point
        const currentMargin = isBullet ? margin + bulletOffset : margin; // Adjust margin for bullet points
        const currentMaxWidth = maxWidth - (isBullet ? bulletOffset : 0); // Adjust max width for bullet points

        const segments = line.split(/(\*\*.*?\*\*)/);
        let lineContent = [];
        let currentLineWidth = 0;

        segments.forEach((segment) => {
          const isBold = segment.startsWith("**") && segment.endsWith("**");
          const text = isBold ? segment.slice(2, -2) : segment;
          const words = text.split(" ");

          words.forEach((word, wordIndex) => {
            const wordWidth =
              (doc.getStringUnitWidth(word) * fontSize) /
              doc.internal.scaleFactor;
            const spaceWidth =
              (doc.getStringUnitWidth("  ") * fontSize) /
              doc.internal.scaleFactor;

            if (
              currentLineWidth + wordWidth + spaceWidth > currentMaxWidth &&
              lineContent.length > 0
            ) {
              // Print the current line
              printJustifiedLine(
                doc,
                lineContent,
                currentMargin,
                y,
                currentMaxWidth,
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
            currentMargin,
            y,
            currentMaxWidth,
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
        if (item.text.match(/^\d+\.$/)) {  // Check if the item is a number followed by a period, like "1.", "2."
          doc.setTextColor(0, 0, 0);  // Set the color to black
          doc.setFont("times", "bold");
        } else {
          doc.setTextColor(12, 112, 137); // Set the default color for other text
          doc.setFont("times", item.isBold ? "bold" : "normal");
        }
    
        doc.text(item.text, xOffset, y);
        xOffset += item.width + (index < spaces ? spaceWidth : 0);
      });
    };
    
    // Utility function to format salary---------------------kk
    const formatSalary = (salary) => {
      const numericSalary = Number(salary.replace(/[^\d]/g, '')); // Ensure it's numeric
      return numericSalary.toLocaleString("en-IN"); // Format as Indian style
    };

    // Utility function to convert salary to words---------------------kk
    const convertSalaryToWords = (salary) => {
      return toWords.convert(salary, { currency: true });
    };
    const addHeader = () => {
      // company logo
      const logoPath = "../images/panorama.png";
      doc.addImage(logoPath, "PNG", 10, 10, 69, 14, { align: "left" });

      // company name and address
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("times", "bold");
      doc.text("PANORAMA SOFTWARE SOLUTIONS PVT LTD", 200, 15, {
        align: "right",
      });
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(
        "Unit no - 621-622, 6th Floor, Tower 1, Assotech Business Cresterra,",
        200,
        20,
        { align: "right" }
      );
      doc.text("Sector 135, Noida - 201304, Uttar Pradesh", 200, 24, {
        align: "right",
      });
      doc.text("Mobile: +919888887651", 200, 28, { align: "right" });
      doc.text("Email: Hr@panoramasoftware.in", 200, 32, { align: "right" });
      doc.text("Website: www.panoramasoftwares.com", 200, 36, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");

      // Reset text color
      doc.setTextColor(12, 112, 137);
      // divider
      doc.line(10, 40, 200, 40);
    };

    const addFooter = () => {
      doc.setFontSize(9.5);
      doc.setTextColor(120, 120, 120);
      doc.line(9, 279, 201, 279);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Unit no - 621-622, 6th Floor, Tower 1, Assotech Business Cresterra, Sector 135, Noida - 201304, Uttar Pradesh",
        105,
        285,
        { align: "center" }
      );
      doc.text("Classification: Confidential", 105, 290, { align: "center" });
      doc.setTextColor(12, 112, 137);
    };

    // Header and first part of the letter
    addHeader();

    doc.setFontSize(10);
    doc.setTextColor(12, 112, 137);
    doc.setFont("times  ", "normal");
    doc.text(`Date:`, 162, 53, { align: "right" });
    doc.setFont("times", "bold");
    doc.text(` ${data.issuedate}`, 193, 53, { align: "right" });
    doc.text(`Dear ${data.name},`, 20, 53);
    doc.setFontSize(10);
    doc.text("Letter of Appointment", 85, 70);
    const textWidth = doc.getTextWidth("Letter of Appointment");
    const startX = 85;
    const startY = 71.3;
    doc.setDrawColor(12, 112, 137);
    doc.line(startX, startY, startX + textWidth, startY);
    doc.setDrawColor(0);

    // Content for page one with bold markers
    const contentPageOne = [
      "The management is pleased to engage your services on the following undertaking:",
      `1. Starting from**${data.date}**you will provide your services as**${data.designation}**supporting Panorama's Team in Noida.`,
      "You assure and undertake to be respectful of the following obligations in rendering your services:",
      "• To abide by the company's rules and maintain a behavior that safeguards the Company's image.",
      "• To abide by the procedures of the Company concerning the services entrusted to you.",
      "• To maintain a high standard of efficiency and diligence in your work, exerting full efforts to develop and protect the interests of the Company.",
      `2. Your C.T.C. has been fixed as**${formatSalary(data.salary)}**INR per annum.`,
      "3. You will be on probation for the first Six Months. Upon confirmation, your services are terminable with six months’ notice or payment thereof without assigning any reason. The assignment in this Company may also terminate before the date of expiry of the attendance formerly requested, by mutual agreement or non-fulfillment of this cooperation relationship or your misconduct. However, during the probation period, the services may be terminated by giving 30 days’ notice or 15 days salary in lieu thereof.",
      "4. The above monthly pay covers 1 (one) calendar day of leave per month. This leave shall be scheduled in accordance with the Company's convenience, and the leave can be accumulated over the months till December of the same year but cannot be encashed. For details, please refer to the Company leave policy.",
      "5. You will need to submit to this office, copies of your resume and testimonials, for the Company's record. You will report to this Office any changes regarding your qualifications or certifications.",
      "6. Keeping in view the special nature of the Company's business, you shall be required to enter into a necessary Confidential Agreement with the Company. During the course of your employment with this Company, you shall maintain strict confidentiality as to our affairs and shall make no disclosure to any person not legally entitled hereto; nor shall you permit or allow any person to inspect or have access to any books, documents, and belongings to or in the possession of our offices. Your confidentiality obligation shall continue even after the expiry of your employment with the Company for any reason.",
    ];


    const contentPageTwo = [
      "7. You shall make good any loss or damage to the Company's property caused by your negligence or any deliberate act. Your termination for such a cause shall not relieve you from the liability to make good such loss or damage, or be considered as a waiver of the company's legal remedies. Further, the company shall not be responsible for any termination damages on this ground.",
      "8. The Company expects you to work with a high standard of efficiency and economy. You will carry out the instructions of your superiors diligently and will not act in a manner, which leads to any adverse report from the management.",
      "9. You will be a full-time Employee of our Company and devote your full time and attention to the business of the Company. During the period of your employment, you shall not engage yourself in any manner, in any other service or business or profession or trade or as an agent or servant of any other person or firm whether remunerative or honorary unless agreed between you and Company in writing.",
      "10. During your working hours, and at any other time, you shall not involve in any activity whatsoever which is not connected with work or business of our Company. In case you are found engaged as mentioned above; your services will be terminated without giving any notice or salary in lieu thereof.",
      "11. This letter of appointment has been issued to you on the undertaking that there is nothing in your past records which are objectionable. If it comes to the notice of this company at any time that any declaration given by you to this Company is false or you have willfully suppressed any information, your services may be terminated without any notice or compensation in lieu thereof.",
      "12. This Letter of Appointment and the Service Agreement signed along with this constituted the entire agreement between the parties and can only be amended in writing, signed by both the parties.",
      "13. This letter of appointment cancels and supersedes any previous understanding, written, oral or implied that you may have of ours.",
      "14.  Kindly sign, date and return the annexed copy of this letter of appointment for your acceptance",
    ];
    // Add header to first page
    addFooter();
    addHeader();

    let y = 85;
    contentPageOne.forEach((paragraph) => {
      y = addJustifiedText(paragraph, y, 10, 5) + 4;
      if (y > 270) {
        // doc.addPage();
        // addHeader();
        y = 50;
      }
    });




    // Add page two without header
    doc.addPage();
    y = 30;
    contentPageTwo.forEach((paragraph) => {
      y = addJustifiedText(paragraph, y, 10, 5) + 4;
      if (y > 270) {
        doc.addPage();
        y = 50;
      }
    });

    // Add footer to page one
    addFooter();
    // Add signature lines
    y += 30;
    doc.setFont("helvetica", "bold");
    y += 20;
    doc.text("HR Executive", 20, y);
    doc.text("Employee", 150, y);
    y += 5;
    doc.text("Panorama Software Solutions Pvt Ltd", 20, y);
    y += 5;
    doc.text("Noida, UP, India", 20, y);



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
            Generate Appointment Letter
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-lg mx-auto p-6 rounded-lg">
              <AppointmentForm onSubmit={handleFormSubmit} />
            </div>
          </div>
        )}

        {pdfUrl && (
          <iframe
            className="w-full h-screen mt-8 shadow-lg"
            src={pdfUrl}
            frameBorder="0"
          />
        )}
      </div>
    </div>
  );
}






