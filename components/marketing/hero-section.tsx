import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      className="relative px-5 py-20 md:py-28"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-medium text-saffron">
          Digital marketing that compounds
        </p>
        <h1
          id="hero-heading"
          className="text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl"
        >
          Grow demand with Digikon Marketing
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
          Strategy, creative, and performance under one roof. We help brands
          reach the right audiences and turn clicks into customers.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className={cn(
              "bg-saffron text-saffron-foreground shadow hover:bg-saffron/90",
            )}
          >
            <Link href="/consult">Get a free consult</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn(
              "border-saffron text-saffron bg-transparent hover:bg-saffron/10 hover:text-saffron",
            )}
          >
            <Link href="/services">See services</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          No obligation — tell us your goals and we&apos;ll reply within two
          business days.
        </p>
      </div>
    </section>
  );
}
