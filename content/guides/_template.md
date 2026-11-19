# GitHub Auto-Publisher Guide Template

Copy this file, rename it to `content/guides/<guide-slug>.md`, and replace all example values.
Never publish the template itself.

---
title: "Example Network Full Node Guide"
slug: example-network-full-node
summary: "A concise overview of the node role, supported network, and installation goal."
difficulty: BEGINNER
estimatedMinutes: 45
categorySlug: full-nodes
categoryName: Full Nodes
categoryDescription: Full node deployment and maintenance guides.
published: false
verificationStatus: UNDER_REVIEW
# verifiedAt: "2026-11-19T00:00:00.000Z" # Set only after actual review/testing.
network:
  name: Example Network
  slug: example-network
  symbol: EX
  networkType: TESTNET
  category: Layer 1
  layer: Layer 1
  consensus: Unknown / not specified
  websiteUrl: https://example.org/
  docsUrl: https://docs.example.org/
  githubUrl: https://github.com/example/example
sources:
  - name: Example Official Documentation
    url: https://docs.example.org/
    sourceType: OFFICIAL_DOCS
    notes: "Replace with the exact pages used to verify the instructions."
---

# Overview

Describe the network and what this guide helps the operator deploy. State whether it is testnet or mainnet.

## Requirements

- Operating system and version
- CPU / RAM
- Disk capacity and disk type
- Network bandwidth
- Required accounts or tools (never ask for seed phrases or private keys)

## Before You Start

List prerequisites and relevant risks. Include official references.

## Installation

Use copyable, reviewed commands. Explain each important step.

```bash
# Replace this with the network's actual installation command.
echo "Replace template commands before publishing"
```

## Configuration

Explain configuration files, environment variables, ports, and firewall rules. Do not expose credentials.

## Start the Node

Provide the real command and explain how to run it safely as a service.

## Verify / Health Check

Include actual commands and expected output. Do not mark a setup as tested unless it was run.

## Troubleshooting

### Common issue

Explain symptoms and safe troubleshooting steps.

## Update and Maintenance

Explain updates, backups, monitoring, and how to stop/restart the node.

## Sources

List the official sources used above. Frontmatter sources are also stored in the CMS.
