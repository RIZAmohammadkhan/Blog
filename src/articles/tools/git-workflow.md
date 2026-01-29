---
title: Git Workflow for Teams
readTime: 10 min
date: 2025-12-28
tags: git, workflow
image: /images/tools-git.jpg
---


## Feature Branch Workflow

```bash
# Start new feature
git checkout -b feature/amazing-thing

# Work, commit, push
git add .
git commit -m "Add amazing thing"
git push origin feature/amazing-thing

# Create PR, review, merge
```

## Commit Message Convention

```
feat: add new feature
fix: resolve bug
docs: update documentation
refactor: improve code structure
test: add or update tests
chore: maintenance tasks
```

## Best Practices

1. **Keep commits atomic** - One change per commit
2. **Write clear messages** - Future you will thank you
3. **Review before pushing** - `git diff --staged`
4. **Rebase for clean history** - When appropriate
