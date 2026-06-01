"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { X, Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatINR } from "@/lib/utils/format";
import {
  addImageTag,
  deleteImageTag,
  type ImageProductTagDTO,
} from "@/lib/actions/image-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PLACEHOLDER = "/placeholder-item.svg";

export type { ImageProductTagDTO };

interface TaggedImageProps {
  src: string;
  alt: string;
  imageIndex?: number;
  tags: ImageProductTagDTO[];
  flexItemId?: string;
  editable?: boolean;
  className?: string;
  aspectClassName?: string;
  sizes?: string;
  onTagsChange?: (tags: ImageProductTagDTO[]) => void;
  showTagHint?: boolean;
}

export function TaggedImage({
  src,
  alt,
  imageIndex = 0,
  tags,
  flexItemId,
  editable = false,
  className,
  aspectClassName = "aspect-[4/3]",
  sizes = "672px",
  onTagsChange,
  showTagHint = true,
}: TaggedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(null);
  const [newName, setNewName] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [newValue, setNewValue] = useState("");
  const [localTags, setLocalTags] = useState(tags);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  const imageTags = localTags.filter((t) => t.imageIndex === imageIndex);
  const activeTag = imageTags.find((t) => t.id === activeTagId);

  const syncTags = useCallback(
    (next: ImageProductTagDTO[]) => {
      setLocalTags(next);
      onTagsChange?.(next);
    },
    [onTagsChange]
  );

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editable || !flexItemId) return;
    if ((e.target as HTMLElement).closest("[data-tag-marker]")) return;
    if ((e.target as HTMLElement).closest("[data-tag-panel]")) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

    setActiveTagId(null);
    setPendingPos({ x, y });
    setIsAdding(true);
    setNewName("");
    setNewBrand("");
    setNewValue("");
  };

  const handleSaveTag = () => {
    if (!flexItemId || !pendingPos || !newName.trim()) {
      toast.error("Enter a product name");
      return;
    }

    startTransition(async () => {
      const result = await addImageTag({
        flexItemId,
        imageIndex,
        x: pendingPos.x,
        y: pendingPos.y,
        name: newName.trim(),
        brand: newBrand.trim() || undefined,
        estimatedValue: newValue ? parseFloat(newValue) : undefined,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.tag) {
        const next = [...localTags, result.tag];
        syncTags(next);
        setActiveTagId(result.tag.id);
      }
      setIsAdding(false);
      setPendingPos(null);
      toast.success("Product tagged");
    });
  };

  const handleDeleteTag = (tagId: string) => {
    startTransition(async () => {
      const result = await deleteImageTag(tagId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      const next = localTags.filter((t) => t.id !== tagId);
      syncTags(next);
      setActiveTagId(null);
      toast.success("Tag removed");
    });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className={cn(
          "relative bg-muted border-b-[3px] border-ink overflow-hidden",
          aspectClassName,
          editable && "cursor-crosshair"
        )}
        onClick={handleImageClick}
        role={editable ? "button" : undefined}
        aria-label={editable ? "Tap on the image to tag a product" : undefined}
      >
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className="object-cover pointer-events-none select-none"
          sizes={sizes}
          onError={() => setImgSrc(PLACEHOLDER)}
        />

        {imageTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            data-tag-marker
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
            style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAdding(false);
              setPendingPos(null);
              setActiveTagId((id) => (id === tag.id ? null : tag.id));
            }}
            aria-label={`Tag: ${tag.name}`}
          >
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full neo-border shadow-neo-sm transition-transform",
                activeTagId === tag.id
                  ? "bg-primary scale-125"
                  : "bg-card hover:scale-110"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-ink" />
            </span>
          </button>
        ))}

        {isAdding && pendingPos && (
          <span
            className="absolute z-20 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent neo-border shadow-neo animate-pulse pointer-events-none"
            style={{ left: `${pendingPos.x}%`, top: `${pendingPos.y}%` }}
          />
        )}

        {showTagHint && imageTags.length > 0 && !editable && !activeTagId && (
          <div className="absolute bottom-3 left-3 z-10 neo-sticker bg-card/95 text-[10px] flex items-center gap-1 pointer-events-none">
            <Tag className="h-3 w-3" />
            Tap a dot for product info
          </div>
        )}

        {editable && imageTags.length === 0 && !isAdding && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <span className="neo-sticker bg-primary text-[10px] flex items-center gap-1">
              <Plus className="h-3 w-3" />
              Tap to tag products
            </span>
          </div>
        )}
      </div>

      {activeTag && !isAdding && (
        <div
          data-tag-panel
          className="border-t-[3px] border-ink bg-secondary/30 px-4 py-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-black text-sm leading-tight">{activeTag.name}</p>
              {activeTag.brand && (
                <p className="text-xs font-bold text-muted-foreground">{activeTag.brand}</p>
              )}
              {activeTag.estimatedValue != null && activeTag.estimatedValue > 0 && (
                <p className="text-xs font-black text-primary mt-1">
                  {formatINR(activeTag.estimatedValue)}
                </p>
              )}
            </div>
            <div className="flex gap-1 shrink-0">
              {editable && (
                <button
                  type="button"
                  onClick={() => handleDeleteTag(activeTag.id)}
                  disabled={isPending}
                  className="neo-btn bg-card rounded-md h-8 w-8 p-0"
                  aria-label="Remove tag"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTagId(null)}
                className="neo-chip rounded-md text-xs py-1 px-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && pendingPos && (
        <div
          data-tag-panel
          className="mt-3 neo-card rounded-md p-4 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-black uppercase tracking-wide">New product tag</p>
          <Input
            placeholder="Product name *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <Input
            placeholder="Brand (optional)"
            value={newBrand}
            onChange={(e) => setNewBrand(e.target.value)}
          />
          <Input
            placeholder="Value in ₹ (optional)"
            type="number"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              className="flex-1"
              disabled={isPending}
              onClick={handleSaveTag}
            >
              Save tag
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                setIsAdding(false);
                setPendingPos(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {editable && imageTags.length > 0 && !isAdding && (
        <p className="text-[10px] font-bold text-muted-foreground mt-2 flex items-center gap-1">
          <Plus className="h-3 w-3" />
          Tap anywhere on the image to add another tag
        </p>
      )}
    </div>
  );
}
