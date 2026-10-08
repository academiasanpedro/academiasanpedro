import type { ReactNode } from "react";

export default function AuthHeading({ title, description }: { title: string; description: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
      <p className="mt-3 text-base font-medium text-neutral-500">{description}</p>
    </div>
  );
}
