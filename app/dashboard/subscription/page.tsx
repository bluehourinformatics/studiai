import { PricingTable } from "@clerk/nextjs";
import React from "react";

export default function SubscriptionPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="">
        <h1 className="text-3xl font-bold font-display">Subscription plans</h1>
        <p className="text-muted-foreground mt-1">Upgrade your plan.</p>
      </div>
      <div className="mt-24">
        <PricingTable />
      </div>
    </div>
  );
}
