import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsProps {
  title: string;
  keywords: string[];
}

export const Results = ({ title, keywords }: ResultsProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Generated Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Title</h3>
          <p className="text-lg">{title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};