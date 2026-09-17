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

```
const label = document.createElement("span");
label.className = "message-label";
label.textContent = message.role === "user" ? "You" : "AI";

const content = document.createElement("div");
content.textContent = message.text;

messageElement.appendChild(label);
messageElement.appendChild(content);

conversation.appendChild(messageElement);
```

});
}

async function callPlanningEngine() {
try {
setLoading(true);

```
const response = await fetch("/api/plan", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    messages: state.messages
  })
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || "The planning engine could not process the request.");
}

return data.response;
```

} catch (error) {
console.error(error);

```
addMessage(
  "ai",
  "I’m unable to connect to the planning engine right now. Please check the application configuration and try again."
);

return null;
```

} finally {
setLoading(false);
}
}

async function startPlanning() {
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

const aiResponse = await callPlanningEngine();

if (aiResponse) {
addMessage("ai", aiResponse);
}
}

async function submitResponse() {
const response = responseInput.value.trim();

if (!response) {
responseInput.focus();
return;
}

addMessage("user", response);

responseInput.value = "";

const aiResponse = await callPlanningEngine();

if (aiResponse) {
addMessage("ai", aiResponse);
}
}

function showCompletion() {
state.status = "complete";
showView(completionView);
}

function addDetails() {
state.status = "conversation";
showView(conversationView);
responseInput.focus();
}

async function generatePlan() {
addMessage(
"user",
"The user has chosen to proceed with the final plan."
);

const aiResponse = await callPlanningEngine();

if (!aiResponse) {
return;
}

state.status = "plan";
showView(planView);

finalPlan.innerHTML = "";

const heading = document.createElement("h2");
heading.textContent = "Final Plan";

const content = document.createElement("div");
content.textContent = aiResponse;

finalPlan.appendChild(heading);
finalPlan.appendChild(content);
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
addDetailsButton.addEventListener("click", () => {
state.status = "conversation";
showView(conversationView);
responseInput.focus();
});
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
