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

> **Does this apply to every task the agent will ever do ?** : **static**
>
> **Does this apply to a specific use ?** : **skill**

Most content belongs in a skill.

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

That one-shot compilation also changes how permissions behave for static prompts, in a way that
is easy to get wrong — see [Permissions](#permissions).

Because it costs context on every request, a static prompt should be short and should be
reserved for instructions that genuinely apply to everything: a house rule, a standing
constraint, something you cannot trust a catalog lookup to surface in time.

Permissions
--------

A prompt's audience is controlled by the platform's standard group permissions.

### Permissions restrict, they do not publish

| Permissions on the prompt | Who sees it |
| --- | --- |
| None | Everyone |
| One or more | Only the groups named, and only those with `hasRead` true |

:::caution

Adding the **first** permission flips a prompt from public to private. A prompt everyone could
use becomes reserved to the single group you just named, and nobody else keeps access. That is
intended, but it makes the first grant a far bigger change than any grant you add afterwards.

:::

If the ACL cannot be read at all, access is denied rather than granted.

### Where the check happens

Both modes are filtered, but not at the same moment.

| | Skill | Static |
| --- | --- | --- |
| Evaluated | On every `get_skill` call | Once, when the MCP server is built |
| Against | The calling user's own grant | The grant of whoever triggered that build |
| Granularity | Per user | Per access profile (`designer` / `standard`) |

For skills the check is exact. `get_skill("?")` hides what the caller may not read, and asking
for a restricted skill by name is refused.

For static prompts it is not. The instructions are compiled once per access profile and reused
for everyone on that profile, which has three consequences:

- Every user of a profile receives the **same** instructions, whatever their groups.
- A static prompt can only reliably separate what the profile already separates: designers and
  administrators on one side, everyone else on the other. A finer split (two business
  departments for example) will not hold.
- If the first user to open a profile is not in a granted group, **no** user of that profile
  gets the prompt until the next restart.

:::tip

What this means in practice for a static prompt:

- Meant for everyone → leave it without permissions.
- Meant for designers → grant `DESIGNER` and `ADMIN`.
- Meant for business users → restrict it explicitly. Left without permissions it also lands in
  the designers' context, where business instructions usually contradict the designer prompt.

:::

Ordering
----------

`mcpProOrder` does two things depending on the mode:

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
| Skill does not appear in `get_skill("?")` at all | The prompt has permissions and none of them covers the user's group. A prompt with _no_ permission is visible to everyone, so absence of a grant is never the cause. |
| A prompt reaches users who should not see it | It has no permission at all. Permissions restrict; without one it is public. |
| Skill appears in the catalog but the agent never loads it | The description does not overlap with how requests are actually phrased. Rewrite it with the user's vocabulary. |
| Edits to a static prompt have no effect | Static prompts compile at server startup. Restart, or move the content to a skill while iterating. |
| Static prompt works for designers but not standard users | Instructions compile once per access profile, against the grant of whoever triggered that build. Grant a group covering _every_ user of the standard profile, then restart. |
