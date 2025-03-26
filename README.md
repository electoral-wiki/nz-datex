# New Zealand Data Extractor

Utilities for extracting and parsing NZ data.

## Running the Code

This program uses [bun].

```bash
# install dependencies
bun install

# start the development database
bun run dev:run
bun run prisma migrate dev

# run it
bun start                 # start the server
bun run src/jobs/$job.ts  # run a job
```

[bun]: https://bun.sh
