import { generatePlanningResponse } from "./planner.js";

const state = {
  initialRequest: "",
  messages: [],
  status: "start"
};

const startView = document.getElementById("start-view");
const conversationView = document.getElementById("conversation-view");
const completionView = document.getElementById("completion-view");
const planView = document.getElementById("plan-view");

const requestInput = document.getElementById("request-input");
const responseInput = document.getElementById("response-input");
const conversation = document.getElementById("conversation");
const finalPlan = document.getElementById("final-plan");

const startPlanningButton = document.getElementById("start-planning");
const submitResponseButton = document.getElementById("submit-response");
const addDetailsButton = document.getElementById("add-details");
const generatePlanButton = document.getElementById("generate-plan");

function showView(view) {
  startView.classList.add("hidden");
  conversationView.classList.add("hidden");
  completionView.classList.add("hidden");
  planView.classList.add("hidden");

  view.classList.remove("hidden");
}

function addMessage(role, text) {
  state.messages.push({
    role,
    text
  });

  renderConversation();
}

function renderConversation() {
  conversation.innerHTML = "";

  state.messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${message.role}`;

    const label = document.createElement("span");
    label.className = "message-label";
    label.textContent = message.role === "user" ? "You" : "AI";

    const content = document.createElement("div");
    content.textContent = message.text;

    messageElement.appendChild(label);
    messageElement.appendChild(content);

    conversation.appendChild(messageElement);
  });

  conversation.scrollTop = conversation.scrollHeight;
}

function callPlanningEngine() {
  try {
    setLoading(true);

    const result = generatePlanningResponse(state.messages);

    if (!result || !result.type || !result.message) {
      throw new Error("The planning engine returned an invalid response.");
    }

    return result;
  } catch (error) {
    console.error(error);

    addMessage(
      "ai",
      "I’m unable to create the travel plan right now. Please try again."
    );

    return null;
  } finally {
    setLoading(false);
  }
}

function handlePlanningResponse(result) {
  if (!result) {
    return;
  }

  if (result.type === "question") {
    state.status = "conversation";

    let message = result.message;

    if (result.why_it_matters) {
      message += `\n\nWhy this matters: ${result.why_it_matters}`;
    }

    addMessage("ai", message);
    responseInput.focus();
    return;
  }

  if (result.type === "complete") {
    state.status = "complete";

    if (result.message) {
      addMessage("ai", result.message);
    }

    showView(completionView);
    return;
  }

  if (result.type === "plan") {
    state.status = "plan";

    showView(planView);

    finalPlan.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = "Final Travel Plan";

    const content = document.createElement("div");
    content.textContent = result.message;

    finalPlan.appendChild(heading);
    finalPlan.appendChild(content);
  }
}

function startPlanning() {
  const request = requestInput.value.trim();

  if (!request) {
    requestInput.focus();
    return;
  }

  state.initialRequest = request;
  state.messages = [];
  state.status = "conversation";

  showView(conversationView);

  addMessage("user", request);

  const result = callPlanningEngine();

  handlePlanningResponse(result);
}

function submitResponse() {
  const response = responseInput.value.trim();

  if (!response) {
    responseInput.focus();
    return;
  }

  addMessage("user", response);

  responseInput.value = "";

  const result = callPlanningEngine();

  handlePlanningResponse(result);
}

function addDetails() {
  state.status = "conversation";

  showView(conversationView);

  responseInput.focus();
}

function generatePlan() {
  addMessage("user", "Proceed with the final plan.");

  const result = callPlanningEngine();

  handlePlanningResponse(result);
}

function setLoading(isLoading) {
  startPlanningButton.disabled = isLoading;
  submitResponseButton.disabled = isLoading;
  addDetailsButton.disabled = isLoading;
  generatePlanButton.disabled = isLoading;

  responseInput.disabled = isLoading;
  requestInput.disabled = isLoading;
}

startPlanningButton.addEventListener("click", startPlanning);
submitResponseButton.addEventListener("click", submitResponse);
addDetailsButton.addEventListener("click", addDetails);
generatePlanButton.addEventListener("click", generatePlan);

requestInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    startPlanning();
  }
});

responseInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    submitResponse();
  }
});
