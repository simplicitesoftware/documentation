---
sidebar_position: 111
title: Skills and static prompts
---

Skills and static prompts
=========================

An `McpPrompt` record is memory you give the agent. It comes in two modes, **skill** and
**static**, written the same way but delivered to the agent very differently.

Pick the wrong mode and you either burn context on every single request or make a critical
instruction invisible until it is too late to matter.

Which mode do I need?
-------

> **Does this apply to every task the agent will ever do, and is it finished?**
>
> Yes to both: **static**. Anything else: **skill**.

Most content belongs in a skill. Static is the exception, not the default.

Skill mode (`STARTER`)
--------

:::note

The type code is `STARTER`, which predates the "skill" naming. They refer to the same thing.

:::

A skill is not preloaded. The agent discovers it by calling `get_skill("?")`, which returns
the catalog of names and descriptions, then loads the body with `get_skill("<name>")` only
when the task looks relevant.

Two consequences follow:

- **Changes take effect immediately.** The body is read fresh from the database on every
  call, so you can iterate without restarting anything.
- **The description does all the work.** `mcpProDescription` is the only signal the agent
  has when deciding whether to load the skill. A vague description means a skill that is
  correct, granted, active, and never used. See [Writing the description](#writing-the-description).

Use a skill for anything task-specific: a playbook for one kind of request, a niche
convention, a multi-step procedure with an order that matters.

Static mode (`SYSTEM`)
-------

A static prompt sits in the agent's context on every request, relevant or not.

Static prompts are compiled into the server's instructions once, at server startup, and are
compiled separately for the designer and standard access profiles. Editing the content of a
static prompt does nothing until that compilation is redone, which means a **server restart**.

That restart requirement makes static the wrong home for anything you are still iterating
on. Draft as a skill, promote to static once the wording has settled.

Because it costs context on every request, a static prompt should be short and should be
reserved for instructions that genuinely apply to everything: a house rule, a standing
constraint, something you cannot trust a catalog lookup to surface in time.

Access grants apply to both modes
--------

:::caution

An active `McpPrompt` is not enough on its own. It also needs at least one `McpPromptAccess`
grant with `hasRead=true` for a group your intended users belong to. With no grant, the
prompt is invisible to everyone, designers included.

This is the most common reason a new prompt "doesn't show up."

:::

Ordering
----------

`mcpProOrder` does two unrelated things depending on the mode:

| Mode | What `mcpProOrder` controls |
| --- | --- |
| Static | Concatenation order into the server instructions, lowest first. Matters when one instruction needs to set context before another. |
| Skill | Display order in the `get_skill("?")` catalog. Cosmetic. It has no effect on whether or when a skill gets loaded. |

When to write a skill
------------

Write a skill when a task needs real judgment from the agent, not when it is one obvious
tool call.

The signal to watch for is a task the agent did not get right on the first try. If it took
several rounds of correction, extra context, or trial and error before the result was
correct, the task probably has a hidden structure: an ordering, a gotcha, a convention that
is not visible in the tool schemas. Capturing that structure is what a skill is for.

:::note

If the agent succeeds in one shot, there is nothing to capture. Do not write skills
speculatively for tasks that have not yet caused friction.

:::

Deciding that a task cost too much back-and-forth is your call. Extracting the playbook is
the agent's.

How to write a skill
---------

Do not start from a blank page. Let the agent write the first draft.

1. **Work the task through with the agent.** Give it the inputs, correct it, iterate until
   it actually succeeds.
2. **Ask it to turn what it just did into a skill.** It will retrieve `CREATE_SKILL`, which
   defines the record shape, the naming convention, and how to compile a successful run into
   task-oriented steps.
3. **Review the draft before you consider it final.** Check that the name is findable, the
   description matches how someone would actually phrase the request, and the steps reflect
   what really worked rather than what the agent tried first.

Writing the description
----------

The body of a skill only matters if the description gets it loaded. Write the description
for the moment of decision: the agent is holding a user request and scanning a catalog.

Include the words a user would actually use, the object or domain involved, and the
situation that should trigger it. Leave out anything the agent already knows from the tool
schemas.

**Too vague to trigger:**

> Helper for working with objects.

Nothing here overlaps with a real request. The agent has no reason to load it over anything
else in the catalog.

**Findable:**

> Add fields to an existing business object, including joined fields that reference another
> object. Covers field type codes, ordering, and the FK-then-joined-field sequence that must
> be respected.

Names the operation, the vocabulary a user would type, and the gotcha that justified writing
the skill in the first place.

Troubleshooting
----------

| Symptom | Likely cause |
| --- | --- |
| Skill does not appear in `get_skill("?")` at all | No `Permission` for the user's group |
| Skill appears in the catalog but the agent never loads it | The description does not overlap with how requests are actually phrased. Rewrite it with the user's vocabulary. |
| Edits to a static prompt have no effect | Static prompts compile at server startup. Restart, or move the content to a skill while iterating. |
| Static prompt works for designers but not standard users | Static prompts compile separately per access profile. Check the grant covers the standard profile group too. |
