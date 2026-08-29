import { describe, expect, it } from "vitest";

import { Plant, PlantSchema } from "./types.ts";

describe("PlantSchema", () => {
  it("works with all required properties", () => {
    expect(basePlant().validate()).toBeZodSuccess();
    expect(
      basePlant().with("lastWatered", undefined).validate(),
    ).toBeZodSuccess();
  });

  it("fails with undefined props", () => {
    expect(basePlant().with("id", undefined).validate()).toBeZodFailure(
      /expected string, received undefined/i,
      "id",
    );

    expect(basePlant().with("name", undefined).validate()).toBeZodFailure(
      /expected string, received undefined/i,
      "name",
    );

    expect(basePlant().with("location", undefined).validate()).toBeZodFailure(
      /expected string, received undefined/i,
      "location",
    );

    expect(
      basePlant().with("wateringInterval", undefined).validate(),
    ).toBeZodFailure(
      /expected number, received undefined/i,
      "wateringInterval",
    );
  });

  it("should not allow empty strings", () => {
    expect(basePlant().with("name", "").validate()).toBeZodFailure(
      /expected string to have >=1 characters/i,
      "name",
    );

    expect(basePlant().with("location", "").validate()).toBeZodFailure(
      /expected string to have >=1 characters/i,
      "location",
    );
  });

  it("should allow only valid values for wateringInterval", () => {
    expect(
      basePlant().with("wateringInterval", "jeden tag").validate(),
    ).toBeZodFailure(
      /Invalid input: expected number, received string/i,
      "wateringInterval",
    );

    expect(basePlant().with("wateringInterval", 0).validate()).toBeZodFailure(
      /Too small: expected number to be >=1/i,
      "wateringInterval",
    );

    expect(basePlant().with("wateringInterval", 1).validate()).toBeZodSuccess();
  });

  it("should only allow dates for lastWatered", () => {
    expect(
      basePlant().with("lastWatered", "gestern").validate(),
    ).toBeZodFailure(/Invalid ISO date/i, "lastWatered");

    expect(
      basePlant().with("lastWatered", "2025-13-06").validate(),
    ).toBeZodFailure(/Invalid ISO date/i, "lastWatered");

    expect(basePlant().with("lastWatered", "").validate()).toBeZodFailure(
      /Invalid ISO date/i,
      "lastWatered",
    );
  });
});

const basePlant = () => {
  const p: any = {
    id: "1",
    name: "Aloe Vera",
    location: "Schlafzimmer",
    wateringInterval: 12,
    lastWatered: "2025-06-16",
  };

  return {
    with(prop: keyof Plant, value: any) {
      p[prop] = value;
      return this;
    },
    validate() {
      return PlantSchema.safeParse(p);
    },
  };
};
