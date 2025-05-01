"use client";

import { Button } from "@/shadcn/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/shadcn/components/ui/form";
import { Input } from "@/shadcn/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shadcn/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Defining the expected props
interface SpotifyInputProps {
  onSubmit: (value: string) => void;
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

// Create a discriminated union schema
const formSchema = z.discriminatedUnion("searchType", [
  // URL schema
  z.object({
    searchType: z.literal("URL"),
    value: z.string().url().includes("spotify.com/track", {
      message: "Invalid Spotify URL. Please enter a valid Spotify track URL.",
    }),
  }),

  // ID schema
  z.object({
    searchType: z.literal("ID"),
    value: z.string().min(20, {
      message: "Invalid Spotify ID. Please enter a valid Spotify track ID.",
    }),
  }),

  // Song name schema
  z.object({
    searchType: z.literal("songName"),
    value: z.string().min(2, {
      message: "Song name must be at least 2 characters.",
    }),
  }),
]);

type FormValues = z.infer<typeof formSchema>;

// Main component
export default function SpotifyInput({ loading, onSubmit }: SpotifyInputProps) {
  // Defining the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchType: "URL",
      value: "",
    },
  });

  // Reset validation when search type changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "searchType") {
        form.resetField("value", { keepError: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Submit handler - process based on type
  function handleSubmit(data: FormValues) {
    onSubmit(data.value);
    // alert(`You submitted a Spotify ${data.searchType} that says : ${data.value}`);
  }

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
                    <SelectItem
                      key={key}
                      value={key}
                    >
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
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
