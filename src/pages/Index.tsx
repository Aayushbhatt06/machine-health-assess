import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Gauge, LineChart, Settings, CheckCircle2, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Real-time Monitoring",
      description: "Track your machine's vital parameters in real-time",
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Predictive Analytics",
      description: "AI-powered predictions to prevent failures",
    },
    {
      icon: <LineChart className="h-8 w-8" />,
      title: "Performance Insights",
      description: "Detailed analysis of operational efficiency",
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Easy Configuration",
      description: "Simple setup for any industrial machine",
    },
  ];

  const benefits = [
    "Reduce unexpected downtime",
    "Optimize maintenance schedules",
    "Extend machine lifespan",
    "Lower operational costs",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Advanced Machine Diagnostics</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Assess Your Machine's Health
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Advanced diagnostics and predictive maintenance powered by intelligent analysis. 
            Keep your machines running at peak performance.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              Start Health Check
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-semibold border-2"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Everything you need for comprehensive machine health monitoring
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 bg-card/50 backdrop-blur"
              >
                <div className="rounded-lg bg-primary/10 w-16 h-16 flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Why Choose Our Platform?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                  <p className="text-lg font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-3xl animate-float" />
            <Card className="relative p-12 border-2 bg-card/80 backdrop-blur">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Optimize Your Machines?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start monitoring your machine health today and prevent costly failures
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="h-14 px-10 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity shadow-xl"
              >
                Get Started Now
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="text-center text-muted-foreground">
          <p>© 2025 Machine Health Assessment. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
