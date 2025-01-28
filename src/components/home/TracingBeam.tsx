"use client";
import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { Scan, ShieldCheck, Brain, Sparkles, Leaf } from "lucide-react";

const HomeTracingBeam = () => {
  return (
    <TracingBeam className="p-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative ">
        {content.map((item, index) => (
          <div key={`content-${index}`} className="mb-16">
            <div className="flex items-center gap-2 mb-4">
              {item.icon}
              <h2 className="bg-gradient-to-br from-primary to-primary-400 text-white rounded-full text-sm w-fit px-4 py-1">
                {item.badge}
              </h2>
            </div>

            <p className={twMerge("text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400")}>
              {item.title}
            </p>

            <div className="text-sm prose prose-sm dark:prose-invert">
              {item?.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover shadow-xl ring-1 ring-neutral-900/5"
                />
              )}
              <div className="text-base leading-relaxed">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const content = [
  {
    title: "Smart Product Analysis at Your Fingertips",
    description: (
      <>
        <p className="text-default-foreground">
          Simply scan your product or upload images of its packaging. PurePick&apos;s advanced AI powered by Google Gemini instantly analyzes ingredients, nutritional values, and safety information to provide you with comprehensive insights about your products.
        </p>
        <p className="mt-4 text-default-foreground">
          Our technology combines multiple data sources including OpenFoodFacts, GoUPC, and regulatory databases to ensure you get the most accurate and reliable product information.
        </p>
      </>
    ),
    badge: "Instant Scanning",
    icon: <Scan className="w-5 h-5 text-primary" />,
    image: "/Assets/scanning.png"
  },
  {
    title: "Personalized Health Recommendations",
    description: (
      <>
        <p className="text-default-foreground">
          Get tailored product recommendations based on your age, health conditions, and dietary preferences. PurePick evaluates each product&apos;s suitability specifically for you, highlighting potential benefits and risks.
        </p>
        <p className="mt-4 text-default-foreground">
          Our AI considers various age groups - from infants to seniors - ensuring products are safe and beneficial for everyone in your family.
        </p>
      </>
    ),
    badge: "Smart Analysis",
    icon: <Brain className="w-5 h-5 text-primary" />,
    image: "/Assets/personalized-health.svg"
  },
  {
    title: "Comprehensive Safety Checks",
    description: (
      <>
        <p className="text-default-foreground">
          Every product undergoes rigorous safety analysis checking against FDA guidelines, WHO standards, and latest research. We alert you about potentially harmful ingredients, allergens, and safety concerns.
        </p>
        <p className="mt-4 text-default-foreground">
          Stay informed about product recalls, safety warnings, and regulatory compliance issues to make safer choices for you and your family.
        </p>
      </>
    ),
    badge: "Safety First",
    icon: <ShieldCheck className="w-5 h-5 text-primary" />,
  },
  {
    title: "Eco-Conscious Choices",
    description: (
      <>
        <p className="text-default-foreground">
          Understand the environmental impact of your products. PurePick evaluates packaging materials, sustainability practices, and provides eco-friendly alternatives to help you make environmentally conscious decisions.
        </p>
      </>
    ),
    badge: "Sustainability",
    icon: <Leaf className="w-5 h-5 text-primary" />,
    image: "/Assets/eco-friendly.svg"
  },
];

export default HomeTracingBeam;
