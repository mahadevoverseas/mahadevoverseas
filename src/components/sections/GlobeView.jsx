"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { MeshPhongMaterial, Color } from "three";

/**
 * Rotating hex-dot globe with a red arc flying from India to the active
 * country. Loaded client-side only via next/dynamic.
 */
export default function GlobeView({ country, origin }) {
  const wrapRef = useRef(null);
  const globeRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [polygons, setPolygons] = useState([]);

  const material = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color("#0c1822"),
        emissive: new Color("#08121b"),
        shininess: 8,
        transparent: true,
        opacity: 0.96,
      }),
    []
  );

  useEffect(() => {
    let alive = true;
    fetch("/data/countries.json")
      .then((r) => r.json())
      .then((g) => alive && setPolygons(g.features))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fly the camera between India and the active destination.
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !country) return;
    const midLng = (() => {
      let d = country.lng - origin.lng;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      return origin.lng + d / 2;
    })();
    const midLat = (origin.lat + country.lat) / 2;
    const dist = Math.abs(country.lng - origin.lng) + Math.abs(country.lat - origin.lat);
    g.pointOfView({ lat: midLat, lng: midLng, altitude: dist > 150 ? 2.5 : 2.1 }, 1400);
  }, [country, origin, size.w]);

  const onReady = () => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    g.pointOfView({ lat: origin.lat, lng: origin.lng, altitude: 2.3 }, 0);
  };

  const arcs = country
    ? [{ startLat: origin.lat, startLng: origin.lng, endLat: country.lat, endLng: country.lng, key: country.id }]
    : [];
  const rings = country
    ? [
        { lat: origin.lat, lng: origin.lng, color: "53,192,235" },
        { lat: country.lat, lng: country.lng, color: "243,40,50" },
      ]
    : [];
  const labels = country
    ? [
        { lat: origin.lat, lng: origin.lng, text: "India", color: "#35C0EB" },
        { lat: country.lat, lng: country.lng, text: country.city, color: "#F2F4F7" },
      ]
    : [];

  const iso = country?.flag?.toUpperCase();

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={material}
          showAtmosphere
          atmosphereColor="#35C0EB"
          atmosphereAltitude={0.18}
          enablePointerInteraction={false}
          rendererConfig={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onGlobeReady={onReady}
          hexPolygonsData={polygons}
          hexPolygonResolution={3}
          hexPolygonMargin={0.62}
          hexPolygonUseDots
          hexPolygonsTransitionDuration={0}
          hexPolygonColor={(d) =>
            d.properties.iso === iso ? "#F32832" : d.properties.iso === "IN" ? "#7fdcf7" : "rgba(53,192,235,0.55)"
          }
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor={() => ["rgba(243,40,50,0.25)", "#F32832"]}
          arcStroke={0.7}
          arcAltitudeAutoScale={0.45}
          arcDashLength={0.55}
          arcDashGap={1.2}
          arcDashInitialGap={1}
          arcDashAnimateTime={2200}
          arcsTransitionDuration={0}
          ringsData={rings}
          ringColor={(d) => (t) => `rgba(${d.color},${1 - t})`}
          ringMaxRadius={4}
          ringPropagationSpeed={2.5}
          ringRepeatPeriod={900}
          labelsData={labels}
          labelText="text"
          labelColor="color"
          labelSize={1.6}
          labelDotRadius={0.5}
          labelAltitude={0.01}
          labelResolution={2}
        />
      )}
    </div>
  );
}
