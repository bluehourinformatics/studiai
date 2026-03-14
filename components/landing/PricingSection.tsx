"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying things out",
    features: [
      "Upload 1 book",
      "5 voice session / month",
      "Up to 5 minutes per session",
      "No session history",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Standard",
    price: "$8",
    period: "/ month",
    description: "For serious students, regular reading with more books.",
    features: [
      "Upload 10 books",
      "100 voice sessions / month",
      "Up to 15 minutes per session",
      "Session history",
    ],
    cta: "Subscribe Now",
    featured: true,
  },
  {
    name: "Pro",
    price: "$15",
    period: "/ month",
    description: "For study groups & institutions",
    features: [
      "100 books upload",
      "Unlimited voice sessions",
      "Up to 60 minutes per session",
      "Session history",
    ],
    cta: "Upgrade to Pro",
    featured: false,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PricingSection = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  function handleSubscription(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void {
    if (isSignedIn) {
      router.push("/dashboard/subscription");
      return;
    } else {
      router.push("/sign-up");
    }
  }

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold">
            Simple, <span className="text-gradient-primary">transparent</span>{" "}
            pricing
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Start free and upgrade when you're ready. No hidden fees.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={item}
              className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 ${
                tier.featured
                  ? "glass border-primary/40 glow-primary scale-[1.03]"
                  : "glass hover:border-primary/20"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {tier.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-sm text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-secondary-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant={tier.featured ? "default" : "outline"}
                size="lg"
                onClick={handleSubscription}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
