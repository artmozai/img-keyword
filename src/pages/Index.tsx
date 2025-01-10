import React, { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Results } from "@/components/Results";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
      // TODO: Implement Gemini API integration
      // For now, we'll simulate the API call with 50 keywords
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResults({
        title: "A beautiful sunset over the mountains with vibrant colors",
        keywords: [
          "sunset", "mountains", "nature", "landscape", "orange sky",
          "peaceful", "serene", "dusk", "twilight", "scenic",
          "panorama", "outdoor", "wilderness", "tranquil", "majestic",
          "peaks", "silhouette", "horizon", "evening", "dramatic",
          "colorful", "atmospheric", "picturesque", "vista", "alpine",
          "mountainscape", "natural beauty", "skyline", "golden hour", "ridge",
          "mountain range", "outdoor photography", "scenic view", "panoramic", "mountainous",
          "natural landscape", "mountain peak", "sunset colors", "mountain view", "sunset sky",
          "mountain scenery", "sunset glow", "mountain sunset", "nature photography", "landscape photography",
          "sunset scene", "mountain landscape", "scenic sunset", "natural wonder", "sunset vista"
        ],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate results. Please try again.",
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