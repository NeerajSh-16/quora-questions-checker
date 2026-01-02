import { HuffmanEncoder } from "@/components/huffman-encoder";
import { ThemeToggle } from "@/components/theme-toggle";
import { Binary, Zap, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Binary className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Huffman Encoder
                </h1>
                <p className="text-sm text-muted-foreground">
                  Modern compression visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80"
                onClick={() => window.open('https://github.com', '_blank')}
              >
                <Github className="w-4 h-4 mr-2" />
                Source
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Data Compression Algorithm</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Huffman Coding
            <span className="block text-transparent bg-gradient-primary bg-clip-text">
              Made Beautiful
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Visualize and understand Huffman coding with this modern, interactive tool. 
            Enter your text and watch the compression algorithm work its magic.
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              "Real-time Encoding",
              "Character Frequency Analysis", 
              "Compression Statistics",
              "Binary Visualization",
              "Dark/Light Theme"
            ].map((feature) => (
              <div 
                key={feature}
                className="px-3 py-1 bg-muted/30 border border-border/50 rounded-full text-sm text-muted-foreground"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Huffman Encoder Component */}
        <div className="max-w-5xl mx-auto">
          <HuffmanEncoder />
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border/50">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Built with modern web technologies • Huffman coding algorithm implementation
            </p>
            <p className="mt-2">
              Created with ❤️ for learning and exploration
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
