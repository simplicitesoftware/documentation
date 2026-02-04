#!/usr/bin/env python3
"""
Initialize a new Make-section reference documentation page from the Make guide template.

Usage:
  python3 scripts/init_make_doc.py

The script prompts for:
  - Documentation title
  - Destination path under docs/make (directory or full file path)
Optional:
  - sidebar_position (number, blank to use 'X')
"""

from __future__ import annotations

import os
from pathlib import Path


TEMPLATE = """---
sidebar_position: {sidebar_position}
title: {title}
---

{heading}
{heading_underline}

Introduction
------------

[2-3 paragraphs explaining what the object is, its purpose, and when to use it]

Key Concepts
------------

- **Concept 1**: Brief explanation
- **Concept 2**: Brief explanation
- **Concept 3**: Brief explanation

Features
--------

1. **Feature Name**
   - Description of what this feature does
   - Use cases

2. **Feature Name**
   - Description
   - Use cases

Configuration
-------------

### Configuration Fields

| Field | Type | Required | Description | Default Value |
|-------|------|----------|-------------|---------------|
| Field Name | Type | Yes/No | What this field does | Default |

### Field Details

#### Field Name

- **Purpose**: What this field controls
- **Valid Values**: List of valid options
- **Constraints**: Any limitations or requirements
- **Example**: Example value

### Configuration Options

#### Option Type 1

| Option | Description | Use Case |
|--------|-------------|----------|
| Value 1 | What it does | When to use it |
| Value 2 | What it does | When to use it |

Behavior
--------

[Explain how the object behaves once configured]
- How it appears in the UI
- How users interact with it
- How it processes data
- Any automatic behaviors

Related Objects
---------------

- **[Related Object 1](/make/path/to/object)**: How they relate
- **[Related Object 2](/make/path/to/object)**: How they relate

Learn More
----------

- [Related Tutorial](/tutorial/path) - Step-by-step guide
- [Advanced Topic](/docs/path) - Deep dive
- [API Reference](/docs/api/path) - Technical details
"""


def _prompt(label: str, default: str | None = None) -> str:
    suffix = f" [{default}]" if default else ""
    while True:
        val = input(f"{label}{suffix}: ").strip()
        if val:
            return val
        if default is not None:
            return default


def _resolve_output_path(dest: str, title: str) -> Path:
    p = Path(dest).expanduser()
    # If destination is a directory or ends with '/', create a filename from title.
    if str(dest).endswith(("/", os.sep)) or (p.exists() and p.is_dir()) or (p.suffix == ""):
        slug = (
            title.strip()
            .lower()
            .replace("&", "and")
            .replace("/", "-")
            .replace("\\", "-")
        )
        slug = "".join(ch if (ch.isalnum() or ch in "-_") else "-" for ch in slug)
        while "--" in slug:
            slug = slug.replace("--", "-")
        slug = slug.strip("-") or "new-doc"
        return p / f"{slug}.md"
    return p


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    make_root = repo_root / "docs" / "make"

    title = _prompt("Documentation title")
    dest = _prompt(
        "Destination path under docs/make (e.g. settings/ or settings/task-queues.md)",
        "settings/",
    )
    sidebar_position = _prompt("sidebar_position (number, blank to leave as X)", "X")

    # Always resolve under docs/make (destination is relative to make_root)
    dest_rel = Path(dest.strip().lstrip("/")).as_posix()
    out = (make_root / _resolve_output_path(dest_rel, title)).resolve()

    # Safety: ensure output is within docs/make
    try:
        out.relative_to(make_root.resolve())
    except ValueError as e:
        raise SystemExit(f"Destination must be under {make_root}: {out}") from e

    out.parent.mkdir(parents=True, exist_ok=True)

    heading = title
    content = TEMPLATE.format(
        sidebar_position=sidebar_position,
        title=title,
        heading=heading,
        heading_underline="=" * max(len(heading), 3),
    )

    if out.exists():
        raise SystemExit(f"Refusing to overwrite existing file: {out}")

    out.write_text(content, encoding="utf-8")
    print(f"Created: {out}")


if __name__ == "__main__":
    main()

