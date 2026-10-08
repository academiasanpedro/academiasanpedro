"use client";

// Pestañas: Evaluador de alumnos / Constructor del test

import { useState } from "react";
import { ClipboardCheck, PenTool } from "lucide-react";
import type { LevelTestData } from "@/lib/level-test";
import { cn } from "@/lib/utils";
import TestBuilder from "./TestBuilder";
import TestEvaluator, { type AdminTest } from "./TestEvaluator";

type Tab = "evaluator" | "builder";

export default function TestsManager({
  tests,
  testData,
  initialTab,
}: {
  tests: AdminTest[];
  testData: LevelTestData;
  initialTab: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const pending = tests.filter((test) => test.status === "pending_review").length;

  const tabs = [
    { id: "evaluator" as const, label: "Evaluador", icon: ClipboardCheck, badge: pending },
    { id: "builder" as const, label: "Constructor del test", icon: PenTool, badge: 0 },
  ];

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Gestión de tests" className="inline-flex rounded-2xl bg-neutral-100 p-1">
        {tabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition",
              tab === id ? "bg-white text-primary shadow-sm" : "text-neutral-500 hover:text-neutral-800"
            )}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
            {badge > 0 && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-white">{badge}</span>}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {tab === "evaluator" ? <TestEvaluator tests={tests} testData={testData} /> : <TestBuilder testData={testData} />}
      </div>
    </div>
  );
}
