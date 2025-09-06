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

## Sync Vercel ENV variables

### 1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables and add a new variable

### 2. Sync variables to your localhost

```bash
$ vercel env pull .env.development.local
```

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

```
CREATE TABLE "public"."tenant" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "creationTimestamp" timestamp DEFAULT NOW(),
    "name" varchar,
    "senderName" text,
    "idNumber" varchar,
    "nationalInsuranceNumber" varchar,
    "birthDate" varchar,
    "email" varchar,
    "phone" varchar,
    "address" varchar,
    "roomId" uuid,
    "apartmentId" uuid,
    "rent" integer,
    "rentFirstMonth" varchar,
    "rentFirstRent" integer,
    "deposit" integer,
    "account" varchar,
    "accountDeposit" varchar,
    "iceName" varchar,
    "iceLastname" varchar,
    "iceIdNumber" varchar,
    "iceNationalInsuranceNumber" varchar,
    "iceEmail" varchar,
    "icePhone" varchar,
    "iceAddress" varchar,
    "insuranceName" varchar,
    "insuranceNumber" varchar,
    "insuranceDate" varchar,
    "contractDate" varchar,
    "contractDateStart" varchar,
    "contractDateEnd" varchar,
    "contractDateHandoff" varchar,
    "notes" text,
    "isContract" boolean DEFAULT false,
    "isDeposit" boolean DEFAULT false,
    "is1stRent" boolean DEFAULT false,
    "isInsurance" boolean DEFAULT false,
    "isWarranty" boolean DEFAULT false,
    "isKey" boolean DEFAULT false,
    "isProtocol" boolean DEFAULT false,
    "status" integer
);
```

```
CREATE TABLE "public"."property" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "creationTimestamp" timestamp DEFAULT NOW(),
    "name" varchar,
    "address" varchar,
    "floor" integer,
    "code" varchar,
    "wifiSsid" varchar,
    "wifiPass" varchar,
    "rooms" integer,
    "lockIn" varchar,
    "lockOut" varchar,
    "safe" varchar,
    "insuranceName" varchar,
    "insuranceDate" varchar,
    "insuranceNumber" varchar,
    "notes" text
);
```

```
CREATE TABLE "public"."transaction" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "creationTimestamp" timestamp DEFAULT NOW(),
    "dateTimestamp" timestamp NULL DEFAULT NULL,
    "dateTransaction" varchar,
    "dateAccounting" varchar,
    "sender" varchar,
    "receiver" varchar,
    "title" varchar,
    "value" integer,
    "currency" varchar,
    "value2" integer,
    "currency2" varchar,
    "senderAccount" varchar,
    "receiverAccount" varchar,
    "categoryId" uuid
);
```

```
CREATE TABLE "public"."transaction_category" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" varchar,
    "color" varchar
);
```

```
CREATE TABLE "public"."transaction_rule" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "transactionColumn" integer,
    "relation" integer,
    "value" text,
    "categoryId" uuid
);
```

```
CREATE TABLE "public"."bank_transaction" (
    "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    "creationTimestamp" timestamp DEFAULT NOW(),
    "dateTimestamp" timestamp NULL DEFAULT NULL,
    "amount" numeric(12, 2),
    "amountCustom" numeric(12, 2),
    "receiver" varchar,
    "description" text,
    "descriptionCustom" text,
    "categoryId" uuid,
    "isManual" boolean DEFAULT false,
    "isHidden" boolean DEFAULT false
);
```
