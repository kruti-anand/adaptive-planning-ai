/*
 * Adaptive Planning Engine
 *
 * Zero-cost local planning engine.
 *
 * The engine analyzes the conversation, identifies missing planning
 * information, asks adaptive questions, and eventually generates
 * a structured project plan.
 */

export function generatePlanningResponse(messages) {
  const conversation = normalizeMessages(messages);

  const initialRequest = conversation.find(
    (message) => message.role === "user"
  )?.text || "";

  if (!initialRequest.trim()) {
    return {
      type: "question",
      message: "What would you like to plan?",
      why_it_matters: "The planning engine needs an initial project or business request."
    };
  }

  const planningState = analyzeConversation(conversation);

  /*
   * Ask the next most important planning question.
   */
  const nextQuestion = determineNextQuestion(planningState);

  if (nextQuestion) {
    return {
      type: "question",
      message: nextQuestion.message,
      why_it_matters: nextQuestion.why_it_matters
    };
  }

  /*
   * Once enough information has been collected, tell the user
   * that the planning discovery phase is complete.
   */
  if (!planningState.planRequested) {
    return {
      type: "complete",
      message:
        "I have enough information to build the initial plan. " +
        "Review the information above and select Generate Plan when you're ready.",
      why_it_matters:
        "The planning engine has collected the core information needed to construct the plan."
    };
  }

  return {
    type: "plan",
    message: buildPlan(planningState),
    why_it_matters:
      "The plan was generated from the requirements, constraints, dependencies, and risks identified during planning."
  };
}


/* ------------------------------------------------------------------
 * Conversation normalization
 * ------------------------------------------------------------------ */

function normalizeMessages(messages) {
  return messages
    .filter(
      (message) =>
        message &&
        typeof message.text === "string" &&
        typeof message.role === "string"
    )
    .map((message) => ({
      role: message.role,
      text: message.text.trim()
    }))
    .filter((message) => message.text.length > 0);
}


/* ------------------------------------------------------------------
 * Planning analysis
 * ------------------------------------------------------------------ */

function analyzeConversation(messages) {
  const userMessages = messages
    .filter((message) => message.role === "user")
    .map((message) => message.text);

  const combinedText = userMessages.join(" ").toLowerCase();

  return {
    initialRequest: userMessages[0] || "",
    userMessages,
    combinedText,

    hasTimeline: detectTimeline(combinedText),
    hasStakeholders: detectStakeholders(combinedText),
    hasScope: detectScope(combinedText),
    hasTechnology: detectTechnology(combinedText),
    hasDependencies: detectDependencies(combinedText),
    hasRisks: detectRisks(combinedText),

    planRequested: userMessages.some((message) =>
      /proceed|generate.*plan|final plan|create.*plan|build.*plan/i.test(message)
    )
  };
}


/* ------------------------------------------------------------------
 * Adaptive question engine
 * ------------------------------------------------------------------ */

function determineNextQuestion(state) {
  /*
   * We intentionally ask questions in priority order.
   *
   * The questions are adaptive because the engine evaluates the
   * information already provided before deciding what to ask next.
   */

  if (!state.hasScope) {
    return {
      message:
        "What is the primary outcome you want this initiative to achieve?",
      why_it_matters:
        "The desired outcome defines the scope of the work and helps distinguish essential deliverables from optional features."
    };
  }

  if (!state.hasTimeline) {
    return {
      message:
        "What is the target timeline or deadline for delivering this initiative?",
      why_it_matters:
        "The timeline affects sequencing, milestones, dependencies, and delivery risk."
    };
  }

  if (!state.hasStakeholders) {
    return {
      message:
        "Who are the primary business and technology stakeholders involved in this initiative?",
      why_it_matters:
        "Identifying stakeholders establishes ownership and helps determine where decisions, approvals, and coordination are required."
    };
  }

  if (!state.hasTechnology) {
    return {
      message:
        "Are there any known technologies, systems, platforms, APIs, or architecture constraints that this initiative must use or integrate with?",
      why_it_matters:
        "Technology constraints can introduce architecture, integration, security, and delivery dependencies."
    };
  }

  if (!state.hasDependencies) {
    return {
      message:
        "Are there any known dependencies on other teams, systems, vendors, approvals, data, or infrastructure?",
      why_it_matters:
        "Dependencies can affect sequencing and create schedule risks if ownership or timing is unclear."
    };
  }

  if (!state.hasRisks) {
    return {
      message:
        "What are the biggest known risks or constraints that could prevent the initiative from being delivered successfully?",
      why_it_matters:
        "Early identification of risks allows the plan to include mitigation actions and explicit ownership."
    };
  }

  return null;
}


/* ------------------------------------------------------------------
 * Detection helpers
 * ------------------------------------------------------------------ */

function detectTimeline(text) {
  return /(\d+\s*(day|days|week|weeks|month|months|year|years))|deadline|q[1-4]|by\s+\w+/i.test(
    text
  );
}

function detectStakeholders(text) {
  return /stakeholder|product|engineering|business|customer|client|executive|leadership|team|teams|owner|users?/i.test(
    text
  );
}

function detectScope(text) {
  return /build|create|launch|deliver|develop|implement|replace|modernize|improve|migrate|automate|platform|application|system|project|initiative|outcome|goal/i.test(
    text
  );
}

function detectTechnology(text) {
  return /api|aws|azure|cloud|database|data|application|app|platform|system|microservice|lambda|github|devops|security|infrastructure|architecture|integration|crm|identity/i.test(
    text
  );
}

function detectDependencies(text) {
  return /depend|integration|vendor|approval|upstream|downstream|external|other team|other teams|api|system|infrastructure|data/i.test(
    text
  );
}

