docker compose -f ./db-compose.yml up -d

bun install

bunx migrate dev

bun run dev# booking-app-fullstack-nextjs
