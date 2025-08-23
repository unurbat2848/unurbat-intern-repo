
## What is CI/CD and Why is it Used?

CI/CD stands for Continuous Integration and Continuous Delivery (or Deployment). It's a set of practices and tools that help developers automatically build, test, and deliver code changes more frequently and reliably. With CI, every time you push code, automated tests and builds run to catch issues early. CD takes it a step further by automatically deploying the code to production or staging environments after it passes all checks.

I think CI/CD is important because it speeds up development, reduces manual errors, and makes it easier to release new features or fixes. It also gives teams confidence that their code works as expected, since everything is tested and deployed in a consistent, repeatable way.

I created markdown-lint-spellcheck yml file in github workflow and configured to spellcheck automatically for my repos each pull request.
![alt text](image.png)
then I installed husky for experiment git hooks
![alt text](image-1.png)

**What is Husky?**
Husky is a tool that makes it easy to use Git hooks in your project. With Husky, you can automatically run scripts like linters or tests before you commit or push code. I think it's really useful because it helps catch issues early and keeps your codebase clean by making sure everyone follows the same rules before changes are saved to the repository.

After installed and initialized the husky, I configured git hook for husky 
![alt text](image-2.png)

Then I configured lit-staged in my packege.json
![alt text](image-3.png)

After configured husky it run and checked all my test files after when I create commit 
![alt text](image-4.png)

Then I pushed all my changes to new branch and github workflow checked all spelling and lint issue 
![alt text](image-5.png)
# CI/CD Reflections

**What is the purpose of CI/CD?**
The purpose of CI/CD is to automate the process of building, testing, and deploying code so that changes can be delivered quickly and reliably. It helps catch issues early, ensures code quality, and makes it easier to release new features or fixes without manual steps.

**How does automating style checks improve project quality?**
Automating style checks ensures that all code follows the same standards, which makes the codebase more consistent and easier to read. It also helps catch errors and bad practices before they make it into the main branch, reducing bugs and technical debt.

**What are some challenges with enforcing checks in CI/CD?**
Some challenges include configuring the tools correctly, dealing with false positives or overly strict rules, and making sure all contributors have the same setup. Sometimes, checks can slow down the workflow if they take too long or block progress for minor issues.

**How do CI/CD pipelines differ between small projects and large teams?**
In small projects, CI/CD pipelines are usually simpler and faster, with fewer checks and steps. In large teams, pipelines can be more complex, with multiple stages, parallel jobs, and stricter requirements to handle more contributors and ensure high code quality across the whole team.
