import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsProps {
  title: string;
  keywords: string[];
}

export const Results = ({ title, keywords }: ResultsProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: "title" | "keywords") => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type === "title" ? "Title" : "Keywords"} copied to clipboard`,
      });
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Generated Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Title</h3>
            <p className="text-lg">{title}</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(title, "title")}
            className="shrink-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Keywords</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(keywords.join(", "), "keywords")}
              className="h-8"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => copyToClipboard(keyword, "keywords")}
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};