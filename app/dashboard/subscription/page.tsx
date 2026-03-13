import { PricingTable } from "@clerk/nextjs";
import React from "react";

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-display">Subscription plans</h1>
        <p className="text-muted-foreground mt-1">Upgrade your plan.</p>
      </div>
      <PricingTable
        appearance={{
          variables: {
            colorPrimary: "var(--primary)",
            colorPrimaryForeground: "var(--primary-foreground)",
          },
        }}
      />
    </div>
  );
}
