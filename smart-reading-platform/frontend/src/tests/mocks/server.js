import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Define the mock response for your endpoints
export const server = setupServer(
  rest.get('http://localhost:5000/reading-list', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          book_id: '123',
          status: 'Completed',
        },
      ])
    );
  }),
  rest.get('http://localhost:5000/user/goal', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ goal: 10 }));
  }),
  // Add other necessary mocks for POST, PUT, DELETE here...
);