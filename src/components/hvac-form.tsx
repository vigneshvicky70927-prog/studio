"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { HvacFormValues } from "@/lib/schema";
import { hvacFormSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "./ui/textarea";

type HVACFormProps = {
  onSubmit: (values: HvacFormValues) => void;
  isLoading: boolean;
};

const formSections = {
  roomGeometry: [
    { name: "roomLength", label: "Room Length (m)", type: "number", placeholder: "e.g., 5" },
    { name: "roomWidth", label: "Room Width (m)", type: "number", placeholder: "e.g., 4" },
    { name: "roomHeight", label: "Room Height (m)", type: "number", placeholder: "e.g., 2.8" },
    { name: "roomShape", label: "Room Shape", type: "select", options: ['rectangular', 'L-shape', 'custom'] },
    { name: "numberOfWindows", label: "Number of Windows", type: "number", placeholder: "e.g., 2" },
    { name: "windowSizeAndOrientation", label: "Window Size & Orientation", type: "text", placeholder: "e.g., 1.5x1m South, 1x1m West" },
    { name: "numberOfDoors", label: "Number of Doors", type: "number", placeholder: "e.g., 1" },
    { name: "ceilingType", label: "Ceiling Type", type: "select", options: ['normal', 'false ceiling'] },
  ],
  environmentalConditions: [
    { name: "locationCity", label: "Location / City", type: "text", placeholder: "e.g., Dubai" },
    { name: "outdoorDesignTemperature", label: "Outdoor Temp (°C)", type: "number", placeholder: "e.g., 45" },
    { name: "humidityLevel", label: "Humidity Level", type: "select", options: ['low', 'medium', 'high'] },
    { name: "sunExposure", label: "Sun Exposure", type: "select", options: ['low', 'moderate', 'high'] },
  ],
  roomUsage: [
    { name: "roomType", label: "Room Type", type: "select", options: ['bedroom', 'office', 'classroom', 'server room', 'hall', 'shop'] },
    { name: "numberOfOccupants", label: "Number of Occupants", type: "number", placeholder: "e.g., 2" },
    { name: "occupancyDuration", label: "Occupancy (hours/day)", type: "number", placeholder: "e.g., 8" },
    { name: "internalHeatSources", label: "Internal Heat Sources", type: "textarea", placeholder: "e.g., 2 computers, TV, LED lights" },
    { name: "usagePattern", label: "Usage Pattern", type: "select", options: ['continuous', 'intermittent'] },
  ],
} as const;

export function HVACForm({ onSubmit, isLoading }: HVACFormProps) {
  const form = useForm<HvacFormValues>({
    resolver: zodResolver(hvacFormSchema),
    defaultValues: {
      roomLength: 5,
      roomWidth: 4,
      roomHeight: 2.8,
      roomShape: "rectangular",
      numberOfWindows: 2,
      windowSizeAndOrientation: "1.5x1m South, 1x1m West",
      numberOfDoors: 1,
      ceilingType: "normal",
      locationCity: "Phoenix, AZ",
      outdoorDesignTemperature: 42,
      humidityLevel: "low",
      sunExposure: "high",
      roomType: "office",
      numberOfOccupants: 2,
      occupancyDuration: 8,
      internalHeatSources: "2 powerful workstations, 4 monitors, server rack",
      usagePattern: "continuous",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Input Parameters</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" defaultValue={['item-1', 'item-2', 'item-3']} className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>1. Room Geometry</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {formSections.roomGeometry.map(field => (
                    <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name as keyof HvacFormValues}
                      render={({ field: renderField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          {field.type === 'select' ? (
                            <Select onValueChange={renderField.onChange} defaultValue={renderField.value as string}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {field.options.map(option => (
                                  <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === 'textarea' ? (
                            <FormControl>
                              <Textarea placeholder={field.placeholder} {...renderField} />
                            </FormControl>
                          ) : (
                            <FormControl>
                              <Input type={field.type} placeholder={field.placeholder} {...renderField} />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>2. Environmental Conditions</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {formSections.environmentalConditions.map(field => (
                     <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name as keyof HvacFormValues}
                      render={({ field: renderField }) => (
                        <FormItem>
                          <FormLabel>{field.label}</FormLabel>
                          {field.type === 'select' ? (
                            <Select onValueChange={renderField.onChange} defaultValue={renderField.value as string}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {field.options.map(option => (
                                  <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <FormControl>
                              <Input type={field.type} placeholder={field.placeholder} {...renderField} />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>3. Room Usage</AccordionTrigger>
                <AccordionContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {formSections.roomUsage.map(field => (
                     <FormField
                      key={field.name}
                      control={form.control}
                      name={field.name as keyof HvacFormValues}
                      render={({ field: renderField }) => (
                        <FormItem className={field.name === 'internalHeatSources' ? 'sm:col-span-2' : ''}>
                          <FormLabel>{field.label}</FormLabel>
                          {field.type === 'select' ? (
                            <Select onValueChange={renderField.onChange} defaultValue={renderField.value as string}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {field.options.map(option => (
                                  <SelectItem key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : field.type === 'textarea' ? (
                            <FormControl>
                              <Textarea placeholder={field.placeholder} {...renderField} />
                            </FormControl>
                          ) : (
                            <FormControl>
                              <Input type={field.type} placeholder={field.placeholder} {...renderField} />
                            </FormControl>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Design...
                </>
              ) : (
                "Generate HVAC Design"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
