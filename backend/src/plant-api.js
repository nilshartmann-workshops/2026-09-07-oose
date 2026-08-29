import { samplePlants as plants } from "./plants.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import { sortPlants } from "./plants.js";

dayjs.extend(customParseFormat);

const connectedClients = []; // Array to store connected clients for SSE

const isValidDate = (d) => dayjs(d).isValid();

export function setupPlantsApi(app) {
  app.get("/api/plants", (req, res) => {
    const orderBy = req.query.orderBy || "id";

    const allowedOrderBy = [
      "id",
      "name",
      "location",
      "lastWatered",
      "wateringInterval",
    ];

    if (!allowedOrderBy.includes(orderBy)) {
      return res.status(400).json({
        error: `Invalid 'orderBy' search param '${orderBy}' Allowed values: '${allowedOrderBy}'`,
      });
    }
    return res.status(200).json(sortPlants(plants, orderBy));
  });

  const allowedProperties = [
    "name",
    "location",
    "wateringInterval",
    "lastWatered",
    "notes",
  ];

  app.post("/api/plants", (req, res) => {
    const errors = [];

    const { name, location, wateringInterval, lastWatered, notes } =
      req.body || {};

    const invalidProperties = Object.keys(req.body || {}).filter(
      (key) => !allowedProperties.includes(key),
    );
    if (invalidProperties.length) {
      errors.push({
        error: `Invalid properties in payload: '${invalidProperties}'. Only properties '${allowedProperties}' allowed`,
      });
    }

    if (!name) {
      errors.push({ error: "'name' must be specified" });
    }

    if (name.toUpperCase() === name) {
      errors.push({ error: "'name' must not contain only uppercase letters" });
    }

    if (!location) {
      errors.push({ error: "'location' must be an non-empty string" });
    }

    if (lastWatered) {
      if (!isValidDate(lastWatered)) {
        errors.push({
          error:
            "'lastWatered' must be undefined OR a date in format 'YYYY-MM-DD'",
        });
      }
    }

    if (typeof wateringInterval !== "number") {
      errors.push({ error: "'wateringInterval' must be number" });
    } else {
      if (wateringInterval < 1) {
        errors.push({ error: "'wateringInterval' must be positive number" });
      }

      if (wateringInterval > 200) {
        errors.push({
          error: "'expectedGuests' must be equal or less than 200",
        });
      }
    }

    if (errors.length) {
      return res.status(400).json(errors);
    }

    const newPlant = {
      id: String(plants.length + 1),
      name,
      location,
      wateringInterval,
      lastWatered,
      notes: notes || undefined,
    };

    plants.push(newPlant);

    return res.status(201).json(newPlant);
  });

  app.get("/api/plants/:plantId", (req, res) => {
    const plant = plants.find((d) => d.id === req.params.plantId);
    if (!plant) {
      return res.status(404).json({
        error: `Plant not found with id '${req.params.plantId}' 🍂`,
      });
    }

    return res.status(200).json(plant);
  });

  app.put("/api/plants/:plantId/lastWatered", (req, res) => {
    const plant = plants.find((d) => d.id === req.params.plantId);
    if (!plant) {
      return res.status(404).json({
        error: `Plant not found with id '${req.params.plantId}' 🍂`,
      });
    }

    const newLastWatered = req.body?.lastWatered || new Date().toISOString();
    if (!newLastWatered || !isValidDate(newLastWatered)) {
      return res.status(400).json({
        error: `Invalid lastWatered ${newLastWatered}. Please specify a date in format 'YYYY-MM-DD`,
      });
    }

    plant.lastWatered = newLastWatered;

    notifyClients(plant.id, plant.lastWatered);

    return res.status(200).json(plant);
  });

  // SSE endpoint to send events
  app.get("/api/events", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Push response object to connectedClients array
    connectedClients.push(res);

    // Remove connection on client disconnect
    req.on("close", () => {
      const index = connectedClients.indexOf(res);
      if (index !== -1) {
        connectedClients.splice(index, 1);
      }
    });
  });
}

function notifyClients(plantId, newStatus) {
  connectedClients.forEach((client) => {
    const data = JSON.stringify({
      reservationId: plantId,
      newStatus,
    });

    client.write(`event: last-watered-changed\n`);
    client.write(`data: ${data}\n`);
    client.write(`\n`);
  });
}
