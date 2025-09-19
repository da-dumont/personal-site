---
external: false
title: "Ship Daily or Die Slowly: Why Process Is Killing Your Engineering Team"
previewImage: /images/apocalyptic-office.avif
description: "The fastest shipping teams aren't grinding through 80-hour weeks—they removed the friction. Learn how elite teams ship faster with better quality by deleting processes, not optimizing them."
date: 2025-09-18
---

{% previewimage src="/images/apocalyptic-office.avif" alt="A stark office environment split between traditional corporate processes and modern agile development, symbolizing the transformation from bureaucratic overhead to streamlined shipping practices." /%}

The tech industry in 2025 is different. We all feel it. The days of unlimited budgets and "move fast and break things" have shifted to "deliver value efficiently." Companies are asking harder questions about ROI. Teams are being asked to do more with existing resources.

Is that bad? I'm not sure it is.

The pressure is real, but it's also pushing us to work smarter. Teams can respond to this pressure in two ways. Some will grind harder with longer hours, more meetings, and more process. They'll burn the midnight oil trying to meet impossible demands with the same playbooks. Others will question everything about how to build software. Removing friction instead of adding effort. Shipping faster than ever, with better quality, without destroying their teams.

Those teams discovered something important: the processes we built during the boom years are holding us back.

The fastest shipping teams aren't grinding through 80-hour weeks or following complex processes. They just removed the friction. [Linear runs with 25 engineers](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process) serving 10,000+ companies through radical simplification. Figma hit a $20B valuation with minimal process. [Stripe maintains legendary developer experience](https://stripe.com/guides/atlas/scaling-eng) using small, autonomous teams.

These companies found a playbook that works while keeping people sane.

When I say "removed friction," I mean they deleted most of their processes. Not refined them. Not optimized them. Removed them. And somehow shipped faster with better quality.

## Speed and Quality Aren't Opposites

We've been taught that moving fast means breaking things. Quality requires slowness. Careful planning prevents problems.

I used to believe this, but not anymore.

Remember fixing a bug from three months ago? You stare at code and think "Who wrote this garbage?" Then git blame reveals it was you. You wasted an hour just to remember what this service does. Another hour figuring out that weird decision. There was probably a reason but who knows what it was. Half your day gone before you even start the fix.

The fastest teams maintain high quality because they ship continuously. No time for bugs to accumulate. No distance between code and customers. They ship excellence because perfection takes too long.

A bug fixed immediately takes maybe half an hour? An hour? Give or take. The same bug fixed months later? Well, there goes most of your morning. Finding it, remembering context, understanding implications, testing the fix. When you remove the time gap, speed and quality aren't opposites anymore. They're the same thing.

## Small Teams with Real Autonomy

Amazon's ["two-pizza team"](https://aws.amazon.com/executive-insights/content/amazon-two-pizza-team/)  rule isn't about pizza.

