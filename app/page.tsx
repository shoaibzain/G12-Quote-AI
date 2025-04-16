import QuotationForm from "@/components/quotation-form"
import { Logo } from "@/components/logo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI-Powered Business Setup Quotation",
  description: "Generate business setup quotations for UAE",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="large" href="https://g12.ae" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#131313] mb-2">AI-Powered Business Setup Quotation</h1>
          <p className="text-[#6c757d] max-w-2xl mx-auto">
            Please fill in the details for your desired company structure below to generate an instant, AI-generated
            business setup quotation for your specific requirements.
          </p>
        </div>
        <QuotationForm />
      </div>
    </main>
  )
}
