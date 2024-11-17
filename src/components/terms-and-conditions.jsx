'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Input } from './ui/input'
// import jspdf
import { jsPDF } from 'jspdf'
import toast from 'react-hot-toast'

const sectionsConst = [
  {
    title: "1. Acceptance of Terms",
    content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement."
  },
  {
    title: "2. Use License",
    content: "Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only."
  },
  {
    title: "3. Disclaimer",
    content: "The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
  },
  {
    title: "4. Limitations",
    content: "In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage."
  },
  {
    title: "5. Revisions and Errata",
    content: "The materials appearing on our website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete or current. We may make changes to the materials contained on its website at any time without notice."
  },
  {
    title: "6. Links",
    content: "We have not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk."
  },
  {
    title: "7. Site Terms of Use Modifications",
    content: "We may revise these terms of use for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use."
  },
  {
    title: "8. Governing Law",
    content: "Any claim relating to our website shall be governed by the laws of the State of California without regard to its conflict of law provisions."
  },
  {
    title: "9. Contact Information",
    content: "If you have any questions or concerns regarding our terms and conditions, please contact us at contact page."
  },
  {
    title: "10. Agreement",
    content: "By using our website, you hereby consent to our terms and conditions."
  }
]

export function TermsAndConditions() {
  const [accepted, setAccepted] = useState(false)
  const [sections, setSections] = useState(sectionsConst)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search) {
      setSections(sectionsConst.filter(section => section.title.toLowerCase().includes(search.toLowerCase()) || section.content.toLowerCase().includes(search.toLowerCase())))
    } else {
      setSections(sectionsConst)
    }
  }, [search])

  const downloadTerms = () => {
  /*   const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('Terms and Conditions', 10, 10)
    doc.setFontSize(12)
    sectionsConst.forEach((section, index) => {
      // check if the section line is completed or not if it is completed then write it into the new line
      if (doc.splitTextToSize(section.title, 180).length > 1) {
        doc.text(doc.splitTextToSize(section.title, 180), 10, 20 + index * 10)
      } else {
        doc.text(section.title, 10, 20 + index * 10)
      }
    })
    doc.save('terms-and-conditions.pdf') */
    toast.error('Download feature is not available in the demo')
  }


  return (
    (<div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Please read our terms and conditions carefully</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <Input type="text" placeholder="Search terms" className="w-full mb-4" value={search} onChange={(e) => setSearch(e.target.value)} />
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <Accordion type="single" collapsible className="w-full">
                {sections.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{section.title}</AccordionTrigger>
                    <AccordionContent>{section.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  Download T&C
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Download Terms and Conditions</AlertDialogTitle>
                  <AlertDialogDescription>
                    By clicking the download button, you agree to our terms and conditions.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    downloadTerms()
                  }}>
                    Download
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </motion.div>
    </div>)
  );
}