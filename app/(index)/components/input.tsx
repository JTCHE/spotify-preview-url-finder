"use client";

import { Button } from "@/shadcn/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Defining the expected props
interface SpotifyInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

// Defining the form's schema
const formSchema = z.object({
  url: z.string().url().includes("spotify.com/track", {
    message: "Invalid Spotify URL. Please enter a valid Spotify track URL.",
  }),
});

// Main component
export default function SpotifyInput({ loading, onSubmit }: SpotifyInputProps) {
  // A. Defining the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  // B. Defining a submit handler
  function handleSubmit({ url }: { url: string }) {
    console.log(url);
    if (url.includes("spotify.com/track/")) {
      onSubmit(url);
    } else {
      alert("Invalid Spotify URL. Please enter a valid Spotify track URL.");
    }
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="https://spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={!form.watch("url").includes('spotify.com/track') || loading} type="submit" className="w-full">
            {loading ? "Loading…" : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
