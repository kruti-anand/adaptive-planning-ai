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

/*
AI integration will determine the first question.

```
This application must not contain a hardcoded question sequence.
The planning engine will eventually receive the current request
and conversation state and return the next best question.
```

*/

addMessage(
"ai",
"Your request has been received. The adaptive planning engine will determine what information is most useful to clarify next."
);
}

function submitResponse() {
const response = responseInput.value.trim();

if (!response) {
responseInput.focus();
return;
}

addMessage("user", response);

responseInput.value = "";

/*
AI integration will evaluate the updated planning state and determine
whether another question is needed or whether discovery is complete.

```
No domain-specific question logic belongs here.
```

*/
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

function generatePlan() {
state.status = "plan";
showView(planView);

finalPlan.innerHTML = `     <h2>Final Plan</h2>     <p>
      The AI planning engine will generate the validated plan here.     </p>
  `;
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
