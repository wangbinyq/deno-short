import { useState } from "preact/hooks";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={copyToClipboard}
      class="ml-2 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}