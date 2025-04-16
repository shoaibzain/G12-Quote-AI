"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatCurrency } from "@/lib/utils";
import { Logo } from "./logo";
import Link from "next/link";
import Image from "next/image";

interface QuotationPreviewProps {
  data: {
    clientInfo: {
      name: string;
      mobile: string;
      email: string;
      nationality: string;
    };
    businessSetup: {
      type: string;
      emirates: string;
      businessActivities: string[];
      officeSpace: string;
      shareholders: string;
      visas: string;
    };
    pricing: {
      basePrice: number;
      visaPrice: number;
      totalPrice: number;
      disclaimer?: string;
    };
    date: string;
    quotationNumber: string;
  };
  onBack: () => void;
}

export default function QuotationPreview({
  data,
  onBack,
}: QuotationPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = async () => {
    setIsGenerating(true);
    const quotationElement = document.getElementById("quotation-preview");

    if (!quotationElement) {
      setIsGenerating(false);
      return;
    }

    try {
      const canvas = await html2canvas(quotationElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Create a sanitized client name for the filename (remove special characters)
      const clientName = data.clientInfo.name.replace(/[^a-zA-Z0-9]/g, "_");
      pdf.save(`G12_Quotation_${clientName}_${data.quotationNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }

    setIsGenerating(false);
  };

  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onBack} variant="outline">
          Back to Form
        </Button>
        <Button
          onClick={downloadPDF}
          disabled={isGenerating}
          className="bg-[#d6a456] hover:bg-[#ab8134] text-white"
        >
          {isGenerating ? "Generating PDF..." : "Download Quotation"}
        </Button>
      </div>

      <Card className="overflow-hidden" id="quotation-preview">
        <div className="bg-[#131313] sm:p-6 p-4 text-white">
          <div className="flex justify-between items-center">
            <Logo size="small" href="https://g12.ae" />
            <div className="text-right">
              <h3 className="text-xl font-semibold">QUOTATION</h3>
              <p className="text-sm">#{data.quotationNumber}</p>
              <p className="text-sm">Date: {data.date}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-4 md:p-6">
          <div className="grid md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
            <div>
              <h3 className="text-lg font-semibold text-[#131313] mb-3">
                Client Information
              </h3>
              <div className="sm:space-y-2 space-y-1 sm:text-base text-sm">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {data.clientInfo.name}
                </p>
                <p>
                  <span className="font-semibold">Mobile:</span>{" "}
                  {data.clientInfo.mobile}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {data.clientInfo.email}
                </p>
                <p>
                  <span className="font-semibold">Nationality:</span>{" "}
                  {data.clientInfo.nationality}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#131313] mb-3">
                Business Setup Details
              </h3>
              <div className="sm:space-y-2 space-y-1 sm:text-base text-sm">
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {data.businessSetup.type}
                </p>
                <p>
                  <span className="font-semibold">Emirates:</span>{" "}
                  {data.businessSetup.emirates}
                </p>
                <p>
                  <span className="font-semibold">Business Activities:</span>{" "}
                  {data.businessSetup.businessActivities.join(", ")}
                </p>
                <p>
                  <span className="font-semibold">Office Space Required:</span>{" "}
                  {data.businessSetup.officeSpace}
                </p>
                <p>
                  <span className="font-semibold">Number of Shareholders:</span>{" "}
                  {data.businessSetup.shareholders}
                </p>
                <p>
                  <span className="font-semibold">Number of Visas:</span>{" "}
                  {data.businessSetup.visas}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#131313] mb-4">
              Quotation Details
            </h3>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Services Included:</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {data.businessSetup.type === "Freezone" ? (
                    <>
                      <li>Freezone Company Registration</li>
                      <li>Trade License Issuance</li>
                      <li>Establishment Card</li>
                      <li>Share Certificate</li>
                      <li>Memorandum of Association (MOA)</li>
                      <li>Corporate Bank Account Assistance</li>
                      {Number.parseInt(data.businessSetup.visas) > 0 && (
                        <>
                          <li>Immigration Card</li>
                          <li>
                            Visa Processing for {data.businessSetup.visas}{" "}
                            {Number.parseInt(data.businessSetup.visas) === 1
                              ? "person"
                              : "people"}
                          </li>
                          <li>Medical Testing Assistance</li>
                          <li>Emirates ID Processing</li>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <li>Mainland Company Registration</li>
                      <li>Trade License Issuance</li>
                      <li>Initial Approval</li>
                      <li>MOA Attestation</li>
                      <li>Corporate Bank Account Assistance</li>
                      <li>Trade Name Reservation</li>
                      {data.businessSetup.officeSpace === "Yes" ? (
                        <li>Office Space Consultation</li>
                      ) : data.businessSetup.officeSpace === "No" ? (
                        <li>Virtual Office Setup Assistance</li>
                      ) : null}
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-3 md:p-4 rounded-md mb-4">
              <h4 className="font-semibold mb-2">Cost Breakdown:</h4>
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex justify-between flex-wrap">
                  <span>Base Setup Cost:</span>
                  <span>{formatCurrency(data.pricing.basePrice)}</span>
                </div>

                {Number.parseInt(data.businessSetup.visas) > 0 && (
                  <div className="flex justify-between flex-wrap">
                    <span>
                      Visa Cost ({data.businessSetup.visas} × AED 6,500):
                    </span>
                    <span>{formatCurrency(data.pricing.visaPrice)}</span>
                  </div>
                )}

                {data.businessSetup.type === "Mainland" && (
                  <div className="flex justify-between text-sm text-gray-600 italic">
                    <span>Government Fees:</span>
                    <span>As applicable</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                  <span>Total Cost:</span>
                  <span className="text-[#d6a456]">
                    {formatCurrency(data.pricing.totalPrice)}
                  </span>
                </div>

                <div className="text-red-600 font-semibold sm:text-sm text-xs mt-2 border-t border-red-200 pt-2">
                  The above provided figure is an estimate cost only. For a more
                  accurate cost and possible promotional offers, please consult
                  directly with your dedicated Success Manager at G12.
                </div>
              </div>
            </div>

            {data.pricing.disclaimer && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm text-yellow-800 mb-4">
                <p className="font-semibold">Important Note:</p>
                <p>{data.pricing.disclaimer}</p>
              </div>
            )}

            <div className="border p-4 rounded-md mb-6">
              <h4 className="font-semibold mb-2">Timeline:</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">Initial Approval:</span> 3-5
                  working days
                </p>
                <p>
                  <span className="font-semibold">License Issuance:</span>{" "}
                  {data.businessSetup.type === "Freezone" ? "7-10" : "10-15"}{" "}
                  working days
                </p>
                {Number.parseInt(data.businessSetup.visas) > 0 && (
                  <p>
                    <span className="font-semibold">Visa Processing:</span> 15-20
                    working days per visa
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-b py-4 my-4">
              <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                <li>
                  This quotation is valid for 30 days from the date of issue.
                </li>
                <li>
                  50% advance payment is required to initiate the process.
                </li>
                <li>
                  Government fees are subject to change without prior notice.
                </li>
                <li>
                  Additional charges may apply for premium locations or special
                  approvals.
                </li>
                <li>
                  Processing times are estimates and may vary based on
                  government procedures.
                </li>
                <li>
                  Cancellation policy: 25% of the paid amount is non-refundable
                  if the process is cancelled after initiation.
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-[#d6a456] text-center">
                G12 Business Services
              </h4>
              <div className="text-sm text-center">
                <p className="sm:w-[33%] m-auto">
                  Office 1906, Al Shafar Tower 1, Barsha Heights (Tecom), Dubai,
                  UAE P.O. Box: 123456</p>
                <div className="mt-2">
                  <Link
                    href="mailto:info@g12.ae"
                    className="text-[#d6a456] hover:underline mx-2"
                  >
                    info@g12.ae
                  </Link>
                  |
                  <Link
                    href="tel:+97145706451"
                    className="text-[#d6a456] hover:underline mx-2"
                  >
                    +971 4 570 6451
                  </Link>
                  |
                  <Link
                    href="https://www.g12.ae"
                    target="_blank"
                    className="text-[#d6a456] hover:underline mx-2"
                  >
                    www.g12.ae
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block border-t-2 border-[#d6a456] pt-2">
                <p className="text-sm text-[#131313]">
                  Thank you for choosing G12 for your business setup needs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="md:col-span-2 flex flex-col items-center gap-4 mt-6">
            <h3 className="text-lg font-semibold text-center">
              Here are the next steps to <span className="text-[#d6a456] text-2xl uppercase">#GenerateSuccess</span> in the UAE:
            </h3>

            <Button
              className="bg-[#d6a456] hover:bg-[#ab8134] text-white px-8 py-2 uppercase"
              onClick={downloadPDF}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating PDF..." : "Download Quotation"}
            </Button>
            <div className="flex flex-col items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
             <div className="rounded-full border-2 border-[#d6a456] overflow-hidden h-[100px] w-[100px]">
             <Image
                src="/sonia.png" // Updated to use Next.js Image component
                alt="Sonia"
                width={100} // Adjusted width for the image
                height={100} // Adjusted height for the image
                
              />
             </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-800">Sonia</h4>
                <p className="text-sm text-gray-600">Your Success Manager</p>
              </div>
              <Button
                className="bg-[#d6a456] hover:bg-[#ab8134] text-white px-6 py-2 uppercase rounded-full shadow-lg"
                onClick={() => {
                  // Logic to forward the quotation to Sonia's WhatsApp with the quotation attached
                  const message = encodeURIComponent(
                    `Hello Sonia, I would like to discuss my AI-generated business setup quotation further.`
                  );
                  const whatsappUrl = `https://wa.me/971525850087?text=${message}`; // Replace with Sonia's actual number
                  window.open(whatsappUrl, "_blank");
                }}
              >
                Speak to Your Success Manager
              </Button>
            </div>
          </div>
    </div>
  );
}
