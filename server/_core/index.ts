import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getDb } from "../db";
import { pets, letters } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { generateReply } from "./llm";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // API routes for pets and letters
  app.get("/api/pets", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      const allPets = await db.select().from(pets);
      res.json(allPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ error: "Failed to fetch pets" });
    }
  });
  
  app.post("/api/pets", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      const { name, type, gender, age, status, moonDesign, profileImage } = req.body;
      
      const result = await db.insert(pets).values({
        userId: 1, // Default user ID (should be from auth context)
        name,
        type,
        gender,
        age: parseInt(age) || 0,
        status: status || "함께하는 중",
        moonDesign: moonDesign || "moon-1",
        profileImage: profileImage || null,
      });
      
      res.json({ id: (result as any).insertId, ...req.body });
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ error: "Failed to create pet" });
    }
  });
  
  app.post("/api/letters", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      const { petId, petName, content, userId } = req.body;
      
      // Save letter
      const letterResult = await db.insert(letters).values({
        userId: 1, // Default user ID (should be from auth context)
        petId: petId || 0,
        petName: petName || "친구",
        content,
        status: "processing",
      });
      
      const letterId = (letterResult as any).insertId;
      
      // Generate AI reply asynchronously
      setImmediate(async () => {
        try {
          const reply = await generateReply(petName || "친구", content);
          const db2 = await getDb();
          if (db2) {
            await db2.update(letters)
              .set({ reply, status: "replied" })
              .where(eq(letters.id, letterId));
          }
        } catch (error) {
          console.error("Error generating reply:", error);
        }
      });
      
      res.json({ id: letterId, status: "processing" });
    } catch (error) {
      console.error("Error creating letter:", error);
      res.status(500).json({ error: "Failed to create letter" });
    }
  });
  
  app.get("/api/replies/:letterId", async (req: Request, res: Response) => {
    try {
      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database not available" });
      }
      const { letterId } = req.params;
      const letter = await db.select().from(letters).where(eq(letters.id, parseInt(letterId)));
      
      if (letter.length === 0) {
        return res.status(404).json({ error: "Letter not found" });
      }
      
      res.json(letter[0]);
    } catch (error) {
      console.error("Error fetching reply:", error);
      res.status(500).json({ error: "Failed to fetch reply" });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`API endpoints available at http://localhost:${port}/api/`);
  });
}

startServer().catch(console.error);
