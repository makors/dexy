"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { invoke } from '@tauri-apps/api/tauri';
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(100),
});

export function SetupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();

  function onSubmit(values: z.infer<typeof formSchema>) {
    invoke<boolean>('setup_dexcom_client', { username: values.username, password: values.password })
        .then((s) => {
            if (!s) alert('your username or password is incorrect! (or tauri errored out)');
            else if (s) router.push('/readings');
        });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 mx-16">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dexcom Username</FormLabel>
              <FormControl>
                <Input placeholder="myusername" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dexcom Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sup3rSecr3tP@ssw0rd!"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Dexy only works with Dexcom accounts inside the US.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
