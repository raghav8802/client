"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ClipboardList } from "lucide-react";

// Fixed platforms array
const platforms = [
  "Spotify",
  "JioSaavn",
  "Wynk",
  "Facebook",
  "Amazon",
  "Gaana",
  "iTunes",
  "YouTubeCMS",
  "Tiktok",
  "AtlantisCRBT",
  "Jio CRBT",
  "Pandora",
  "Deezer",
  "Snap",
  "Anghami",
  "RESSO-Bytedance",
  "SoundCloud",
  "Hungama",
];

interface ContentDeliveryReportProps {
  contentTitle: string;
  approvalDate: string;
}

// Helper function to add days and format date as day/month/year
const addDays = (date: string, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  // Format date as dd/mm/yyyy
  const day = String(result.getDate()).padStart(2, "0");
  const month = String(result.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = result.getFullYear();

  return `${day}/${month}/${year}`;
};

export default function ContentDeliverySheet({
  contentTitle,
  approvalDate,
}: ContentDeliveryReportProps) {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            View Delivery Report
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-full sm:max-w-lg overflow-y-auto"
          id="contentDeliveryReportSheet"
        >
          <SheetHeader>
            <SheetTitle>Delivery Details</SheetTitle>
            <SheetDescription>
              Information about content delivery to multiple platforms
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">

            
            <div>
              <h3 className="text-lg font-semibold m-0">Album</h3>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                {contentTitle}
              </h4>
            </div>

            {platforms.map((platform, index) => (
              <div key={platform} className="space-y-4">
                <h3 className="text-lg font-semibold">{platform}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Platform
                    </h4>
                    <p className="text-sm">{platform}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Delivery Date
                    </h4>
                    <p className="text-sm">{addDays(approvalDate, 1)}</p>
                  </div>
                </div>
                {index < platforms.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