function detectRisks(text) {
  return /risk|constraint|blocker|issue|challenge|uncertain|uncertainty|concern|limitation|problem/i.test(
    text
  );
}


/* ------------------------------------------------------------------
 * Plan generation
 * ------------------------------------------------------------------ */

function buildPlan(state) {
  const request = state.initialRequest;

  const timeline = extractTimeline(state.combinedText);

  const workstreams = buildWorkstreams(state);

  const dependencies = buildDependencies(state);

  const risks = buildRisks(state);

  return `
PROJECT PLAN

Initiative
${request}

1. OBJECTIVE
${buildObjective(state)}

2. DELIVERY APPROACH
The initiative should be delivered incrementally through defined
workstreams, with requirements, architecture, dependencies, risks,
testing, and release readiness reviewed throughout delivery.

3. WORKSTREAMS
${workstreams}

4. MILESTONES
${buildMilestones(timeline)}

5. DEPENDENCIES
${dependencies}

6. RISKS AND MITIGATION
${risks}

7. DELIVERY GOVERNANCE
• Establish clear ownership for each major workstream.
• Track risks, issues, assumptions, and dependencies regularly.
• Confirm requirements and acceptance criteria before implementation.
• Review architecture and security considerations before major development.
• Validate testing and release readiness before production deployment.
• Communicate milestone status and decisions to key stakeholders.

8. NEXT STEPS
• Confirm scope and success criteria.
• Confirm stakeholder and workstream ownership.
• Validate timeline and dependencies.
• Establish milestone dates.
• Begin execution with the highest-priority workstream.
• Review and adapt the plan as new information becomes available.
`.trim();
}


function buildObjective(state) {
  if (state.userMessages.length > 0) {
    return `Deliver the requested initiative while maintaining alignment across business, product, engineering, architecture, security, data, and delivery stakeholders.`;
  }

  return "Define and deliver the requested initiative.";
}


function buildWorkstreams(state) {
  const workstreams = [
    "• Requirements & Product Definition",
    "• Architecture & Technical Design",
    "• Development & Integration",
    "• Testing & Quality Assurance",
    "• Release Readiness & Deployment"
  ];

  if (/data|database|analytics|report/i.test(state.combinedText)) {
    workstreams.splice(
      3,
      0,
      "• Data & Reporting"
    );
  }

  if (/security|identity|authentication|authorization/i.test(state.combinedText)) {
    workstreams.splice(
      3,
      0,
      "• Security & Access Controls"
    );
  }

  return workstreams.join("\n");
}


function buildMilestones(timeline) {
  return [
    `• Discovery & requirements — ${timeline.phase1}`,
    `• Architecture & detailed planning — ${timeline.phase2}`,
    `• Development & integration — ${timeline.phase3}`,
    `• Testing & release readiness — ${timeline.phase4}`,
    `• Production deployment & stabilization — ${timeline.phase5}`
  ].join("\n");
}


function buildDependencies(state) {
  const detected = [];

  if (/api|integration|crm|system/i.test(state.combinedText)) {
    detected.push("• System/API integration readiness");
  }

  if (/security|identity|authentication|authorization/i.test(state.combinedText)) {
    detected.push("• Security and identity/access approvals");
  }

  if (/data|database/i.test(state.combinedText)) {
    detected.push("• Data availability and data-source readiness");
  }

  if (/team|teams|stakeholder|business|product|engineering/i.test(state.combinedText)) {
    detected.push("• Stakeholder and cross-team availability");
  }

  if (detected.length === 0) {
    detected.push("• Confirm external teams, systems, approvals, and infrastructure dependencies during execution.");
  }

  return detected.join("\n");
}


function buildRisks(state) {
  const risks = [
    "• Scope expansion — establish clear scope boundaries and acceptance criteria.",
    "• Dependency delays — assign owners and track dependency dates.",
    "• Requirements ambiguity — validate requirements before development begins.",
    "• Timeline pressure — monitor milestone variance and re-evaluate sequencing when necessary."
  ];

  if (/api|integration|external|vendor/i.test(state.combinedText)) {
    risks.push(
      "• Integration risk — validate interface contracts and integration readiness early."
    );
  }

  if (/security|identity|authentication|authorization/i.test(state.combinedText)) {
    risks.push(
      "• Security/access approval risk — engage security stakeholders early."
    );
  }

  return risks.join("\n");
}


/* ------------------------------------------------------------------
 * Timeline helper
 * ------------------------------------------------------------------ */

function extractTimeline(text) {
  const match = text.match(
    /(\d+)\s*(day|days|week|weeks|month|months|year|years)/i
  );

  if (!match) {
    return {
      phase1: "Phase 1",
      phase2: "Phase 2",
      phase3: "Phase 3",
      phase4: "Phase 4",
      phase5: "Phase 5"
    };
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  let totalWeeks = amount;

  if (unit.includes("day")) {
    totalWeeks = Math.max(1, Math.ceil(amount / 7));
  }

  if (unit.includes("month")) {
    totalWeeks = amount * 4;
  }

  if (unit.includes("year")) {
    totalWeeks = amount * 52;
  }

  const phase = Math.max(1, Math.ceil(totalWeeks / 5));

  return {
    phase1: `Weeks 1–${phase}`,
    phase2: `Weeks ${phase + 1}–${phase * 2}`,
    phase3: `Weeks ${phase * 2 + 1}–${phase * 3}`,
    phase4: `Weeks ${phase * 3 + 1}–${phase * 4}`,
    phase5: `Weeks ${phase * 4 + 1}–${totalWeeks}`
  };
}
