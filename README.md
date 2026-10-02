# Internship Signal

A public, reproducible TinyFish internship research build for U.S. software engineering and AI roles in summer 2027.

## Run locally

Requires Python 3, with no package installation or API key needed to view the saved comparison.

```sh
cd internship-signal
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Open http://127.0.0.1:4173/. The static app loads `dist/results.json`, displays a five-company table, expands eligibility and browser-agent evidence, opens domain-scoped public web searches, and generates a personalized TinyFish discovery prompt.

## Re-run the research

1. Connect the TinyFish app in ChatGPT, with a TinyFish account and sufficient credits.
2. Use the page's discovery prompt. Search Greenhouse, Ashby, Workday, and YC separately to prevent a single source from dominating the results.
3. Give each official listing URL to a TinyFish browser agent with `dist/verification-prompt.txt`. Alternatively, paste the URL and prompt into the Agent Playground at https://agent.tinyfish.ai/.
4. Wait for every agent run to finish. Exclude closed roles, unverified seasons, and non-U.S. roles from the confirmed comparison. Preserve nulls when information is absent.
5. Select five companies and update `dist/results.json` with exact titles, locations, canonical URLs, requirements, observed application-state evidence, and run URLs. Update the visible checked date in `dist/index.html` when refreshing the snapshot.
6. Serve or publish the entire `dist` directory. No secrets belong in these static files.

## Access and architecture

- The public site contains a saved research snapshot, external search links, and prompt generation. It does not invoke paid TinyFish calls from visitors' browsers.
- TinyFish searches and verification were performed through the connected TinyFish app in this chat. They were not run by this site's front end or through the Playground UI.
- Greenhouse: inspect the exact employer board; redirects may lead to the employer's website.
- Ashby: use the browser agent when extraction is empty. Notion's listing needed that fallback and was readable without sign-in.
- Workday: use employer-specific career sites. Public listing access does not establish the ability to submit an application without an account.
- YC: search both ycombinator.com/companies and workatastartup.com. Public job details and candidate application access differ.
- Sites connector eligibility discovery was unavailable in this environment; the app therefore does not claim a live TinyFish server integration.

## Monitor

The user authorized a daily TinyFish Monitor for Salesforce's public careers page at 9 a.m. America/New_York. Creation and baseline completed. It costs $0.005 per completed run. It watches visible page content, not an exhaustive crawl; the baseline contained the first 20 of 1,530 results. Email notification delivery was not established by the API response. This monitor does not automatically rewrite the published comparison.

## Submission

Use the successful public Sites URL as the build/results link. The LinkedIn draft is in the workspace's `linkedin-post.txt`; publishing it and selecting the TinyFish company mention are separate steps. The contest submission portal was not provided.

## Files

- `dist/index.html`, `styles.css`, `app.js`: public app.
- `dist/results.json`: normalized comparison and verification evidence.
- `dist/agent-evidence.json`: completed browser-agent outputs from the research.
- `dist/verification-prompt.txt`, `dist/setup.txt`: reproducible workflow.
- `.openai/hosting.json`: Sites identity and static hosting configuration.
