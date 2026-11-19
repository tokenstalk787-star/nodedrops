import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parsePublisherMarkdown, publisherPathToSlug } from "../src/lib/github-publisher/frontmatter";

const template = readFileSync("content/guides/_template.md", "utf8");
const parsed = parsePublisherMarkdown(template);

assert.equal(parsed.data.slug, "example-network-full-node");
assert.equal(parsed.data.published, false);
assert.equal(parsed.data.network.networkType, "TESTNET");
assert.equal(parsed.data.sources.length, 1);
assert.ok(parsed.body.includes("# Overview"));
assert.equal(publisherPathToSlug("content/guides/example-network-full-node.md"), "example-network-full-node");
assert.equal(publisherPathToSlug("content/guides/_template.md"), null);

console.log("GitHub publisher frontmatter smoke test passed.");
