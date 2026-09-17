/*
 * AI Travel Plan Assistant
 *
 * Zero-cost MVP travel planning engine.
 * Collects the key information needed to create a personalized trip plan.
 */

export function generatePlanningResponse(messages) {
  const conversation = normalizeMessages(messages);

  const userMessages = conversation
    .filter((message) => message.role === "user")
    .map((message) => message.text);

  if (userMessages.length === 0) {
    return {
      type: "question",
      message: "Where would you like to travel?",
      why_it_matters:
        "The destination gives us the starting point for your trip plan."
    };
  }

  if (userMessages.length === 1) {
    return question(
      "When are you planning to travel, and how long would you like the trip to be?",
      "Dates and trip length help determine what can realistically fit into the itinerary."
    );
  }

  if (userMessages.length === 2) {
    return question(
      "Who will be traveling with you?",
      "The travelers' ages, group size, and needs can significantly affect activities, transportation, and pacing."
    );
  }

  if (userMessages.length === 3) {
    return question(
      "What are the most important things you want from this trip? For example: scenery, culture, history, outdoor activities, relaxation, food, or a mix.",
      "Your priorities help shape the itinerary around what you actually enjoy rather than creating a generic tourist itinerary."
    );
  }

  if (userMessages.length === 4) {
    return question(
      "What is your approximate budget, and are there any important travel constraints or preferences I should consider?",
      "Budget and constraints help keep the recommendations practical for your situation."
    );
  }

  if (userMessages.length === 5) {
    return {
      type: "complete",
      message:
        "I have the key information I need to create your initial travel plan. Review your answers and select Generate Plan when you're ready.",
      why_it_matters:
        "The destination, timing, travelers, priorities, and constraints provide the foundation for a personalized itinerary."
    };
  }

  return {
    type: "plan",
    message: buildTravelPlan(userMessages),
    why_it_matters:
      "The itinerary was created from the travel information you provided."
  };
}

function question(message, why) {
  return {
    type: "question",
    message,
    why_it_matters: why
  };
}

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

function buildTravelPlan(userMessages) {
  const destination = userMessages[0];
  const timing = userMessages[1];
  const travelers = userMessages[2];
  const priorities = userMessages[3];
  const constraints = userMessages[4];

  return `
TRAVEL PLAN

DESTINATION
${destination}

TRIP TIMING
${timing}

TRAVELERS
${travelers}

TRIP PRIORITIES
${priorities}

BUDGET & CONSTRAINTS
${constraints}

ITINERARY APPROACH

Build the trip around the priorities identified above while maintaining a
comfortable pace and allowing flexibility for travel time and unexpected
changes.

RECOMMENDED STRUCTURE

• Arrival and orientation
• Core destination experiences
• Priority activities based on the traveler's interests
• Flexible time for exploration or rest
• Departure planning

TRANSPORTATION

Evaluate the most practical combination of flights, rental car, public
transportation, tours, or private transportation based on the destination,
group, budget, and itinerary.

ACCOMMODATION

Prioritize locations that reduce unnecessary travel time and provide convenient
access to the activities included in the itinerary.

BOOKING PRIORITIES

• Transportation
• Accommodation
• High-demand activities or tours
• Rental car or other required transportation
• Any activities requiring advance reservations

NEXT STEPS

1. Confirm dates and availability.
2. Establish the preferred itinerary structure.
3. Research transportation and accommodation options.
4. Reserve time-sensitive activities.
5. Finalize the day-by-day itinerary.
`.trim();
}
