import { createServerFn } from "@tanstack/react-start";

interface QueryParams {
  layerId: number;
  lat: number;
  lng: number;
}

export const queryPlanningProxy = createServerFn({ method: "GET" })
  .handler(async ({ data }: { data: QueryParams }) => {
    const { layerId, lat, lng } = data;
    const params = new URLSearchParams({
      geometry: JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }),
      geometryType: "esriGeometryPoint",
      spatialRel: "esriSpatialRelIntersects",
      outFields: "*",
      returnGeometry: "false",
      f: "json",
      outSR: "4326",
    });

    const url = `https://thongtinquyhoachxaydung.danang.gov.vn/arcgis/rest/services/SoXayDung/QuyHoachDoThi/MapServer/${layerId}/query?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
        }
      });
      if (!response.ok) {
        throw new Error(`ArcGIS Server returned ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("ArcGIS Proxy Error:", err);
      return { error: true, message: err.message };
    }
  });

export const searchAddressProxy = createServerFn({ method: "GET" })
  .handler(async ({ data: query }: { data: string }) => {
    const viewbox = "107.80,16.25,108.35,15.90";
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&limit=8&countrycodes=vn&viewbox=${viewbox}&bounded=1`;

    try {
      const response = await fetch(url, {
        headers: {
          "Accept-Language": "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7",
          "User-Agent": "BdsHorizonPlanningTool/1.0",
        },
      });
      if (!response.ok) {
        throw new Error(`Nominatim Server returned ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (err: any) {
      console.error("Nominatim Proxy Error:", err);
      return [];
    }
  });
