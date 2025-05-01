"use client";

import { Button } from "@/shadcn/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Defining the expected props
interface SpotifyInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

const searchTypes = {
  URL: {
    name: "URL",
    exampleString: "https://spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ",
  },
  ID: {
    name: "ID",
    exampleString: "7eqoqGkKwgOaWNNHx90uEZ",
  },
  songName: {
    name: "Song Name",
    exampleString: "Nights - Frank Ocean",
  },
};

// Defining the form's schema
const formSchema = z.object({
  searchType: z.string(),
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
      searchType: Object.keys(searchTypes)[0],
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

  const [isReady, setIsReady] = useState(false); //State to know whether the form can be submitted or not, depending on the search type

  return (
    <Form {...form}>
      <form
        className="space-y-4 w-full"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* <FormField
          control={form.control}
          name="searchType"
          render={({ field }) => (
            <FormItem>
              <Select
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(searchTypes).map(([key, value]) => (
                    <SelectItem value={key}>{value.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        ></FormField> */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  // onChange={() => watchForm(form.watch("url"))}
                  placeholder={searchTypes[form.watch("searchType") as keyof typeof searchTypes].exampleString}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
        >
          {loading ? "Loading…" : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
