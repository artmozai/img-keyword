import React, { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Results } from "@/components/Results";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    title: string;
    keywords: string[];
  } | null>(null);
  const { toast } = useToast();

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

    setIsLoading(true);
    try {
      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(localStorage.getItem("GEMINI_API_KEY") || "");
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
      const cleanTitle = title.replace(/^(Title:|1\.|[0-9]\.)\s*/i, "").trim();
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-4xl py-12 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Image Analysis AI
          </h1>
          <p className="text-gray-600">
            Upload an image to generate a title and 50 keywords using AI
          </p>
        </div>

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

        {results && <Results title={results.title} keywords={results.keywords} />}
      </div>
    </div>
  );
};

export default Index;