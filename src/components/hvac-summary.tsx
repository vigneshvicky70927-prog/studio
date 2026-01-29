"use client";

import type { HvacDesignSummary } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AirVent, Building2, Lightbulb, LocateFixed, ThermometerSun, Wind } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Skeleton } from "@/components/ui/skeleton";

type HVACSummaryProps = {
  summary: HvacDesignSummary | null;
  isLoading: boolean;
};

const Section = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-xl">
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

const InfoRow = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-medium text-right">{value}</dd>
  </div>
);

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export function HVACSummary({ summary, isLoading }: HVACSummaryProps) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hvac-hero');

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!summary) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
         {heroImage &&
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            width={600}
            height={400}
            className="rounded-lg mb-6"
            data-ai-hint={heroImage.imageHint}
          />
        }
        <CardTitle className="text-2xl mb-2">Awaiting Design Parameters</CardTitle>
        <CardDescription>Fill out the form to generate your AI-powered HVAC design summary.</CardDescription>
      </Card>
    );
  }

  const { roomOverview, coolingLoadAnalysis, recommendedAcSystem, acPlacement, airflowDesign, efficiencyRecommendations } = summary;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center font-headline">HVAC Design Summary</h2>
      
      {roomOverview && (
        <Section icon={<Building2 className="text-primary" />} title="Room Overview">
          <dl className="space-y-2">
            <InfoRow label="Room Size" value={roomOverview.roomSize} />
            <InfoRow label="Usage Type" value={roomOverview.usageType} />
            <InfoRow label="Occupancy" value={roomOverview.occupancy} />
          </dl>
        </Section>
      )}

      {coolingLoadAnalysis && (
        <Section icon={<ThermometerSun className="text-primary" />} title="Cooling Load Analysis">
          <p className="text-sm text-muted-foreground leading-relaxed font-code">{coolingLoadAnalysis.estimatedCoolingLoad}</p>
        </Section>
      )}

      {recommendedAcSystem && (
        <Section icon={<AirVent className="text-primary" />} title="Recommended AC System">
          <dl className="space-y-2">
            <InfoRow label="AC Capacity" value={recommendedAcSystem.acCapacity} />
            <InfoRow label="AC Type" value={recommendedAcSystem.acType} />
            <InfoRow label="Number of Units" value={recommendedAcSystem.numberOfUnits} />
          </dl>
        </Section>
      )}

      {acPlacement && (
        <Section icon={<LocateFixed className="text-primary" />} title="AC Placement">
          <dl className="space-y-4">
            <div>
              <dt className="text-muted-foreground">Recommended Position</dt>
              <dd className="font-medium">{acPlacement.recommendedPosition}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Mounting Height</dt>
              <dd className="font-medium">{acPlacement.mountingHeight}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Reasoning</dt>
              <dd className="text-sm mt-1">{acPlacement.reasoning}</dd>
            </div>
          </dl>
        </Section>
      )}

      {airflowDesign && (
        <Section icon={<Wind className="text-primary" />} title="Airflow Design">
           <dl className="space-y-4">
            <div>
              <dt className="text-muted-foreground">Airflow Direction</dt>
              <dd className="font-medium">{airflowDesign.airflowDirection}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Coverage Strategy</dt>
              <dd className="font-medium">{airflowDesign.coverageStrategy}</dd>
            </div>
             <div>
              <dt className="text-muted-foreground">Throw Length</dt>
              <dd className="text-sm mt-1">{airflowDesign.throwLengthConsideration}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Draft Avoidance</dt>
              <dd className="text-sm mt-1">{airflowDesign.draftAvoidance}</dd>
            </div>
          </dl>
        </Section>
      )}

      {efficiencyRecommendations && (
        <Section icon={<Lightbulb className="text-primary" />} title="Efficiency Recommendations">
          <ul className="space-y-2 list-disc list-inside text-sm">
            {efficiencyRecommendations.energySavingTips.split(/\n- /).map((tip, i) => tip.trim() && <li key={i}>{tip.replace(/^- /, '')}</li>)}
          </ul>
        </Section>
      )}
    </div>
  );
}
