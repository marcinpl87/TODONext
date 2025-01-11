# TODO Next

A simple TODO app to organize tasks and projects by allowing users to create, manage, and prioritize their projects and individual todos efficiently.

## Getting Started

First, run the development server:

```bash
$ npm run dev
```

To run it on VirtualBox:

```bash
$ npm run dev -- -H 10.0.2.15
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Next.js Installation & Configuration

### 1. Install Next.js

```bash
$ npx create-next-app@latest
```

### 2. Install Prettier

```
$ npm install --save-dev @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier prettier
```

### 3. Copy .eslintrc.json and .prettierrc.json files

### 4. Set VsCode workspace settings

```
Editor: Format On Save Mode - checked
Editor: Default Formatter - set to Prettier
```

## DB tables structure

```
CREATE TABLE "public"."user" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" varchar,
    "pass" varchar,
    "creationTimestamp" timestamp DEFAULT NOW()
);
```

```
CREATE TABLE "public"."project" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" uuid,
    "title" varchar,
    "description" text,
    "creationTimestamp" timestamp DEFAULT NOW()
);
```

```
CREATE TABLE "public"."todo" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" uuid,
    "projectId" uuid,
    "title" varchar,
    "description" text,
    "subtasks" jsonb,
    "creationTimestamp" timestamp DEFAULT NOW(),
    "estimatedTime" integer DEFAULT 0,
    "isDone" boolean DEFAULT false,
    "doneTimestamp" timestamp DEFAULT null
);
```
