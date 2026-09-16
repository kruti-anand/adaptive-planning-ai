# AI Adaptive Planning

**Turn a rough idea into a clear, personalized, actionable plan.**

## Overview

AI Adaptive Planning is an AI-powered planning engine designed to turn incomplete, ambiguous, or loosely defined requests into structured, actionable plans through dynamic conversational discovery.

Instead of following a predefined questionnaire, the system evaluates the user's request, understands the intended outcome, and determines what information is most important to clarify next.

The goal is:

**Understand → Determine → Ask → Refine → Validate → Plan**

## How It Works

1. **Understand the request**
   Analyze the complete request to identify the user's intent, desired outcome, information already provided, decisions already made, constraints, preferences, and unresolved areas.

2. **Determine what matters**
   Consider the nature of the request and identify the information that could materially affect the eventual plan.

3. **Ask the next best question**
   Select the single most useful question to reduce meaningful uncertainty and improve the resulting plan.

4. **Update the understanding**
   Incorporate the user's answer into the current understanding of the request.

5. **Reassess dynamically**
   After every answer, reconsider what is now known, what remains unresolved, and whether another question would materially improve the plan.

6. **Validate before planning**
   Once the request is sufficiently understood, present the interpreted requirements for the user to review, correct, or refine.

7. **Generate the plan**
   Create the final plan from the validated understanding rather than from assumptions.

## Core Design Principle

> **The AI does not ask a question because a category is missing. It asks because the answer would materially improve the plan.**

There is no fixed question order, predefined questionnaire, or hardcoded sequence of discovery questions.

The next question is determined from the current context and the potential impact of unresolved information.

## Context-Aware Reasoning

The planning engine should recognize the nature of the request and reason about the considerations relevant to that context without relying on a rigid checklist.

For example:

* A travel-related request may require reasoning about destinations, timing, transportation, activities, logistics, preferences, and constraints.
* A software-related request may require reasoning about users, capabilities, requirements, dependencies, technical constraints, and delivery considerations.
* An event-related request may require reasoning about participants, timing, location, scope, logistics, and priorities.
* A personal project may require reasoning about objectives, resources, sequencing, dependencies, and constraints.

These are **examples of reasoning areas, not predefined questions or required categories**.

The AI should determine which considerations are relevant based on the actual request.

## Domain-Neutral by Design

The core adaptive discovery engine is intentionally independent of any single domain.

The same reasoning approach can support:

* Travel planning
* Event planning
* Personal projects
* Career planning
* Home projects
* Education planning
* Business activities
* Purchasing decisions
* Process planning
* Software projects and requirements

Domain-specific capabilities can be added as extensions while keeping the underlying adaptive planning mechanism reusable.

## Planned Architecture

The project will evolve around several core capabilities:

* Intent and outcome identification
* Context and state management
* Adaptive question selection
* Constraint and preference discovery
* Context-aware reasoning
* User review and correction
* Plan generation
* Domain-specific extensions
* AI quality and governance controls

The underlying AI should determine what needs to be clarified rather than relying on hardcoded question sequences.

## Project Status

This project is being developed incrementally as a working prototype.

The initial implementation will establish the adaptive planning experience and reasoning model before expanding into additional domains and production-oriented capabilities.

## Roadmap

* [ ] Define adaptive planning behavior
* [ ] Create the planning prompt and reasoning contract
* [ ] Define the application architecture
* [ ] Build the initial user interface
* [ ] Connect the application to an AI model
* [ ] Implement conversational state management
* [ ] Add user review and correction
* [ ] Generate structured final plans
* [ ] Test across multiple unrelated domains
* [ ] Add domain-specific extensions
* [ ] Add quality, governance, and evaluation capabilities

## Key Principle

**The quality of the final plan depends on understanding the user's intent and asking the right question at the right time — not on asking every possible question.**