It's about communication overhead. With 3 people, you have 3 communication paths. With 6 people, you have 15 paths. With 10 people, you have 45 paths. Every communication path slows you down. [Research from Stripe, Uber, and Digg's engineering lead](https://review.firstround.com/how-to-size-and-assess-teams-from-an-eng-lead-at-stripe-uber-and-digg/) confirms that teams smaller than 4 people aren't really teams. They're individuals requiring excessive coordination. The sweet spot is somewhere around 5-8 engineers with clear ownership.

But the exact number matters less than the principle. Keep it small enough that you can make a decision without scheduling a meeting about scheduling a meeting. A lot of companies get this wrong. They create small teams but those teams still need six approvals to ship anything. The complexity just moved to coordination overhead.

Real autonomy means full stack ownership from database to user interface. Direct customer access to customers. Deployment independence without waiting for other teams. Outcome accountability where you own the metric, not the task. If you have to ask permission, you don't have autonomy.

## Fat Markers Beat Pixel Perfection

When you have a solid design system like shadcn/ui or MUI, engineers don't need pixel perfect mockups anymore. They need clarity on user intent.

One solid approach is to sketch the user journey on a whiteboard with fat markers. You literally can't obsess over pixels when your pen is an inch wide. Identify what users can do. Define how you know it worked. Let engineers and designers build together.

It's been a while since I've been a hands on IC, but in the past what's worked best was having my designer code alongside me, making adjustments as we went. No handoffs. No "that's not what I meant." Just building. We worked off a napkin sketch and leaned into the framework, and most of all we had something working *fast*.

## JIRA Can Enable Speed (When Used Right)

JIRA is just a tool and tools aren't evil. The problem is how we use it.

When was the last time you looked at a JIRA ticket and thought "this really captures what the customer needs"? Too often we see "As a user, I want to click a button so that a modal appears" with story points that spark 30 minute debates.

[Jason Krohn writes about this](https://www.adaptivealchemist.com/the-futile-chase-for-predictability-in-software-development/) in "The Futile Chase for Predictability in Software Development" where he says story points give us the illusion of predictability while missing what matters: throughput. We spend hours estimating complexity instead of measuring how fast we deliver value.

The key is finding the middle ground. Well written tickets with clear context enable AI powered development now. Engineers paste requirements into Claude or Cursor, and with good repository context, they generate implementation plans. Sometimes even one shot PRs to production.

Here's something we discovered: CLI coding + JIRA context behaves like a solid teammate when you hand it an AGENTS.md file for context. Less drift, cleaner diffs, faster PRs. The AI understands your codebase conventions and the problem you're solving, so it generates code that actually fits your patterns instead of generic solutions.

The sweet spot? Tickets that explain the problem clearly without over-specifying the solution. Something like "Customers need to export contracts as PDFs with redlines visible" gives enough context without dictating implementation. You want enough detail for an LLM to understand the goal, but not so much that you've already designed the solution in the ticket.

[37signals and their Shape Up methodology](https://basecamp.com/shapeup) changed how I think about this. [Ryan Singer explained to Lenny Rachitsky](https://www.lennysnewsletter.com/p/shape-up-ryan-singer) that Shape Up works because it gives teams ownership over implementation details while maintaining strategic control through appetite and problem definition. Define what success looks like and how much time we're willing to spend. Then let teams figure out implementation.

I know a team that replaced story points with a simple question: "Can we ship this in 2 weeks?" If not, break it down. If yes, start building. Their velocity doubled in six weeks because they stopped playing estimation theater and started shipping.

Sometimes I wonder if we like the theater because it feels safer than shipping.

## Parallel Work Streams

Traditional Scrum assumes everyone works on everything.

This can create problems. Context switching destroys focus and coordination overhead consumes energy. Run parallel work streams instead where Team Alpha does customer onboarding improvements and API performance optimization while Team Beta handles search functionality overhaul and web app sync issues. Each stream has a couple engineers plus shared design/product support. They ship independently. They own outcomes completely. They never wait for another stream.

When you eliminate dependencies, you eliminate delays.

## Customer Connection Drives Quality

Requirements documents are lies about the future. By the time you build what was specified, the world changed. You know how this goes. Product spends a bunch of time creating the PRD. Engineering spends two weeks poking holes in it. Design spends a couple of weeks creating mocks. You build exactly to spec and ship it. You watch session recordings and realize customers use it completely differently. That feature you debated for hours? They never noticed. That edge case you spent a week handling? Never happens. Never. Not once. But we built it anyway because it was in the requirements.

Smart teams flip this model. They work with design partners from day one. Give 10 real customers access to half-finished features. Let them complain about the save button that doesn't work yet. Ship them updates every week and watch what changes they actually care about. [Gong built their entire platform this way](https://www.lennysnewsletter.com/p/how-gong-builds-product), converting 11 of their first 12 design partners into paying customers. Not because the product was perfect. Because it solved real problems they helped identify.

This isn't rocket science. It's just good product development. Marty Cagan has been preaching this empowered product team model for years. Build with customers, not for them. Ship to learn, not to launch. Yet most teams still hide behind requirements documents and sprint planning instead of getting real feedback from real users.

The magic happens when you ship daily to people who care enough to complain. Not quarterly releases with 100 features nobody asked for. Daily improvements based on actual usage. Small changes validated by real customers. That compound effect of shipping to design partners beats any amount of internal planning.

When your team feels customer pain directly through constant feedback loops, quality becomes personal. Design partners become your co-creators, not just your validators.

## Use Internal Resourcing for Customer Feedback

Your best customer insights might be sitting ten feet away. Sales teams hear objections every day. Customer Success knows exactly why people churn. Support sees every frustration point. Yet all too often teams treat them like ticket creation machines instead of goldmines of user feedback. Get your engineers listening to customer calls. Let Customer Success show them how customers actually use the product versus how engineering thinks they use it. These teams live in customer reality while engineering often lives in abstraction.

## Ship to Learn, Not to Launch

Shipping isn't the end. It's the beginning of understanding what you're building.

Every deploy teaches you something. That feature that took three weeks to perfect? Nobody uses it. That hack thrown together Friday afternoon becomes the most loved part of the product. You can't predict this stuff, you discover it by shipping.

Teams spend months building elaborate filtering systems with beautiful code and clever algorithms, then watch users ignore them completely. Turns out they just wanted basic search that worked. Two days with a simple prototype would have revealed this, but instead two months went to building the wrong thing perfectly.

Daily shipping creates rapid learning cycles. Each deployment asks a question and the answer comes back in hours, not months or quarters. When something's wrong, you adjust tomorrow. When something works, you double down immediately.

The teams that win don't ship perfect software. They figure out what perfect means while competitors are still debating requirements. By the time everyone else catches up, these teams have tried three approaches and know which one works.

Iteration beats planning because reality beats theory. Every single time.

## Zero Bugs, Maximum Velocity

Teams with zero bugs ship faster than teams with bug backlogs. Sounds backwards, but it's true.

Think about your bug backlog. How many tickets from six months ago just sit there? "Investigate occasional logout issue" or "Button sometimes doesn't work (unable to reproduce)." They'll never get fixed.

[Linear's engineering team](https://linear.app/method) pioneered this approach at scale. [As Sabin Roman, Linear's Engineering Manager, explained](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process), he was initially skeptical. Now he sees it works without overloading engineers. The policy is simple. Bug discovered? Fix it today or close it forever. No bug priorities or backlogs. No P1, P2, P3. Just bug or not bug. Engineers decide what's really a bug.

I'm willing to bet you'll find a bunch of "bugs" that were really feature requests. So, fix the actual bugs ruining customer experiences. Stop spending Tuesday mornings in "bug triage meetings" discussing issues nobody remembered. A fresh bug takes minutes to fix. An old bug takes hours just to understand what the ticket means. [Multiple](https://sookocheff.com/post/process/zero-bug-policy/) [companies](https://www.xolv.io/blog/zero-bug-software-development) report massive velocity improvements after implementing zero-bug policies. Not because they stopped fixing bugs. They stopped managing them.

## Make Deployment Boring

Elite teams deploy constantly. Multiple times per day, including Friday afternoons. Feature flags mean shipping code whenever you want without releasing features. With [canary deployments](https://www.harness.io/blog/blue-green-canary-deployment-strategies), you roll out to a tiny percentage of users first, then expand. Rollback takes one button with no meetings needed and nobody gets blamed.

The [2024 DORA State of DevOps Report](https://kodus.io/en/dora-accelerate-state-of-devops/) shows elite performers deploy multiple times per day with change failure rates under 15%. That's an excellent number.

You should deploy so often that people forget what they shipped yesterday. When a new engineer asks you, "When do you deploy?" wouldn't it be great if your answer was, "When the code is ready."

Every day is deployment day. Every hour can be deployment hour. Make deployment so boring nobody notices. When deployment becomes routine, fear disappears. When fear disappears, speed emerges.

## Getting Started

### Pick the Right Battle

You can't fix a team that doesn't ship by giving them a fancy new process. I've watched teams implement Shape Up, adopt OKRs, try betting tables. All while taking three weeks to deploy a button change.

If your team can't ship something today and see it in production tomorrow, fix that first. Get good at shipping. Then worry about whether you're using sprints or bets or whatever methodology is trending on Hacker News this week.

Process won't save you if you can't ship. It never has and it never will.

### Start Small

You're probably thinking this sounds great but your company would never go for it.

You don't need permission to make your team better though. Start small. Pick your hungriest team for transformation. The ones ready for change, not the ones playing it safe. Delete their bug backlog. Export it to a spreadsheet if you're scared. Archive every ticket over 30 days old. Watch how much lighter everyone feels.

Cancel their planning meetings. Replace that three hour "grooming session" with a 30 minute problem discussion. What problem are we solving? Why does it matter? How will we know we succeeded?

Give them a customer outcome. Something like "help customers find products in under 10 seconds" instead of "implement search." Let them figure out the how.

Measure cycle time from idea to customer value. Forget story points and velocity charts. Track the time from "we should fix this" to "customers are using it."

Be their shield. When someone asks for a status report, you give it. When someone wants an estimate, you handle it. Let them build.

You'll face resistance. Your PM asks about roadmaps. Your manager wants reports. Tell them you're running an experiment to improve delivery speed for a few weeks and see what happens. Usually buys you enough time to show results.

## The Results You Can Expect

Teams using these practices see improvements in cycle time. Big ones. Deployment frequency goes way up and team satisfaction improves. [Y Combinator's analysis](https://www.ycombinator.com/blog/how-to-maintain-engineering-velocity-as-you-scale/) of high growth startups found these patterns hold even while scaling from 10 to 100+ engineers.

When teams ship fast with high quality, customers notice. They feel momentum. They see their feedback implemented in days, not months. They stop complaining about bugs and start asking for features.

Teams that go from monthly releases to daily deployments often see significant NPS improvements. Not because they built more features. They built the right features, validated quickly, and killed the wrong ones fast. Ship, learn, iterate, repeat, every single day.

This approach needs certain things from your organization. Leaders who trust their teams, not just say they do while demanding daily updates. Engineers who see problems and fix them without waiting for tickets. Designers who open pull requests alongside their Figma files. Product managers bringing problems to solve rather than solutions to implement. Organizations measuring customer outcomes instead of counting story points.

Your customers are waiting. They don't care about your velocity charts or your "agile" process.

One thing matters: are you solving their problems or not?

## The Future Is Already Here

The best teams already made this shift. [Linear's Method](https://linear.app/method), [GitLab's async culture](https://handbook.gitlab.com/handbook/company/culture/all-remote/asynchronous/), [Vercel's deployment philosophy](https://vercel.com/blog/accelerating-developer-velocity-and-creating-high-impact-web-teams). They didn't find some secret hack. They removed barriers between idea and impact.

Ready to try something different? Start with one team, one bet, one outcome. Protect them from process and see what happens. The results might surprise you.

The choice is simple. Ship daily and learn constantly, or keep planning while others ship.

I know which one I'm choosing.

## References & Further Reading

- [Shape Up: Stop Running in Circles and Ship Work that Matters](https://basecamp.com/shapeup) - Ryan Singer & 37signals
- [Linear Method: Principles for Building](https://linear.app/method)
- [The Futile Chase for Predictability in Software Development](https://www.adaptivealchemist.com/the-futile-chase-for-predictability-in-software-development/) - Jason Krohn
- [Move Fast with Little Process: Linear's Engineering Approach](https://newsletter.pragmaticengineer.com/p/linear-move-fast-with-little-process)
- [How to Size and Assess Teams](https://review.firstround.com/how-to-size-and-assess-teams-from-an-eng-lead-at-stripe-uber-and-digg/)
- [DORA Metrics and the 2024 State of DevOps](https://kodus.io/en/dora-accelerate-state-of-devops/)
- [Google's Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)
- [GitLab's Guide to Asynchronous Work](https://handbook.gitlab.com/handbook/company/culture/all-remote/asynchronous/)
- [Y Combinator: How to Maintain Engineering Velocity as You Scale](https://www.ycombinator.com/blog/how-to-maintain-engineering-velocity-as-you-scale/)