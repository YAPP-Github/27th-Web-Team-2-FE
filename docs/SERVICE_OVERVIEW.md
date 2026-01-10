# Service Overview

## What is this service?

This service is a voting-based scheduling tool designed to help small groups

The host selects a candidate date to create a meeting voting link
Participants access voting through shared links, and vote on every possible date.
The results of the vote are aggregated and visualized in the Calendar view,
Make it easier for groups to identify the most likely dates.

This service focuses on clarity and speed rather than making a final decision.

---

## Target Range (MVP Phase 1)

The first MVP focuses solely on **date coordination** for smaller groups such as:

- Friends
- acquaintances
- a club or informal gathering

MVPs intentionally limit their capabilities to reduce complexity
It enables quick decision making.

Future expansion (e.g., location selection, voting closing)
It should not be considered when defining requirements as it is explicitly out of scope.

---

## core value proposition

This service prioritizes **quick sorting** over perfect agreement.

- Fairness ❌ → Speed ⭕
- Rich Features ❌ → Clear and Minimal Flow ⭕

The system provides visibility into the results of the vote,
However, they are not trying to resolve the conflict or finalize the outcome.

---

## User roles

### Host

- Create a meeting by defining a meeting name and candidate date
- Share the created meeting link with others

The host does not have **special privileges** after the meeting has been created.

The host accesses the meeting only through a shared link
And you have to use the same flow to vote
And under the same constraints as the other participants.

### Participants

- Join the meeting through a shared link
- Enter a name as an identifier
- Select all available dates
- You can modify your own vote if necessary

There is no functional distinction between the host and the participant
after meeting Changjo.

---

## interaction model

When a meeting link is created:

- All users access the meeting through the same entry point
- All users follow the same voting flow
- No role-based UI, permissions, or controls exist

The concept of "host" applies only at the moment of meeting creation.

---

## Key Concepts and Terms

- **Meeting**: Containers for single schedule voting
- **Host**: users creating meetings (creative-only roles)
- **Participant**: Users Voting on Available Dates
- **Candidate Date**: Date Participants Can Vote
- **Vote**: Participants selected at least one candidate date

All specifications should use these terms consistently.
