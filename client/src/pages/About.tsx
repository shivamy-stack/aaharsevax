import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Globe, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <PageHeader 
          title="About AaharsevaX" 
          description="We are on a mission to bridge the gap between hunger and excess food, creating a sustainable ecosystem for food redistribution."
        />

        <div className="container mx-auto px-4 pb-20 max-w-5xl">
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-display">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To eliminate hunger by creating an efficient, technology-driven platform that makes food donation simple, transparent, and accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-transparent">
              <CardContent className="p-8 space-y-4">
                <div className="h-12 w-12 bg-secondary text-secondary-foreground rounded-xl flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-display">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A world where no edible food goes to waste and no individual has to go to sleep hungry. We envision a community-driven safety net for food security.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <div className="space-y-8 mb-20">
            <h2 className="text-3xl font-bold font-display text-center">Why We Started</h2>
            <div className="prose prose-lg mx-auto text-muted-foreground">
              <p>
                Every day, tons of food are wasted in restaurants, weddings, and households, while millions struggle to find their next meal. AaharsevaX (meaning "Food Bridge") was born out of a simple observation: the problem isn't a lack of food, but a lack of connection.
              </p>
              <p>
                Our platform serves as that missing link. By simplifying the process of reporting excess food and matching it with local NGOs, we reduce response times and ensure food is consumed while it's fresh.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-foreground text-background rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <Heart className="h-16 w-16 mx-auto text-red-500 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-display font-bold">Ready to make a difference?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join our network of donors and volunteers today. A small act of kindness can feed a family.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Link href="/donate">
                  <Button size="lg" className="text-lg px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                    Start Donating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
