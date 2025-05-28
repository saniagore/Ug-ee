export async function obtenerDireccion(latitud, longitud) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.address) return "Dirección no encontrada";

    const parts = [];
    if (data.address.road) parts.push(data.address.road);
    if (data.address.house_number) parts.push(data.address.house_number);
    if (parts.length === 0 && data.address.neighbourhood)
      parts.push(data.address.neighbourhood);
    if (data.address.city || data.address.town || data.address.village) {
      parts.push(
        data.address.city || data.address.town || data.address.village
      );
    }

    return parts.length > 0 ? parts.join(", ") : "Dirección no disponible";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error al obtener la dirección";
  }
}

export function wktToRutaPlanificada(wkt) {
  try {
    const matches = wkt.match(/^LINESTRING\((.+)\)$/);
    if (!matches) return [];
    return matches[1].split(",").map((pair) => {
      const [lon, lat] = pair.trim().split(" ").map(Number);
      return { latitud: lat, longitud: lon };
    });
  } catch (error) {
    return [];
  }
}