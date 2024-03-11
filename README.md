![pageform_thumbnail](https://github.com/Kliton/yt_pageform/assets/10452377/610b5935-5afd-4126-9dfd-a7064e18a0db)

[Discord server for problems/help](https://discord.gg/Gc3ShuJrYE)

[Youtube video](https://youtu.be/QGXUUXy0AMw)

[LIVE DEMO](https://yt-pageform.vercel.app/)

In this 4 hour tutorial we are going to build this full stack PageForm application.

We are going to build this with:

- Nextjs 13 with AppRouter
- Dnd-kit library
- ServerActions
- Typescript
- Tailwindcss / Shadcn UI
- Vercel MongoDB
- Prisma as ORM

Features:

- Responsive
- Create forms with a stunning drag and drop designer
- Layout fields: Title, SubTitle, Spacer, Separator, Paragraph
- Form fields: Text, Number, Select, Date, Checkbox, Textarea
- Is easy to add and customize new fields
- Form preview dialog
- Share form url
- Form submission/validation
- Form stats: visits and submissions

Installing The Packages:

```bash
# Installing the Packages
npm install --save @clerk/nextjs@^4.23.5 @dnd-kit/core@^6.0.8 @hookform/resolvers@^3.3.1 @prisma/client@^5.3.1  @radix-ui/react-accordion@^1.1.2 @radix-ui/react-alert-dialog@^1.0.4 @radix-ui/react-aspect-ratio@^1.0.3 @radix-ui/react-avatar@^1.0.3 @radix-ui/react-checkbox@^1.0.4 @radix-ui/react-collapsible@^1.0.3 @radix-ui/react-context-menu@^2.1.4 @radix-ui/react-dialog@^1.0.4 @radix-ui/react-dropdown-menu@^2.0.5 @radix-ui/react-hover-card@^1.0.6 @radix-ui/react-icons@^1.3.0 @radix-ui/react-label@^2.0.2 @radix-ui/react-menubar@^1.0.3 @radix-ui/react-navigation-menu@^1.1.3 @radix-ui/react-popover@^1.0.6 @radix-ui/react-progress@^1.0.3 @radix-ui/react-radio-group@^1.1.3 @radix-ui/react-scroll-area@^1.0.4 @radix-ui/react-select@^1.2.2 @radix-ui/react-separator@^1.0.3 @radix-ui/react-slider@^1.1.2 @radix-ui/react-slot@^1.0.2 @radix-ui/react-switch@^1.0.3 @radix-ui/react-tabs@^1.0.4 @radix-ui/react-toast@^1.1.4 @radix-ui/react-toggle@^1.0.3 @radix-ui/react-tooltip@^1.0.6 class-variance-authority@^0.7.0 clsx@^2.0.0 cmdk@^0.2.0 date-fns@^2.30.0 eslint@8.49.0 eslint-config-next@13.4.19 next-themes@^0.2.1 nextjs-toploader@^1.4.2 prettier@^3.0.3 react-confetti@^6.1.0 react-day-picker@^8.8.2 react-hook-form@^7.46.1 react-icons@^4.11.0 tailwind-merge@^1.14.0 tailwindcss-animate@^1.0.7 zod@^3.22.2
```

Adding Vercel Speed Insight:

```bash
npm i @vercel/speed-insights
import { SpeedInsights } from "@vercel/speed-insights/next"
```

Table for Mongodb Connection of Prisma:

```bash
model Form {
  id              String            @id @default(auto()) @map("_id") @db.ObjectId
  userId          String
  createdAt       DateTime          @default(now())
  published       Boolean           @default(false)
  name            String
  description     String            @default("")
  content         String            @default("[]")
  visits          Int               @default(0)
  submissions     Int               @default(0)
  shareURL        String            @unique @default(uuid())
  FormSubmissions FormSubmissions[]

  @@unique([name, userId])
}

model FormSubmissions {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  formId    String
  form      Form     @relation(fields: [formId], references: [id])

  content String
}
```
