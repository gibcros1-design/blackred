"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Testimonial {
  name: string;
  quote: string;
  robux?: number;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;

  const item = items[index];
  const move = (step: number) => setIndex((current) => (current + step + items.length) % items.length);

  return (
    <section className="border-t border-border py-14 sm:py-16" aria-label="Ulasan pelanggan">
      <div className="mx-auto max-w-4xl px-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dari pelanggan</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Pengalaman setelah transaksi</h2>
          </div>
          {items.length > 1 && (
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="icon" aria-label="Ulasan sebelumnya" onClick={() => move(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" aria-label="Ulasan berikutnya" onClick={() => move(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <Card className="mt-6">
          <CardContent className="p-6 sm:p-8">
            <div className="flex gap-1 text-destructive" aria-label="5 dari 5 bintang">
              {Array.from({ length: 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden="true" />)}
            </div>
            <blockquote className="mt-4 max-w-3xl text-lg leading-8 sm:text-xl">“{item.quote}”</blockquote>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold">{item.name}</span>
              {item.robux ? <span className="text-muted-foreground">· {item.robux.toLocaleString("id-ID")} Robux</span> : null}
            </div>
            {items.length > 1 && (
              <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">{index + 1} dari {items.length}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
