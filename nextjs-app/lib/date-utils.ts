/**
 * Calculates the number of days until the next watering based on the last watering date and the watering interval.
 *
 * @param {string} lastWatered - The date of the last watering in ISO string format (e.g., 'YYYY-MM-DD').
 * @param {number} wateringInterval - The interval in days between waterings.
 * @return {number} The number of days until the next watering. If the date is in the past, returns a negative or zero value.
 */
export function getDaysUntilWatering(
  lastWatered: string,
  wateringInterval: number,
) {
  const nextWatering = new Date(
    new Date(lastWatered).getTime() +
      (wateringInterval - 1) * 24 * 60 * 60 * 1000,
  );
  const today = new Date();
  const diffTime = nextWatering.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
