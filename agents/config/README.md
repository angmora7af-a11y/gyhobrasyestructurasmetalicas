# Config

Configuration and templates for IA Hybrid Teams.

## Cursor Rules Template

`cursor-rules-template.mdc` is a **reusable template** for Cursor agent rules. Use it to standardize AI agent behavior across projects.

### How to use

1. **Copy** the template to your project's `.cursor/rules/` folder:
   ```bash
   mkdir -p .cursor/rules
   cp config/cursor-rules-template.mdc .cursor/rules/agent-protocol.mdc
   ```

2. **Customize** placeholders for your project:
   - `{{docs/flow.mmd}}` → path to your flow or architecture diagram
   - `{{requirements/}}` → requirements or user stories location
   - `{{db_model.dbml}}` → schema or domain model file
   - `{{log_ejecucion.txt}}` → execution log file name

3. **Adjust Section 5** to your stack (FastAPI, Node, Flutter, etc.) and delete non-relevant options.

4. **Optional:** Set `alwaysApply: false` in the frontmatter and add `globs` if the rule should only apply to certain files.

### Template sections

| Section | Purpose |
|---------|---------|
| Mandatory Knowledge Sources | What the agent must read before working |
| Autonomy & Execution | YOLO mode, self-correction limits |
| Verification Routine | What to run after changes |
| Activity Logging | Where and how to log progress |
| Project-Specific Conventions | Framework and coding standards |

---

## Cursor Rules — Claude Principles

`cursor-rules-claude-principles.mdc` applies **Anthropic's Claude Constitution** to agent behavior. Use it when you want the agent to follow Claude's core values: safety, ethics, guideline compliance, and genuine helpfulness.

### Claude's priority order (in conflict)

1. **Broadly safe** — support human oversight; do not circumvent controls
2. **Broadly ethical** — honesty, avoid harm, cite sources
3. **Guidelines** — follow project rules and architecture
4. **Genuinely helpful** — substantive benefit, like a trusted expert

### Sections

| Section | Purpose |
|--------|---------|
| Core Values | Safety → Ethics → Guidelines → Helpfulness |
| Mandatory Knowledge Sources | architecture.md, claude.md, requirements |
| Autonomy & Execution | Self-correction limit, transparency |
| Claude-Specific Conventions | Helpfulness, ethics, honesty, safety |
