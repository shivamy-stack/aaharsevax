import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNgoRequestSchema } from "@shared/routes";
import { type InsertNgoRequest } from "@shared/schema";
import { useCreateNgoRequest } from "@/hooks/use-ngo-requests";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"];

export default function NgoRequest() {
  const { toast } = useToast();
  const mutation = useCreateNgoRequest();

  const form = useForm<InsertNgoRequest>({
    resolver: zodResolver(insertNgoRequestSchema),
    defaultValues: {
      ngoName: "",
      contactNumber: "",
      requirements: "",
    },
  });

  function onSubmit(data: InsertNgoRequest) {
    mutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Request Submitted",
          description: "Your requirement has been listed. We will connect you with donors soon.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
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
          title="NGO Requirements" 
          description="Are you an NGO in need of food supplies? Let us know your requirements."
        />

        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-t-4 border-t-secondary shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="ngoName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NGO / Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Feeding India Foundation" {...field} className="h-12 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what you need (e.g., 50 meal packets for children in Andheri shelter)" 
                            className="min-h-[120px] rounded-lg resize-none text-base p-4"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full text-lg h-14 rounded-xl bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/25 transition-all"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
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
