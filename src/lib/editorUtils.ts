import { Paragraphs, Zone } from "../types/project";

export const checkIfZonesFeaturesMatch = (zone1: Zone, zone2: Zone) => {
  const zone1Mutated = { ...zone1, features: zone1.features.filter((feature) => feature.key !== "isActive") };
  const zone2Mutated = { ...zone2, features: zone2.features.filter((feature) => feature.key !== "isActive") };

  const isFeaturesLengthMatch = zone1Mutated.features.length === zone2Mutated.features.length;
  if (!isFeaturesLengthMatch) return false;

  for (let i = 0; i < zone1Mutated.features.length; i++) {
    const zone1Feature = zone1Mutated.features[i];
    const isFeatureMatch = zone2Mutated.features.find(
      (zone2Feature) => zone2Feature.key === zone1Feature.key && zone2Feature.value === zone1Feature.value,
    );
    if (!isFeatureMatch) return false;
  }

  return true;
};

export const checkIfZonesMatch = (zone1: Zone, zone2: Zone) => {
  const isTextMatch = zone1.text === zone2.text;
  const isAuthorMatch = zone1.actorId === zone2.actorId;
  const isFeaturesMatch = checkIfZonesFeaturesMatch(zone1, zone2);
  if (!isTextMatch || !isAuthorMatch || !isFeaturesMatch) {
    return false;
  } else {
    return true;
  }
};

export const checkIfZoneMatchNoAuthor = (zone1: Zone, zone2: Zone) => {
  const isTextMatch = zone1.text === zone2.text;
  const isFeaturesMatch = checkIfZonesFeaturesMatch(zone1, zone2);
  if (!isTextMatch || !isFeaturesMatch) {
    return false;
  } else {
    return true;
  }
};

export const checkIfZoneCached = (zone: Zone, cachedZones: Zone[]) => {
  return cachedZones.find((cachedZone) => checkIfZonesMatch(zone, cachedZone));
};

export const getAllZones = (paragraphs: Paragraphs[]) => {
  return paragraphs.reduce((prev: Zone[], current: Paragraphs) => {
    const zones = current.data.map((zone) => ({ ...zone, actorId: current.actorId }));
    return [...prev, ...zones];
  }, []);
};

export const getAudioList = (zones: Zone[], cachedZones: Zone[]) => {
  return zones.map((zone) => (checkIfZoneCached(zone, cachedZones) || zone)?.outputUrl);
};
