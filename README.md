# Procrastination Simulator

A simple interactive webpage exploring how deadline pressure, distractions, and self-reported focus combine into five states: **Calm, Procrastination, Pressure, Focus, and Panic**.

This repository preserves four working iterations from the development conversation. Each folder is an independent snapshot of the webpage as it actually existed at that point, with its own HTML, CSS, and JavaScript. **`version4-final` is the final prototype.**

## Run any version

Open that folder’s `index.html` in a browser. No installation, build step, account, or server is needed. Keep `styles.css` and `script.js` beside `index.html`.

For example, open `version1-basic-logic/index.html` for the original experience or `version4-final/index.html` for the final prototype.

## Iterations

| Folder | What changed |
| --- | --- |
| [`version1-basic-logic/`](version1-basic-logic/) | First working version: manual deadline slider, High Distractions checkbox, and Low/High Focus radio buttons. Slider values below 50 mean far away; 50 and above mean coming soon. Shows the five states and their original descriptive messages. |
| [`version2-real-deadline/`](version2-real-deadline/) | Replaced the slider with a task input and actual deadline date/time. Calculates time remaining and urgency automatically using the device’s local time. Keeps the original distractions checkbox and Focus radio buttons. |
| [`version3-distraction-checkins/`](version3-distraction-checkins/) | Replaced the distractions checkbox with “What are you doing right now?” check-ins: Working, Check phone, Watch one video, or Get a snack. Two or more distraction choices in the latest three answers produce High Distractions. Includes Test check-in and increasingly frequent automatic prompts. Focus remains self-reported; state messages are still the earlier descriptive ones. |
| [`version4-final/`](version4-final/) | Final prototype: keeps the real deadline, automatic urgency, check-in-based distractions, and Focus radio buttons. Adds motivational messages tailored to each state and a subtle Mobile Reminder Concept section explaining the future phone reminder idea. |

## Preserved behavior

- For the original binary deadline rules, a far-away deadline gives Calm with Low Distractions or Procrastination with High Distractions, regardless of Focus.
- An urgent deadline gives Focus when distractions are low and focus is high; Panic when distractions are high and focus is low; otherwise Pressure.
- From version 2 onward, more than 3 days means Plenty of time; 24 hours through 3 days means Getting closer; less than 24 hours means Coming soon; a reached or passed deadline means Overdue. Coming soon and Overdue feed the urgent state rules.
- In versions 3 and 4, distractions start Low. Before three check-ins exist, available answers are used, with at least two distraction answers still required for High. Only the latest three answers count.
- Automatic check-ins run while the page is open: about every 8 hours with more than 3 days left, every 4 hours with more than 24 hours through 3 days left, and every 2 hours within 24 hours or overdue. Test check-in opens the same prompt immediately.
- Task/deadline entries and check-in history are not saved across reloads. The Mobile Reminder Concept describes a future extension; the prototype has no phone alarm or notification integration.

## Historical provenance

All four versions were recovered **exactly**, without reconstruction, from the saved Git history of the original Site project. For every version, `dist/index.html`, `dist/styles.css`, and `dist/script.js` were extracted from the source commit below and placed directly into the corresponding folder. Their contents were preserved byte for byte, including the original appearance, messages, rules, and interactions. Only their containing paths changed.

These are original development-source commit IDs, not commits in this GitHub repository:

| Version | Original source commit |
| --- | --- |
| 1 — Basic Logic | `2d2b708d927178221893a531dc59ea66da796ec2` |
| 2 — Real Deadline | `4243d73e8b4cd640fb85497b43e80d7c8fe49275` |
| 3 — Distraction Check-ins | `b2902cf7df3e29e841f70349348e06ff1f5f7435` |
| 4 — Final | `099501eba054eb2942f763a66a26cdd02de7d7bd` |

No historical version was rebuilt from the final code or updated to newer behavior. Hosting metadata is excluded because each snapshot runs directly in the browser.

## Validation

All 12 webpage files were compared byte for byte with their original Git objects. Each version’s own `index.html` was opened and tested independently through an isolated localhost preview serving only that folder, with its own stylesheet and script. Direct `file://` navigation was blocked by the testing browser’s URL policy, so direct-file launch was not browser-verified.

- Versions 1 and 2: all eight deadline/distractions/focus combinations passed.
- Version 2: all four urgency categories and remaining-time messages were checked.
- Version 3: all four check-in choices, the rolling three-answer window, High-to-Low changes, and state updates were checked; the original descriptive messages and absence of the final concept section were preserved.
- Version 4: all five state names and motivational messages were checked through its own controls, along with the Mobile Reminder Concept section.
- The original styling was visually checked in each page. Screenshots and temporary preview/test data are kept outside this repository; the version folders contain only the unchanged working webpage files.
