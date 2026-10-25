import React from "react";
import { CommandBlock } from "./CommandBlock";
import { ExpectedOutput } from "./ExpectedOutput";
import { GuideStep } from "./GuideStep";
import { PrerequisitesPanel } from "./PrerequisitesPanel";
import { TroubleshootingSection, TroubleshootingItem } from "./TroubleshootingSection";
import { TocItem } from "./GuideTableOfContents";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractTocFromMarkdown(content: string): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      const title = trimmed.replace(/^##\s+/, "");
      items.push({
        id: slugify(title),
        title,
        level: 2,
      });
    } else if (trimmed.startsWith("### ")) {
      const title = trimmed.replace(/^###\s+/, "");
      items.push({
        id: slugify(title),
        title,
        level: 3,
      });
    }
  }

  return items;
}

export function renderInlineMarkdown(text: string): React.ReactNode[] {
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700/60"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

interface Block {
  type: "code" | "paragraph" | "list";
  content: string;
  lang?: string;
  items?: string[];
}

function parseBlocks(rawText: string): Block[] {
  const blocks: Block[] = [];
  const lines = rawText.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Code block check
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim() || "bash";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({
        type: "code",
        content: codeLines.join("\n"),
        lang,
      });
      continue;
    }

    // Unordered or Ordered list check
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith("- ") ||
          lines[i].trim().startsWith("* ") ||
          /^\d+\.\s/.test(lines[i].trim()))
      ) {
        const itemText = lines[i]
          .trim()
          .replace(/^[-*]\s+/, "")
          .replace(/^\d+\.\s+/, "");
        listItems.push(itemText);
        i++;
      }
      blocks.push({
        type: "list",
        content: "",
        items: listItems,
      });
      continue;
    }

    // Regular paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("* ") &&
      !/^\d+\.\s/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("#")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: "paragraph",
        content: paraLines.join(" "),
      });
    }
  }

  return blocks;
}

export interface GuideContentRendererProps {
  content: string;
}

