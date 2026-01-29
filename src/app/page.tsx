"use client";

import { useState } from "react";
import type { HvacFormValues } from "@/lib/schema";
import { generateHvacDesign } from "@/app/actions";
import type { HvacDesignSummary } from "@/app/actions";
import { HVACForm } from "@/components/hvac-form";
import { HVACSummary } from "@/components/hvac-summary";
import { useToast } from "@/hooks/use-toast";
import { Wind } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [summary, setSummary] = useState<HvacDesignSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (values: HvacFormValues) => {
    setIsLoading(true);
    setSummary(null);
    const result = await generateHvacDesign(values);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      setSummary(null);
    } else {
      setSummary(result);
      toast({
        title: "Success",
        description: "Your HVAC design has been generated.",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Wind className="h-16 w-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
          HVAC Design Pro
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Your AI-powered assistant for professional HVAC design and analysis.
        </p>
      </div>

      <Separator className="my-8 md:my-12" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="w-full">
          <HVACForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </div>
        <div className="w-full sticky top-8">
          <HVACSummary summary={summary} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
