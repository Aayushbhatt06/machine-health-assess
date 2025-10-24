import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Activity, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface MachineData {
  type: string;
  airTemp: string;
  processTemp: string;
  rotationalSpeed: string;
  torque: string;
  toolWear: string;
}

interface PredictionResult {
  machine_failure: number;
  failure_types?: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<MachineData>({
    type: "",
    airTemp: "",
    processTemp: "",
    rotationalSpeed: "",
    torque: "",
    toolWear: "",
  });

  const convertMachineType = (type: string) => {
    switch (type) {
      case "L":
        return { Type_L: true, Type_M: false };
      case "M":
        return { Type_L: false, Type_M: true };
      case "H":
        return { Type_L: false, Type_M: false };
      default:
        return { Type_L: false, Type_M: false };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.airTemp || !formData.processTemp || 
        !formData.rotationalSpeed || !formData.torque || !formData.toolWear) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to assess your machine.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setPredictionResult(null);

    try {
      const { Type_L, Type_M } = convertMachineType(formData.type);
      
      const payload = {
        Air_temp: parseFloat(formData.airTemp),
        Process_temp: parseFloat(formData.processTemp),
        Rotational_speed: parseFloat(formData.rotationalSpeed),
        Torque: parseFloat(formData.torque),
        Tool_wear: parseFloat(formData.toolWear),
        Type_L: Type_L,
        Type_M: Type_M,
      };

      console.log("Sending payload:", payload);

      const response = await axios.post<PredictionResult>(
        "http://43.205.138.157:8000/predict",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Prediction result:", response.data);
      setPredictionResult(response.data);

      if (response.data.machine_failure === 0) {
        toast({
          title: "✅ Machine Healthy",
          description: "No failure detected. Your machine is operating normally.",
        });
      } else {
        toast({
          title: "⚠️ Failure Detected",
          description: `Potential failure types: ${response.data.failure_types?.join(", ") || "Unknown"}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error calling prediction API:", error);
      toast({
        title: "Error",
        description: "Failed to analyze machine data. Please ensure the API server is running on http://localhost:8000",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof MachineData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Machine Health Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Enter your machine parameters for detailed health analysis
            </p>
          </div>

          {/* Prediction Result Card */}
          {predictionResult && (
            <Card className={`mb-6 border-2 ${predictionResult.machine_failure === 0 ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {predictionResult.machine_failure === 0 ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-green-700">Machine Health: Normal</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600" />
                      <span className="text-red-700">Machine Health: Failure Detected</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictionResult.machine_failure === 1 && predictionResult.failure_types && (
                  <div className="space-y-2">
                    <p className="font-semibold text-red-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Detected Failure Types:
                    </p>
                    <ul className="list-disc list-inside text-red-600 ml-4">
                      {predictionResult.failure_types.map((type, index) => (
                        <li key={index}>{type}</li>
                      ))}
                    </ul>
                    <p className="text-sm text-muted-foreground mt-4">
                      <strong>Failure Type Codes:</strong><br />
                      TWF - Tool Wear Failure | HDF - Heat Dissipation Failure | 
                      PWF - Power Failure | OSF - Overstrain Failure | RNF - Random Failure
                    </p>
                  </div>
                )}
                {predictionResult.machine_failure === 0 && (
                  <p className="text-green-700">
                    All parameters are within normal operating range. Continue regular maintenance schedule.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="border-2 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl">Machine Details</CardTitle>
              <CardDescription>
                Provide accurate measurements for the best assessment results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-base font-semibold">
                      Machine Type
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger id="type" className="h-12">
                        <SelectValue placeholder="Select machine type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low Power (L)</SelectItem>
                        <SelectItem value="M">Medium Power (M)</SelectItem>
                        <SelectItem value="H">High Power (H)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="airTemp" className="text-base font-semibold">
                      Air Temperature (°C)
                    </Label>
                    <Input
                      id="airTemp"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 25.5"
                      value={formData.airTemp}
                      onChange={(e) => handleInputChange("airTemp", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processTemp" className="text-base font-semibold">
                      Process Temperature (°C)
                    </Label>
                    <Input
                      id="processTemp"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 75.3"
                      value={formData.processTemp}
                      onChange={(e) => handleInputChange("processTemp", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rotationalSpeed" className="text-base font-semibold">
                      Rotational Speed (RPM)
                    </Label>
                    <Input
                      id="rotationalSpeed"
                      type="number"
                      placeholder="e.g., 1500"
                      value={formData.rotationalSpeed}
                      onChange={(e) => handleInputChange("rotationalSpeed", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="torque" className="text-base font-semibold">
                      Torque (Nm)
                    </Label>
                    <Input
                      id="torque"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 42.8"
                      value={formData.torque}
                      onChange={(e) => handleInputChange("torque", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toolWear" className="text-base font-semibold">
                      Tool Wear (minutes)
                    </Label>
                    <Input
                      id="toolWear"
                      type="number"
                      placeholder="e.g., 120"
                      value={formData.toolWear}
                      onChange={(e) => handleInputChange("toolWear", e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                  >
                    {isLoading ? "Analyzing..." : "Analyze Machine Health"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quick Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Regular monitoring helps prevent unexpected failures
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Use calibrated sensors for best results
                </p>
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Schedule checks based on tool wear patterns
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;