import { useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitEnquiry } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Monitor, IndianRupee, Cpu, BrainCircuit, Code, Lightbulb, Users, Trophy, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(7, { message: "Phone number must be at least 10 digits." }),
  message: z.string().optional(),
});

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const submitEnquiry = useSubmitEnquiry();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitEnquiry.mutate({
      data: values
    }, {
      onSuccess: () => {
        toast({
          title: "Registration Successful!",
          description: "We've received your enquiry and will be in touch soon.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "Please try again later.",
        });
      }
    });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-primary">Kidrove</span>
          </div>
          <Button onClick={scrollToForm} className="rounded-full font-semibold shadow-sm" data-testid="button-nav-enroll">
            Enroll Now
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          {/* Decorative background blobs */}
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                className="flex-1 text-center lg:text-left space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-2">
                  <span className="flex w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                  Summer 2026 Admissions Open
                </motion.div>
                
                <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight">
                  AI & Robotics <br className="hidden md:block" />
                  <span className="text-primary relative inline-block">
                    Summer Workshop
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                    </svg>
                  </span>
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
                  Dive into the future! Build robots, code AI projects, and explore cutting-edge technology in this hands-on summer adventure for curious minds aged 8-14.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Button size="lg" className="rounded-full h-14 px-8 text-lg shadow-md hover:-translate-y-1 transition-transform w-full sm:w-auto" onClick={scrollToForm} data-testid="button-hero-enroll">
                    Secure Your Spot
                  </Button>
                  <p className="text-sm text-muted-foreground font-medium">Limited seats available!</p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="flex-1 relative w-full max-w-lg lg:max-w-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square">
                  {/* We use a colored placeholder if the image doesn't load or isn't there yet, but rely on the actual image src */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] transform rotate-3" />
                  <img 
                    src="/hero-robot.png" 
                    alt="Friendly 3D robot learning to code on a laptop" 
                    className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-10"
                    onError={(e) => {
                      // Fallback if image not generated yet
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Fallback decorative element if image is missing */}
                  <div className="absolute inset-0 bg-primary/10 rounded-[2rem] border-4 border-white/50 -z-0 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                     <BrainCircuit className="w-32 h-32 text-primary/20" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Workshop Details Section */}
        <section className="py-20 bg-muted/50 border-y">
          <div className="container mx-auto px-4">
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                { icon: Users, label: "Age Group", value: "8–14 Years", color: "bg-blue-100 text-blue-600" },
                { icon: Clock, label: "Duration", value: "4 Weeks", color: "bg-orange-100 text-orange-600" },
                { icon: Monitor, label: "Mode", value: "Online", color: "bg-green-100 text-green-600" },
                { icon: IndianRupee, label: "Fee", value: "₹2,999", color: "bg-purple-100 text-purple-600" },
                { icon: Calendar, label: "Start Date", value: "15 July 2026", color: "bg-pink-100 text-pink-600" },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Card className="border-none shadow-sm h-full hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">{item.label}</p>
                        <p className="font-bold text-lg text-foreground">{item.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Learning Outcomes Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold font-display mb-4"
              >
                What Will Your Child Learn?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Our hands-on curriculum ensures every child walks away with practical tech skills and a sense of accomplishment.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Cpu, title: "Build Working Robots", desc: "Construct and program a functional robot from scratch using foundational electronics." },
                { icon: BrainCircuit, title: "Master AI Concepts", desc: "Understand core AI principles like machine learning and pattern recognition in a fun way." },
                { icon: Code, title: "Code Games & Apps", desc: "Learn to code interactive games and applications using Python and Scratch." },
                { icon: Lightbulb, title: "Develop Logic Skills", desc: "Enhance critical problem-solving and logical thinking abilities through coding challenges." },
                { icon: Users, title: "Collaborate in Teams", desc: "Work together with peers on real-world tech projects, building teamwork and communication." },
                { icon: Trophy, title: "Earn a Certificate", desc: "Receive a digital certificate of completion and showcase their final project to the world." },
              ].map((outcome, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                    <outcome.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{outcome.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{outcome.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold font-display mb-4"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground"
              >
                Got questions? We've got answers.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="w-full space-y-4">
                {[
                  {
                    q: "Do I need any prior coding experience?",
                    a: "No experience needed! The workshop is beginner-friendly and designed for curious young minds starting from zero."
                  },
                  {
                    q: "What equipment does my child need?",
                    a: "Just a computer or laptop with a stable internet connection. All software used is free and browser-based."
                  },
                  {
                    q: "Will there be live sessions or is it self-paced?",
                    a: "There are live interactive sessions every weekday with expert instructors, plus recorded replays available."
                  },
                  {
                    q: "Is there a certificate at the end?",
                    a: "Yes! Every child who completes the workshop receives a digital certificate of achievement."
                  }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="bg-card px-6 py-2 rounded-2xl border shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline hover:text-primary transition-colors">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section ref={formRef} className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary -z-20 skew-y-3 transform origin-top-left scale-110" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl mx-auto bg-card rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-display mb-3">Enroll Your Child Today</h2>
                <p className="text-muted-foreground">Fill out the form below to secure a spot for the summer batch.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Parent/Guardian Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" {...field} data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 98765 43210" type="tel" className="h-12 rounded-xl bg-muted/50 border-transparent focus:bg-background" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Any Questions? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us if your child has any specific interests..." 
                            className="min-h-[120px] rounded-xl bg-muted/50 border-transparent focus:bg-background resize-none" 
                            {...field} 
                            data-testid="input-message"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-xl text-lg font-bold shadow-md hover:-translate-y-0.5 transition-transform" 
                    disabled={submitEnquiry.isPending}
                    data-testid="button-submit-enquiry"
                  >
                    {submitEnquiry.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="text-white w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">Kidrove</span>
          </div>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Empowering the next generation of innovators, creators, and problem solvers through engaging tech education.
          </p>
          <div className="text-sm text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Kidrove Activities. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
