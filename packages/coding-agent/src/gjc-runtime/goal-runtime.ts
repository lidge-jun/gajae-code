/**
 * jwc goal adapter (060/061) — cli-jaw-shaped verb surface over the existing
 * ultragoal engine. The engine (ultragoal-runtime, goal tool, guard) stays the
 * canonical owner of durable state; this adapter maps verbs, enforces the jaw
 * evidence/pause/done contracts, and mirrors the `{stdout, stderr, status}`
 * shape of orchestrate-runtime.
 *
 * Verbs: set | plan | refine | status (alias show) | update | done |
 *        cancel (alias drop) | pause | resume | history
 */
import path from "node:path";
import {
	GJC_SESSION_FILE_ENV,
	GJC_SESSION_ID_ENV,
	writeCurrentSessionGoalModeState,
	writePendingGoalModeRequest,
} from "./goal-mode-request";
import {
	appendUltragoalLedgerEvent,
	checkpointUltragoalGoal,
	createUltragoalPlan,
	getUltragoalStatus,
	readUltragoalLedger,
	readUltragoalPlan,
	refineUltragoalObjective,
	startNextUltragoalGoal,
	type UltragoalGoal,
} from "./ultragoal-runtime";

export interface GoalCommandResult {
	stdout?: string;
	stderr?: string;
	status: number;
}

/** Brief sentinel for `jwc goal plan` — continuation prompt switches to plan mode on it. */
export const GOAL_PLAN_PENDING_BRIEF = "(AI-driven goal planning pending refinement)";

const HISTORY_DEFAULT = 10;
const HISTORY_MAX = 50;

const VERB_ALIASES: Record<string, string> = { show: "status", drop: "cancel" };

interface ParsedGoalArgs {
	verb: string;
	positional: string[];
	evidence: string[];
	audit?: string;
	agent: boolean;
	force: boolean;
	qualityGateJson?: string;
}

function parseGoalArgs(argv: readonly string[]): ParsedGoalArgs | { error: string } {
	const positional: string[] = [];
	const evidence: string[] = [];
	let audit: string | undefined;
	let agent = false;
	let force = false;
	let qualityGateJson: string | undefined;
	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index]!;
		if (arg === "--agent") {
			agent = true;
		} else if (arg === "--force") {
			force = true;
		} else if (arg === "--evidence") {
			const value = argv[++index];
			if (!value) return { error: "--evidence requires a value" };
			evidence.push(value);
		} else if (arg === "--audit") {
			const value = argv[++index];
			if (!value) return { error: "--audit requires a value" };
			audit = value;
		} else if (arg === "--quality-gate-json") {
			const value = argv[++index];
			if (!value) return { error: "--quality-gate-json requires a value" };
			qualityGateJson = value;
		} else if (arg.startsWith("--")) {
			return { error: `unknown jwc goal flag: ${arg}` };
		} else {
			positional.push(arg);
		}
	}
	const rawVerb = positional.shift()?.toLowerCase() ?? "status";
	const verb = VERB_ALIASES[rawVerb] ?? rawVerb;
	return { verb, positional, evidence, audit, agent, force, qualityGateJson };
}

function pauseGatePath(cwd: string): string {
	return path.join(cwd, ".jwc", "state", "goal-pause-gate.json");
}

interface PauseGateState {
	agentPauseCount: number;
	paused?: { actor: string; evidence?: string; timestamp: string };
}

async function readPauseGate(cwd: string): Promise<PauseGateState> {
	try {
		return (await Bun.file(pauseGatePath(cwd)).json()) as PauseGateState;
	} catch {
		return { agentPauseCount: 0 };
	}
}

async function writePauseGate(cwd: string, state: PauseGateState): Promise<void> {
	await Bun.write(pauseGatePath(cwd), `${JSON.stringify(state, null, "\t")}\n`);
}

async function activeGoal(cwd: string): Promise<UltragoalGoal | { error: string }> {
	const plan = await readUltragoalPlan(cwd);
	if (!plan) return { error: "no goal plan found — run `jwc goal set <objective>` first" };
	const goal = plan.goals.find(item => item.status === "active") ?? plan.goals.find(item => item.status === "pending");
	if (!goal) return { error: "no active goal story — all stories are closed (see `jwc goal status`)" };
	return goal;
}

async function activateGoalMode(cwd: string, objective: string): Promise<void> {
	await writeCurrentSessionGoalModeState({ sessionFile: process.env[GJC_SESSION_FILE_ENV], objective });
	await writePendingGoalModeRequest({
		cwd,
		objective,
		goalsPath: path.join(cwd, ".jwc", "ultragoal", "goals.json"),
		sessionId: process.env[GJC_SESSION_ID_ENV],
	});
}

