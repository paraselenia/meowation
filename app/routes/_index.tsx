import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [{ title: "meowation" }];

export default function Index() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">meowation</h1>
    </main>
  );
}
