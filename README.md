# Proton
[//]: <### ![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/release/atom)>
[//]: <todo: badge + workflows + banner>
Completely modular API library for [Atomic](github.com/arlojay-studios/atomic).   

Provides a user database where we track how many total unique users we have by UUID

## Current API Modules
### [core.ts](github.com/arloay-studios/proton/blob/main/core.ts) 
```typescript
protonDB(dbPath) /* The user database for Atomic - Handles clientIDs */
protonUUID() /* The clientID dispatcher and validator */
```

## NPM Package
Our npm package is hosted on github's npm package repository, as it is still in development, and cannot be installed directly.