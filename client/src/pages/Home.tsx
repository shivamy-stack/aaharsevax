import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Utensils, HandHeart, Truck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" />

          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium border border-orange-200"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Bridging the gap between abundance and need
              </motion.div>

              <motion.h1 
                {...fadeIn}
                className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground leading-[1.1]"
              >
                Stop Wastage, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                  Feed the Needy
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                AharSetu connects restaurants, events, and individuals with surplus food to NGOs who distribute it to those in need. Join our mission to end hunger.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <Link href="/donate">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl shadow-primary/25 hover:shadow-2xl hover:-translate-y-1 transition-all">
                    <Utensils className="mr-2 h-5 w-5" />
                    Donate Food
                  </Button>
                </Link>
                <Link href="/request">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 hover:bg-secondary/5 hover:text-secondary hover:border-secondary transition-all">
                    <HandHeart className="mr-2 h-5 w-5" />
                    I am an NGO
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white/50 border-t border-border/50">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              <motion.div variants={fadeIn} className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Utensils className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Donors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Restaurants, caterers, and individuals can list excess food. We ensure it reaches the right hands quickly and safely.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary mb-6">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Logistics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform helps coordinate the pickup and delivery, ensuring food freshness is maintained during transit.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="bg-card p-8 rounded-2xl shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">NGOs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Registered NGOs receive notifications of available food nearby and can claim it for distribution to beneficiaries.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">Our Impact So Far</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-primary-foreground/80 font-medium">Donations</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-primary-foreground/80 font-medium">Partner NGOs</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">12k+</div>
                <div className="text-primary-foreground/80 font-medium">Meals Served</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">8</div>
                <div className="text-primary-foreground/80 font-medium">Cities</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
