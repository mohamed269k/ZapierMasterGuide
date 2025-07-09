import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all automations
  app.get("/api/automations", async (req, res) => {
    try {
      const automations = await storage.getAllAutomations();
      res.json(automations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch automations" });
    }
  });

  // Get automations by category
  app.get("/api/automations/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const automations = await storage.getAutomationsByCategory(category);
      res.json(automations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch automations by category" });
    }
  });

  // Search automations
  app.get("/api/automations/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      const automations = await storage.searchAutomations(q);
      res.json(automations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search automations" });
    }
  });

  // Get automation by ID
  app.get("/api/automations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid automation ID" });
      }
      const automation = await storage.getAutomationById(id);
      if (!automation) {
        return res.status(404).json({ message: "Automation not found" });
      }
      res.json(automation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch automation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
