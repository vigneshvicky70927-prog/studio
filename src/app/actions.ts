'use server';

import type { HvacFormValues } from "@/lib/schema";
import { defineAirflowDirection } from "@/ai/flows/define-airflow-direction";
import { estimateCoolingLoad } from "@/ai/flows/estimate-cooling-load";
import { provideEfficiencySuggestions } from "@/ai/flows/provide-efficiency-suggestions";
import { recommendAcCapacity } from "@/ai/flows/recommend-ac-capacity";
import { suggestOptimalAcPlacement } from "@/ai/flows/suggest-optimal-ac-placement";

export type HvacDesignSummary = {
    roomOverview: {
        roomSize: string;
        usageType: string;
        occupancy: string;
    };
    coolingLoadAnalysis: {
        estimatedCoolingLoad: string;
    };
    recommendedAcSystem: {
        acCapacity: string;
        acType: string;
        numberOfUnits: string;
    };
    acPlacement: {
        recommendedPosition: string;
        mountingHeight: string;
        reasoning: string;
    };
    airflowDesign: {
        airflowDirection: string;
        coverageStrategy: string;
        throwLengthConsideration: string;
        draftAvoidance: string;
    };
    efficiencyRecommendations: {
        energySavingTips: string;
    };
    error?: string;
};

export async function generateHvacDesign(values: HvacFormValues): Promise<HvacDesignSummary> {
  try {
    const [
      coolingLoad,
      acCapacity,
      acPlacement,
      airflow,
      efficiency,
    ] = await Promise.all([
      estimateCoolingLoad({
        ...values,
        numWindows: values.numberOfWindows,
        numDoors: values.numberOfDoors,
        numOccupants: values.numberOfOccupants,
      }),
      recommendAcCapacity(values),
      suggestOptimalAcPlacement(values),
      defineAirflowDirection(values),
      provideEfficiencySuggestions({
        roomType: values.roomType,
        climate: `${values.locationCity} (${values.humidityLevel} humidity)`,
      }),
    ]);

    return {
      roomOverview: {
        roomSize: `${values.roomLength}m x ${values.roomWidth}m x ${values.roomHeight}m`,
        usageType: values.roomType,
        occupancy: `${values.numberOfOccupants} occupants`,
      },
      coolingLoadAnalysis: {
        estimatedCoolingLoad: coolingLoad.coolingLoadEstimate,
      },
      recommendedAcSystem: {
        acCapacity: `${acCapacity.acCapacityTr} TR${acCapacity.acCapacityKw ? ` / ${acCapacity.acCapacityKw} kW` : ''}`,
        acType: acCapacity.acType,
        numberOfUnits: acCapacity.suggestedUnits,
      },
      acPlacement,
      airflowDesign: airflow,
      efficiencyRecommendations: {
        energySavingTips: efficiency.energySavingTips,
      },
    };
  } catch (error) {
    console.error("Error generating HVAC design:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { 
        // @ts-ignore
        error: `An error occurred while generating the HVAC design. Please check your inputs and try again. Details: ${errorMessage}` 
    };
  }
}
