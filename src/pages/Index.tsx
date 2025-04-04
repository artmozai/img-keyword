import React, { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Results } from "@/components/Results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [results, setResults] = useState<{
    title: string;
    keywords: string[];
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedApiKey = localStorage.getItem("GEMINI_API_KEY");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    localStorage.setItem("GEMINI_API_KEY", newApiKey);
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResults(null);
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey) {
      toast({
        title: "No API Key",
        description: "Please enter your Gemini API key",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Convert image to base64
      const imageData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedImage);
      });

      // Prepare the image data for the API
      const imageParts = [
        {
          inlineData: {
            data: imageData.split(",")[1],
            mimeType: selectedImage.type,
          },
        },
      ];

      // Generate content from the image
      const result = await model.generateContent([
        "Analyze this image and provide: 1. A descriptive title (about 10-15 words) 2. Generate exactly 50 relevant keywords or short phrases, separated by commas. Focus on visual elements, mood, style, and subject matter.",
        ...imageParts,
      ]);
      const response = await result.response;
      const text = response.text();

      // Parse the response
      const [title, keywordsText] = text.split("\n\n");
      const cleanTitle = title
        .replace(/^(Title:|1\.|[0-9]\.)\s*/i, "")
        .replace(/\*\*/g, "")
        .trim();
      const keywords = keywordsText
        .replace(/^(Keywords:|2\.|[0-9]\.)\s*/i, "")
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k)
        .slice(0, 50);

      setResults({
        title: cleanTitle,
        keywords: keywords,
      });
    } catch (error) {
      console.error("Error generating results:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate results. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background transition-colors duration-300 pt-16">
        <div className="container max-w-7xl py-12">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Image Analysis AI
            </h1>
            <p className="text-muted-foreground">
              Upload an image to generate a title and 50 keywords using AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <ImageUpload onImageSelect={handleImageSelect} isLoading={isLoading} />
              <div className="flex justify-center">
                <Button
                  onClick={handleGenerate}
                  disabled={!selectedImage || isLoading}
                  className="w-full max-w-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Title & Keywords"
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    Gemini API Key
                  </label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    placeholder="Enter your Gemini API key"
                    className="w-full"
                  />
                  <a
                    href="https://aistudio.google.com/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline block mt-1"
                  >
                    Get your Gemini API key here
                  </a>
                </div>
              </div>
              {results && <Results title={results.title} keywords={results.keywords} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
