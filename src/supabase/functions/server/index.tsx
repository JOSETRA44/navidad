import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

// Create a new time capsule
app.post('/make-server-62ab3e05/capsules', async (c) => {
  try {
    const body = await c.req.json();
    const { username, password, message, openDateTime } = body;

    if (!username || !password || !message || !openDateTime) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const capsule = {
      id: Date.now().toString(),
      username,
      password,
      message,
      openDateTime,
      createdAt: new Date().toISOString(),
      opened: false,
    };

    await kv.set(`capsule:${capsule.id}`, capsule);

    return c.json({ success: true, capsule: { ...capsule, password: undefined } });
  } catch (error) {
    console.log(`Error creating capsule: ${error}`);
    return c.json({ error: 'Failed to create capsule' }, 500);
  }
});

// Get all capsules for a user
app.get('/make-server-62ab3e05/capsules', async (c) => {
  try {
    const username = c.req.query('username');
    
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    const allCapsules = await kv.getByPrefix('capsule:');
    const userCapsules = allCapsules
      .filter((capsule: any) => capsule.username === username)
      .map((capsule: any) => ({ ...capsule, password: undefined }));

    return c.json({ capsules: userCapsules });
  } catch (error) {
    console.log(`Error fetching capsules: ${error}`);
    return c.json({ error: 'Failed to fetch capsules' }, 500);
  }
});

// Unlock a capsule
app.post('/make-server-62ab3e05/capsules/:id/unlock', async (c) => {
  try {
    const id = c.req.param('id');
    const { password } = await c.req.json();

    if (!password) {
      return c.json({ error: 'Password is required' }, 400);
    }

    const capsule = await kv.get(`capsule:${id}`);

    if (!capsule) {
      return c.json({ error: 'Capsule not found' }, 404);
    }

    const openTime = new Date(capsule.openDateTime);
    const now = new Date();

    if (now < openTime) {
      return c.json({ error: 'Capsule is not ready to be opened' }, 403);
    }

    if (capsule.password !== password) {
      return c.json({ error: 'Incorrect password' }, 401);
    }

    capsule.opened = true;
    await kv.set(`capsule:${id}`, capsule);

    return c.json({ success: true, message: capsule.message });
  } catch (error) {
    console.log(`Error unlocking capsule: ${error}`);
    return c.json({ error: 'Failed to unlock capsule' }, 500);
  }
});

// Delete a capsule
app.delete('/make-server-62ab3e05/capsules/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const { username } = await c.req.json();

    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }

    const capsule = await kv.get(`capsule:${id}`);

    if (!capsule) {
      return c.json({ error: 'Capsule not found' }, 404);
    }

    if (capsule.username !== username) {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    await kv.del(`capsule:${id}`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting capsule: ${error}`);
    return c.json({ error: 'Failed to delete capsule' }, 500);
  }
});

Deno.serve(app.fetch);
