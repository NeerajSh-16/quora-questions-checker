// Huffman Coding Algorithm Implementation

export interface HuffmanNode {
  char: string | null;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;
}

export interface HuffmanResult {
  frequencies: Record<string, number>;
  codes: Record<string, string>;
  encoded: string;
  decoded: string;
  compressionRatio: number;
  originalSize: number;
  compressedSize: number;
}

class MinHeap {
  private heap: HuffmanNode[] = [];

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  private heapifyUp(index: number): void {
    if (index === 0) return;
    
    const parentIndex = this.getParentIndex(index);
    if (this.heap[parentIndex].freq > this.heap[index].freq) {
      this.swap(parentIndex, index);
      this.heapifyUp(parentIndex);
    }
  }

  private heapifyDown(index: number): void {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallest = index;

    if (leftChildIndex < this.heap.length && 
        this.heap[leftChildIndex].freq < this.heap[smallest].freq) {
      smallest = leftChildIndex;
    }

    if (rightChildIndex < this.heap.length && 
        this.heap[rightChildIndex].freq < this.heap[smallest].freq) {
      smallest = rightChildIndex;
    }

    if (smallest !== index) {
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }

  insert(node: HuffmanNode): void {
    this.heap.push(node);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin(): HuffmanNode | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return min;
  }

  size(): number {
    return this.heap.length;
  }
}

function createNode(char: string | null, freq: number, left: HuffmanNode | null = null, right: HuffmanNode | null = null): HuffmanNode {
  return { char, freq, left, right };
}

function calculateFrequencies(text: string): Record<string, number> {
  const frequencies: Record<string, number> = {};
  for (const char of text) {
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  return frequencies;
}

function buildHuffmanTree(frequencies: Record<string, number>): HuffmanNode | null {
  const heap = new MinHeap();

  // Create leaf nodes for each character
  for (const [char, freq] of Object.entries(frequencies)) {
    heap.insert(createNode(char, freq));
  }

  // Handle edge case of single character
  if (heap.size() === 1) {
    const node = heap.extractMin()!;
    return createNode(null, node.freq, node, null);
  }

  // Build the tree
  while (heap.size() > 1) {
    const left = heap.extractMin()!;
    const right = heap.extractMin()!;
    const merged = createNode(null, left.freq + right.freq, left, right);
    heap.insert(merged);
  }

  return heap.extractMin();
}

function generateCodes(root: HuffmanNode | null, code: string = "", codes: Record<string, string> = {}): Record<string, string> {
  if (!root) return codes;

  // Leaf node
  if (root.char !== null) {
    codes[root.char] = code || "0"; // Handle single character case
    return codes;
  }

  generateCodes(root.left, code + "0", codes);
  generateCodes(root.right, code + "1", codes);
  
  return codes;
}

function encodeText(text: string, codes: Record<string, string>): string {
  return text.split('').map(char => codes[char]).join('');
}

function decodeText(encoded: string, root: HuffmanNode | null): string {
  if (!root) return "";
  if (!encoded) return "";

  let decoded = "";
  let current = root;
  
  for (const bit of encoded) {
    if (current.char !== null) {
      decoded += current.char;
      current = root;
    }
    
    if (bit === "0") {
      current = current.left!;
    } else {
      current = current.right!;
    }
  }
  
  // Add the last character
  if (current.char !== null) {
    decoded += current.char;
  }
  
  return decoded;
}

export function huffmanEncode(text: string): HuffmanResult {
  if (!text) {
    return {
      frequencies: {},
      codes: {},
      encoded: "",
      decoded: "",
      compressionRatio: 0,
      originalSize: 0,
      compressedSize: 0
    };
  }

  // Calculate character frequencies
  const frequencies = calculateFrequencies(text);
  
  // Build Huffman tree
  const root = buildHuffmanTree(frequencies);
  
  // Generate Huffman codes
  const codes = generateCodes(root);
  
  // Encode the text
  const encoded = encodeText(text, codes);
  
  // Decode to verify
  const decoded = decodeText(encoded, root);
  
  // Calculate compression metrics
  const originalSize = text.length * 8; // assuming 8 bits per character
  const compressedSize = encoded.length;
  const compressionRatio = originalSize > 0 ? (compressedSize / originalSize) * 100 : 0;
  
  return {
    frequencies,
    codes,
    encoded,
    decoded,
    compressionRatio,
    originalSize,
    compressedSize
  };
}