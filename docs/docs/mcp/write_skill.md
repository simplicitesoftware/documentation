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

`get_skill` only serves skills: a static prompt is never listed in the catalog and cannot be
loaded by name either.

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

That one-shot compilation also changes how access rules behave for static prompts, in a way that
is easy to get wrong — see [Visibility and permissions](#visibility-and-permissions).

Because it costs context on every request, a static prompt should be short and should be
reserved for instructions that genuinely apply to everything: a house rule, a standing
constraint, something you cannot trust a catalog lookup to surface in time.

Visibility and permissions
--------

A prompt's audience is set by its **Visibility** (`mcpProVisibility`), then, for a restricted
prompt, by the platform's standard group permissions.

| Visibility | Who can use it |
| --- | --- |
| **Public** | Every MCP user. Permissions are ignored. |
| **Restricted** (default) | Only the groups granted by its permissions, with read access. A restricted prompt **without any permission is available to nobody**. |

:::caution

A new prompt is **Restricted** by default. Until you grant it to at least one group, or switch it
to Public, nobody can use it.

:::

- On a **Public** prompt, the Permissions panel is hidden from the form. Existing permissions are
  kept, not deleted: switching the prompt back to Restricted applies them again immediately.
- Removing the last permission of a restricted prompt closes it to everyone. It never makes the
  prompt public: only the visibility does.
- If the permissions cannot be read at all, access to a restricted prompt is denied rather than
  granted.

:::note

Prompts created before the visibility was introduced have an empty visibility and keep the
former rule: no permission means everyone, one or more permissions restrict the prompt to those
groups. Set an explicit visibility on them: the field is required on the next save.

:::

### Where the check happens

Both modes are filtered, but not at the same moment.

| | Skill | Static |
| --- | --- | --- |
| Evaluated | On every `get_skill` call | Once, when the MCP server is built |
| Against | The calling user's own grant | The grant of whoever triggered that build |
| Granularity | Per user | Per access profile (`designer` / `standard`) |

For skills the check is exact and immediate: visibility or permission changes apply on the next
call, without a restart. `get_skill("?")` hides what the caller may not use, and asking for such a
skill by name is refused. The refusal is the same whether the skill does not exist, is inactive,
is not granted to the caller, or is a static prompt: the actual reason is only written to the
server logs.

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

- Meant for everyone → set it to **Public**.
- Meant for designers → keep it **Restricted** and grant `DESIGNER` and `ADMIN`.
- Meant for business users → keep it **Restricted** and grant their groups. A public prompt also
  lands in the designers' context, where business instructions usually contradict the designer
  prompt.

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
4. **Decide who can use it.** The new skill is Restricted with no permission, so nobody can use
   it yet: grant the groups that need it, or set it to Public. See
   [Visibility and permissions](#visibility-and-permissions).

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
| Skill does not appear in `get_skill("?")` at all | It is inactive, or it is Restricted and none of its permissions covers the user's group (with read access). A Restricted skill with no permission is available to nobody. |
| `get_skill("<name>")` answers that the skill is not available | Same causes as above, or the name is wrong, or it is a static prompt (never served by `get_skill`). The exact reason is in the server logs. |
| A prompt reaches users who should not see it | It is Public, or it has no visibility yet and no permission. Set it to Restricted and grant the right groups. |
| The Permissions panel is missing from the prompt form | The prompt is Public. Switch it to Restricted to see and edit its permissions. |
| Skill appears in the catalog but the agent never loads it | The description does not overlap with how requests are actually phrased. Rewrite it with the user's vocabulary. |
| Edits to a static prompt have no effect | Static prompts compile at server startup. Restart, or move the content to a skill while iterating. |
| Static prompt works for designers but not standard users | Instructions compile once per access profile, against the grant of whoever triggered that build. Set it to Public, or grant a group covering _every_ user of the standard profile, then restart. |
