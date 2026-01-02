import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, Play, RotateCcw } from "lucide-react";
import { huffmanEncode, HuffmanResult } from "@/lib/huffman";
import { useToast } from "@/hooks/use-toast";

const defaultText = "Huffman coding is a data compression algorithm.";

export function HuffmanEncoder() {
  const [inputText, setInputText] = useState(defaultText);
  const [result, setResult] = useState<HuffmanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to encode.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Add a small delay to show the processing state
    setTimeout(() => {
      try {
        const encoded = huffmanEncode(inputText);
        setResult(encoded);
        toast({
          title: "Encoding successful!",
          description: `Compression ratio: ${encoded.compressionRatio.toFixed(1)}%`,
        });
      } catch (error) {
        toast({
          title: "Encoding failed",
          description: "An error occurred while processing your text.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const reset = () => {
    setInputText(defaultText);
    setResult(null);
  };

  // Auto-process on component mount
  useEffect(() => {
    processText();
  }, []);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-gradient-secondary border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Input Text
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              Characters: {inputText.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Enter the text you want to compress using Huffman coding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className="min-h-[120px] bg-muted/30 border-border/50 font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button 
              onClick={processText} 
              disabled={isProcessing}
              className="bg-gradient-primary shadow-primary"
            >
              <Play className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Encode Text"}
            </Button>
            <Button onClick={reset} variant="outline" className="border-border/50">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Statistics Section */}
          <Card className="bg-gradient-secondary border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Compression Statistics</CardTitle>
              <CardDescription>
                Analysis of the compression efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{result.originalSize}</div>
                  <div className="text-sm text-muted-foreground">Original Size (bits)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">{result.compressedSize}</div>
                  <div className="text-sm text-muted-foreground">Compressed Size (bits)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">{result.compressionRatio.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Compression Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{(100 - result.compressionRatio).toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Space Saved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Frequencies */}
          <Card className="bg-gradient-secondary border-border/50 shadow-card">
            <CardHeader>
              <CardTitle>Character Frequencies</CardTitle>
              <CardDescription>
                How often each character appears in the input text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Object.entries(result.frequencies)
                  .sort(([,a], [,b]) => b - a)
                  .map(([char, freq]) => (
                    <div key={char} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <span className="font-mono text-sm">
                        {char === ' ' ? '⎵' : char}
                      </span>
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {freq}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Huffman Codes */}
          <Card className="bg-gradient-secondary border-border/50 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Huffman Codes</CardTitle>
                  <CardDescription>
                    Binary codes assigned to each character
                  </CardDescription>
                </div>
                <Button
                  onClick={() => copyToClipboard(
                    Object.entries(result.codes)
                      .map(([char, code]) => `${char === ' ' ? 'SPACE' : char}: ${code}`)
                      .join('\n'),
                    "Huffman codes"
                  )}
                  variant="outline"
                  size="sm"
                  className="border-border/50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {Object.entries(result.codes)
                  .sort(([,a], [,b]) => a.length - b.length || a.localeCompare(b))
                  .map(([char, code]) => (
                    <div key={char} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="font-mono text-sm font-medium">
                        {char === ' ' ? '⎵' : char}
                      </span>
                      <code className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                        {code}
                      </code>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Encoded Result */}
          <Card className="bg-gradient-secondary border-border/50 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Encoded Binary String</CardTitle>
                  <CardDescription>
                    Your text converted to binary using Huffman codes
                  </CardDescription>
                </div>
                <Button
                  onClick={() => copyToClipboard(result.encoded, "Encoded string")}
                  variant="outline"
                  size="sm"
                  className="border-border/50"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <code className="font-mono text-xs break-all text-success">
                  {result.encoded}
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Decoded Result */}
          <Card className="bg-gradient-secondary border-border/50 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Decoded Text</CardTitle>
                  <CardDescription>
                    Verification that decoding works correctly
                  </CardDescription>
                </div>
                <Badge 
                  variant={result.decoded === inputText ? "default" : "destructive"}
                  className={result.decoded === inputText ? "bg-success text-success-foreground" : ""}
                >
                  {result.decoded === inputText ? "✓ Match" : "✗ Mismatch"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <p className="font-mono text-sm whitespace-pre-wrap">
                  {result.decoded}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}