export function GuideContentRenderer({ content }: GuideContentRendererProps) {
  // Split sections by lines starting with "## "
  const rawSections = content.split(/\n(?=##\s+)/);

  return (
    <div className="space-y-8 leading-relaxed">
      {rawSections.map((sectionStr, index) => {
        const lines = sectionStr.trim().split("\n");
        const firstLine = lines[0].trim();

        if (firstLine.startsWith("# ") && !firstLine.startsWith("## ")) {
          // Top title, can skip or show introduction
          const bodyText = lines.slice(1).join("\n");
          const blocks = parseBlocks(bodyText);

          return (
            <div key={`header-${index}`} className="mb-6">
              {blocks.map((b, bIdx) => (
                <div key={bIdx} className="my-3 text-slate-300 text-sm sm:text-base">
                  {b.type === "paragraph" && <p>{renderInlineMarkdown(b.content)}</p>}
                </div>
              ))}
            </div>
          );
        }

        if (firstLine.startsWith("## ")) {
          const headingTitle = firstLine.replace(/^##\s+/, "");
          const sectionId = slugify(headingTitle);
          const bodyText = lines.slice(1).join("\n");

          // 1. Prerequisites Section
          if (headingTitle.toLowerCase().includes("prerequisite")) {
            const blocks = parseBlocks(bodyText);
            const bulletItems: string[] = [];
            for (const b of blocks) {
              if (b.items) bulletItems.push(...b.items);
              else if (b.type === "paragraph") bulletItems.push(b.content);
            }
            return (
              <div key={sectionId} id={sectionId} className="scroll-mt-24">
                <PrerequisitesPanel items={bulletItems} />
              </div>
            );
          }

          // 2. Expected Output Section
          if (headingTitle.toLowerCase().includes("expected output")) {
            const blocks = parseBlocks(bodyText);
            const codeBlock = blocks.find((b) => b.type === "code");
            return (
              <div key={sectionId} id={sectionId} className="scroll-mt-24">
                <ExpectedOutput
                  output={codeBlock ? codeBlock.content : bodyText}
                  title={headingTitle}
                />
              </div>
            );
          }

          // 3. Troubleshooting Section
          if (headingTitle.toLowerCase().includes("troubleshoot")) {
            // Split by ### Problem
            const troubleParts = bodyText.split(/\n(?=###\s+)/);
            const items: TroubleshootingItem[] = [];

            for (const part of troubleParts) {
              const pLines = part.trim().split("\n");
              if (pLines[0].trim().startsWith("### ")) {
                const problem = pLines[0].trim().replace(/^###\s+/, "");
                const solution = pLines.slice(1).join("\n").trim();
                items.push({
                  problem,
                  solution,
                });
              } else if (part.trim()) {
                items.push({
                  problem: "Common Configuration Issue",
                  solution: part.trim(),
                });
              }
            }

            return (
              <div key={sectionId} id={sectionId} className="scroll-mt-24">
                <TroubleshootingSection items={items} />
              </div>
            );
          }

          // 4. Numbered Steps Section (e.g., Step 1: Create JWT Secret)
          const stepMatch = headingTitle.match(/Step\s+(\d+)[:\s]+(.+)/i);
          if (stepMatch) {
            const stepNum = parseInt(stepMatch[1], 10);
            const stepTitle = stepMatch[2];
            const blocks = parseBlocks(bodyText);

            return (
              <GuideStep
                key={sectionId}
                id={sectionId}
                stepNumber={stepNum}
                title={stepTitle}
              >
                {blocks.map((b, bIdx) => {
                  if (b.type === "code") {
                    const isElevated =
                      b.content.includes("sudo ") ||
                      b.content.includes("chown") ||
                      b.content.includes("chmod") ||
                      b.content.includes("sysctl");
                    const isDestructive =
                      b.content.includes("rm -rf") ||
                      b.content.includes("prune") ||
                      b.content.includes("drop") ||
                      b.content.includes("delete") ||
                      b.content.includes("format");
                    const isPowerShell =
                      b.lang === "powershell" ||
                      b.content.includes("Get-") ||
                      b.content.includes("Set-");

                    return (
                      <CommandBlock
                        key={bIdx}
                        command={b.content}
                        language={
                          isPowerShell
                            ? "powershell"
                            : (b.lang as "bash" | "powershell" | "yaml" | "toml" | "json") ||
                              "bash"
                        }
                        isElevated={isElevated}
                        isDestructive={isDestructive}
                      />
                    );
                  }

                  if (b.type === "list" && b.items) {
                    return (
                      <ul
                        key={bIdx}
                        className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300"
                      >
                        {b.items.map((it, itIdx) => (
                          <li key={itIdx}>{renderInlineMarkdown(it)}</li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p
                      key={bIdx}
                      className="text-xs sm:text-sm text-slate-300 leading-relaxed"
                    >
                      {renderInlineMarkdown(b.content)}
                    </p>
                  );
                })}
              </GuideStep>
            );
          }

          // 5. Default General Section (Architecture Overview, etc.)
          const blocks = parseBlocks(bodyText);
          return (
            <section
              key={sectionId}
              id={sectionId}
              className="scroll-mt-24 space-y-4 my-6"
            >
              <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800/80 pb-2">
                {headingTitle}
              </h2>
              {blocks.map((b, bIdx) => {
                if (b.type === "code") {
                  return (
                    <CommandBlock
                      key={bIdx}
                      command={b.content}
                      language={
                        (b.lang as "bash" | "powershell" | "yaml" | "toml" | "json") ||
                        "bash"
                      }
                    />
                  );
                }

                if (b.type === "list" && b.items) {
                  return (
                    <ul
                      key={bIdx}
                      className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-300"
                    >
                      {b.items.map((it, itIdx) => (
                        <li key={itIdx}>{renderInlineMarkdown(it)}</li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={bIdx}
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed"
                  >
                    {renderInlineMarkdown(b.content)}
                  </p>
                );
              })}
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
