import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDonationSchema } from "@shared/routes";
import { type InsertDonation } from "@shared/schema";
import { useCreateDonation } from "@/hooks/use-donations";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"];

export default function DonateFood() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const mutation = useCreateDonation();

  const form = useForm<InsertDonation>({
    resolver: zodResolver(insertDonationSchema),
    defaultValues: {
      donorName: "",
      contactNumber: "",
      quantity: "",
      area: "",
      foodType: "Cooked",
      isFresh: false,
    },
  });

  function onSubmit(data: InsertDonation) {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Donation Submitted!",
          description: "Thank you for your generosity. An NGO will contact you shortly.",
        });
        form.reset();
        setLocation("/donate"); // effectively stays on page but could redirect if needed
      },
      onError: (error) => {
        toast({
          title: "Submission Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pb-16">
        <PageHeader 
          title="Donate Food" 
          description="Help us ensure no food goes to waste. Fill out the details below to list your donation."
        />

        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-t-4 border-t-primary shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="donorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Donor / Restaurant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Doe or Tasty Bites" {...field} className="h-12 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input placeholder="9876543210" {...field} className="h-12 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-lg">
                                <SelectValue placeholder="Select City" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Area / Locality</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Indiranagar" {...field} value={field.value || ''} className="h-12 rounded-lg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity / Description</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Meals for 50 people, 10kg Rice" {...field} className="h-12 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="foodType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Food Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-colors w-full">
                              <FormControl>
                                <RadioGroupItem value="Cooked" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">
                                Cooked Meals
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-xl hover:bg-accent cursor-pointer transition-colors w-full">
                              <FormControl>
                                <RadioGroupItem value="Packed" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer w-full">
                                Packed / Raw Items
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isFresh"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 shadow-sm bg-orange-50 border-orange-100">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-orange-900 font-semibold">
                            Freshness Guarantee
                          </FormLabel>
                          <FormDescription className="text-orange-700">
                            I confirm that the cooked food was prepared within the last 2 hours and is safe for consumption.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg h-14 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Donation"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
