---
sidebar_position: 111
title: Writing a good skill
---

Writing a good skill
=====================

A skill (`McpPrompt`) is memory for the agent.
It is a reusable playbook loaded with `get_skill` so the same problem does not need to be solved from scratch every time.

When to write one
------------------

A skill is warranted when a task requires real intelligence from the agent, not when it is a single, obvious tool call.

The signal is a task the agent did not get right on the first try. If several rounds of correction, extra context,
or trial and error were needed before the result was correct, the task likely has a hidden structure: an ordering, a gotcha,
a convention that is not evident from the tool schemas alone. That structure is what a skill should capture.

:::note

If the agent succeeds in one shot, there is nothing to capture. A skill should not be written speculatively for a task that has not yet caused friction.

:::

How to write one
-----------------

A skill should not be written from a blank page. The recommended method is to let the agent write it.

1. The task is worked through with the agent, providing inputs, correcting it, and iterating until it actually succeeds.
2. Once the task succeeds, the agent is asked to turn what it just did into a skill.
3. The agent retrieves `CREATE_SKILL`, which defines the record shape, the naming convention, and how to compile a successful run into task-oriented steps.

Deciding that a task took too much back-and-forth and is worth capturing remains a human responsibility.
Extracting and writing the playbook is delegated to the agent. The result should be reviewed before being considered final. The name should be findable,
the description should match how the task would actually be requested, and the steps should reflect what actually worked.