const PAUSE_AUDIT_CHECKLIST = [
	"pause gate (1st tap): the pause was NOT executed.",
	"Agent-initiated pauses need an independent stop audit (2-tap gate):",
	"  1. Re-derive the remaining requirements from the goal objective.",
	"  2. For each, check whether a viable approach remains untried.",
	'  3. If none remains, run: jwc goal pause --agent --audit "<independent reviewer summary>"',
	"If any viable path remains, continue working instead of pausing.",
].join("\n");

export async function runNativeGoalCommand(argv: readonly string[], cwd: string): Promise<GoalCommandResult> {
	const parsed = parseGoalArgs(argv);
	if ("error" in parsed) return { stderr: `${parsed.error}\n`, status: 2 };
	const { verb, positional, evidence, audit, agent, force, qualityGateJson } = parsed;

	try {
		switch (verb) {
			case "set": {
				const objective = positional.join(" ").trim();
				if (!objective) return { stderr: "usage: jwc goal set <objective>\n", status: 2 };
				const plan = await createUltragoalPlan({ cwd, brief: objective });
				const started = await startNextUltragoalGoal({ cwd });
				await activateGoalMode(cwd, objective);
				return {
					stdout: `✅ goal set — ${plan.goals.length} story(ies), active: ${started.goal?.id ?? "none"}\n${objective}\n`,
					status: 0,
				};
			}
			case "plan": {
				const hint = positional.join(" ").trim();
				const brief = hint ? `${GOAL_PLAN_PENDING_BRIEF}\nhint: ${hint}` : GOAL_PLAN_PENDING_BRIEF;
				const plan = await createUltragoalPlan({ cwd, brief });
				await startNextUltragoalGoal({ cwd });
				await activateGoalMode(cwd, brief);
				return {
					stdout: `✅ goal plan mode — pending refinement (stories: ${plan.goals.length})\nRefine with: jwc goal refine "<specific objective>"\n`,
					status: 0,
				};
			}
			case "refine": {
				const objective = positional.join(" ").trim();
				if (!objective) return { stderr: "usage: jwc goal refine <objective>\n", status: 2 };
				await refineUltragoalObjective({ cwd, objective });
				await activateGoalMode(cwd, objective);
				return { stdout: `✅ goal refined: ${objective}\n`, status: 0 };
			}
			case "status": {
				const summary = await getUltragoalStatus(cwd);
				const plan = await readUltragoalPlan(cwd);
				if (!plan) return { stdout: "goal: none (run `jwc goal set <objective>`)\n", status: 0 };
				const active = plan.goals.find(goal => goal.status === "active");
				const gate = await readPauseGate(cwd);
				// 99.00.03 P1-2 — user objective first; the engine-level plan
				// objective (ultragoal boilerplate) is detail, not the headline.
				const userObjective = active?.objective ?? plan.brief.split("\n")[0];
				const lines = [
					`Goal:    ${userObjective}`,
					`Status:  ${active ? active.status : "no active story"}${gate.paused ? " (paused)" : ""}`,
					`Mode:    ultragoal ledger (.jwc/ultragoal/)`,
					`ID:      ${active?.id ?? "-"}`,
					`Stories: ${plan.goals.map(goal => `${goal.id}:${goal.status}`).join(" ")}`,
				];
				if (gate.paused) lines.push(`paused: by ${gate.paused.actor} at ${gate.paused.timestamp}`);
				if (summary.currentGoal?.evidence) lines.push(`last evidence: ${summary.currentGoal.evidence}`);
				return { stdout: `${lines.join("\n")}\n`, status: 0 };
			}
			case "update": {
				const summary = positional.join(" ").trim();
				if (!summary)
					return { stderr: 'usage: jwc goal update "<checkpoint summary>" --evidence "<proof>"\n', status: 2 };
				if (evidence.length === 0) {
					return {
						stderr: "jwc goal update requires --evidence (jaw checkpoint contract) — engine not reached\n",
						status: 1,
					};
				}
				const goal = await activeGoal(cwd);
				if ("error" in goal) return { stderr: `${goal.error}\n`, status: 1 };
				const joined = [summary, ...evidence].join("; ");
				await checkpointUltragoalGoal({ cwd, goalId: goal.id, status: "active", evidence: joined });
				return { stdout: `✅ checkpoint recorded for ${goal.id} (status stays active)\n`, status: 0 };
			}
			case "done": {
				const note = positional.join(" ").trim();
				const goal = await activeGoal(cwd);
				if ("error" in goal) return { stderr: `${goal.error}\n`, status: 1 };
				if (!force) {
					const ledger = await readUltragoalLedger(cwd);
					const hasEvidence = ledger.some(
						event =>
							event.event === "goal_checkpointed" &&
							event.goalId === goal.id &&
							typeof event.evidence === "string" &&
							event.evidence.length > 0,
					);
					if (!hasEvidence) {
						return {
							stderr: `jwc goal done requires at least one evidence-bearing checkpoint for ${goal.id} — run \`jwc goal update ... --evidence ...\` first (--force is human-only override)\n`,
							status: 1,
						};
					}
				}
				// Quality gate: explicit flag wins; otherwise auto-connect the
				// orchestrate-c artifact convention (061 §6-6).
				const autoGate = path.join(cwd, ".jwc", "state", "pabcd-quality-gate.json");
				const gateRef = qualityGateJson ?? ((await Bun.file(autoGate).exists()) ? autoGate : undefined);
				const evidenceText = [note || "goal completion", ...evidence].join("; ");
				await checkpointUltragoalGoal({
					cwd,
					goalId: goal.id,
					status: "complete",
					evidence: evidenceText,
					qualityGateJson: gateRef,
				});
				return {
					stdout: `✅ ${goal.id} complete (quality gate: ${gateRef ?? "engine-required"})\nSession-level completion is finalized by the in-session goal tool (guard-checked).\n`,
					status: 0,
				};
			}
			case "cancel": {
				const reason = positional.join(" ").trim() || "cancelled by user";
				const goal = await activeGoal(cwd);
				if ("error" in goal) return { stderr: `${goal.error}\n`, status: 1 };
				await checkpointUltragoalGoal({ cwd, goalId: goal.id, status: "superseded", evidence: reason });
				return { stdout: `✅ ${goal.id} superseded — ${reason}\n`, status: 0 };
			}
			case "pause": {
				const gate = await readPauseGate(cwd);
				if (!agent) {
					await writePauseGate(cwd, {
						agentPauseCount: 0,
						paused: { actor: "human", timestamp: new Date().toISOString() },
					});
					return { stdout: "⏸ goal paused (manual)\n", status: 0 };
				}
				if (!audit) {
					await writePauseGate(cwd, { ...gate, agentPauseCount: gate.agentPauseCount + 1 });
					return {
						stderr: `${PAUSE_AUDIT_CHECKLIST}\n(attempt ${gate.agentPauseCount + 1} recorded — pause NOT executed)\n`,
						status: 1,
					};
				}
				if (gate.agentPauseCount < 1) {
					await writePauseGate(cwd, { ...gate, agentPauseCount: 1 });
					return {
						stderr:
							"2-tap gate: first run `jwc goal pause --agent` (audit checklist), then repeat with --audit in the same effort\n",
						status: 1,
					};
				}
				const timestamp = new Date().toISOString();
				await writePauseGate(cwd, { agentPauseCount: 0, paused: { actor: "agent", evidence: audit, timestamp } });
				await appendUltragoalLedgerEvent(cwd, {
					event: "goal_pause_audited",
					actor: "agent",
					evidence: audit,
					reason: positional.join(" ").trim() || "agent-initiated pause",
				});
				return { stdout: `⏸ goal paused (agent, audited) — ${audit}\n`, status: 0 };
			}
			case "resume": {
				await writePauseGate(cwd, { agentPauseCount: 0 });
				const plan = await readUltragoalPlan(cwd);
				if (plan) await activateGoalMode(cwd, plan.gjcObjective);
				return { stdout: "▶ goal resumed\n", status: 0 };
			}
			case "history": {
				const limitRaw = Number.parseInt(positional[0] ?? "", 10);
				const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), HISTORY_MAX) : HISTORY_DEFAULT;
				const ledger = await readUltragoalLedger(cwd);
				const slice = ledger.slice(-limit).reverse();
				if (slice.length === 0) return { stdout: "goal history: empty\n", status: 0 };
				const lines = slice.map(event => {
					const extras = ["goalId", "status", "evidence", "actor"]
						.map(key => (typeof event[key] === "string" ? `${key}=${event[key]}` : null))
						.filter(Boolean)
						.join(" ");
					return `${typeof event.timestamp === "string" ? event.timestamp : ""} ${event.event}${extras ? ` ${extras}` : ""}`;
				});
				return { stdout: `${lines.join("\n")}\n`, status: 0 };
			}
			default:
				return {
					stderr: `unknown jwc goal verb '${verb}' (expected set|plan|refine|status|update|done|cancel|pause|resume|history; aliases: show→status, drop→cancel)\n`,
					status: 2,
				};
		}
	} catch (error) {
		return { stderr: `${error instanceof Error ? error.message : String(error)}\n`, status: 1 };
	}
}
