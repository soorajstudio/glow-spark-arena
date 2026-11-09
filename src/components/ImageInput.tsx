import { useState, useRef } from "react";
import { Upload, Link, X, Image as ImageIcon } from "lucide-react";

interface ImageInputProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  label?: string;
  placeholder?: string;
}

export const ImageInput = ({ value, onChange, label, placeholder = "Paste image URL or upload..." }: ImageInputProps) => {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, SVG, WebP, GIF).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-foreground/90">{label}</label>}

      {value ? (
        <div className="relative inline-block overflow-hidden rounded-xl border border-primary/40 bg-card/80 p-1">
          <img
            src={value}
            alt="Preview"
            className="h-28 w-44 rounded-lg object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=60";
            }}
          />
          <button
            type="button"
            onClick={() => {
              onChange(undefined);
              setUrlInput("");
            }}
            className="absolute top-2 right-2 rounded-full bg-destructive/90 p-1 text-white shadow-md hover:bg-destructive"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card/50 p-3">
          <div className="mb-2 flex gap-2 border-b border-border/50 pb-2">
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === "upload" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Upload size={13} />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setTab("url")}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                tab === "url" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Link size={13} />
              Image URL
            </button>
          </div>

          {tab === "upload" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 py-3 text-sm font-medium text-primary transition-all hover:bg-primary/10"
              >
                <ImageIcon size={18} />
                Click to browse device image
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="rounded-lg bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/30"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
