/* ══════════════════════════════════════════
   GPS RUN TRACKER
   ══════════════════════════════════════════ */
var gpsState = {
  active: false, paused: false, watchId: null, timerInterval: null,
  startTime: null, pausedTime: 0, pauseStart: null,
  positions: [], distance: 0, kmSplits: [],
  lastKmDistance: 0, lastKmTime: 0,
  map: null, polyline: null, marker: null,
};

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLon = (lon2-lon1)*Math.PI/180;
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
    Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function bindGPSTracker() {
  if(!document.getElementById("gps-start-btn")) return;
  document.getElementById("gps-start-btn").addEventListener("click", gpsStart);
  document.getElementById("gps-stop-btn").addEventListener("click", gpsStop);
  document.getElementById("gps-pause-btn").addEventListener("click", gpsPause);
  document.getElementById("gps-fill-btn").addEventListener("click", gpsFillForm);
}

function gpsStart() {
  if(!navigator.geolocation) { showToast("GPS not available on this device"); return; }
  gpsState.active = true; gpsState.paused = false;
  gpsState.positions = []; gpsState.distance = 0;
  gpsState.kmSplits = []; gpsState.lastKmDistance = 0; gpsState.lastKmTime = 0;
  gpsState.startTime = Date.now(); gpsState.pausedTime = 0;

  document.getElementById("gps-start-btn").classList.add("hidden");
  document.getElementById("gps-stop-btn").classList.remove("hidden");
  document.getElementById("gps-pause-btn").classList.remove("hidden");
  document.getElementById("gps-stats").classList.remove("hidden");
  document.getElementById("gps-map").classList.remove("hidden");
  document.getElementById("gps-fill-btn-wrap").classList.add("hidden");
  document.getElementById("gps-status-text").textContent = "Acquiring GPS…";
  document.getElementById("gps-dot").className = "gps-dot gps-dot-acquiring";

  // Init map
  if(!gpsState.map) {
    gpsState.map = L.map("gps-map", { zoomControl: true, attributionControl: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(gpsState.map);
    gpsState.polyline = L.polyline([], { color: "#e8533a", weight: 4 }).addTo(gpsState.map);
  } else {
    gpsState.polyline.setLatLngs([]);
    if(gpsState.marker) gpsState.map.removeLayer(gpsState.marker);
    gpsState.marker = null;
  }

  // Timer using Date.now() so it survives app switching
  gpsState.timerInterval = setInterval(() => {
    if(gpsState.paused) return;
    const elapsed = Math.floor((Date.now() - gpsState.startTime - gpsState.pausedTime) / 1000);
    const m = Math.floor(elapsed/60), s = elapsed%60;
    document.getElementById("gps-time").textContent = String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
    if(gpsState.distance > 0.05) {
      const pace = elapsed / gpsState.distance;
      const pm = Math.floor(pace/60), ps = Math.round(pace%60);
      document.getElementById("gps-pace").textContent = pm+":"+String(ps).padStart(2,"0");
    }
  }, 1000);

  gpsState.watchId = navigator.geolocation.watchPosition(
    gpsOnPosition, gpsOnError,
    { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
  );
}

function gpsOnPosition(pos) {
  if(!gpsState.active || gpsState.paused) return;
  const { latitude: lat, longitude: lon, accuracy } = pos.coords;
  document.getElementById("gps-status-text").textContent = "Tracking · ±"+Math.round(accuracy)+"m";
  document.getElementById("gps-dot").className = "gps-dot gps-dot-active";
  const latlng = [lat, lon];
  if(gpsState.positions.length > 0) {
    const prev = gpsState.positions[gpsState.positions.length-1];
    const d = haversine(prev[0], prev[1], lat, lon);
    if(d < 0.05) {
      gpsState.distance += d;
      document.getElementById("gps-distance").textContent = gpsState.distance.toFixed(2);
      const km = Math.floor(gpsState.distance);
      if(km > gpsState.lastKmDistance && km > 0) {
        const elapsed = (Date.now() - gpsState.startTime - gpsState.pausedTime) / 1000;
        const splitTime = elapsed - gpsState.lastKmTime;
        const pm = Math.floor(splitTime/60), ps = Math.round(splitTime%60);
        gpsState.kmSplits.push({ km, pace: pm+":"+String(ps).padStart(2,"0"), hr: null });
        gpsState.lastKmDistance = km;
        gpsState.lastKmTime = elapsed;
        showToast("Km "+km+" — "+pm+":"+String(ps).padStart(2,"0")+" /km 🏃");
      }
    }
  }
  gpsState.positions.push(latlng);
  gpsState.polyline.addLatLng(latlng);
  gpsState.map.setView(latlng, 16);
  if(!gpsState.marker) {
    gpsState.marker = L.circleMarker(latlng, {
      radius: 8, color: "#e8533a", fillColor: "#e8533a", fillOpacity: 1, weight: 2
    }).addTo(gpsState.map);
  } else {
    gpsState.marker.setLatLng(latlng);
  }
}

function gpsOnError(err) {
  document.getElementById("gps-status-text").textContent = "GPS error: "+err.message;
  document.getElementById("gps-dot").className = "gps-dot gps-dot-error";
}

function gpsPause() {
  if(!gpsState.active) return;
  if(!gpsState.paused) {
    gpsState.paused = true; gpsState.pauseStart = Date.now();
    document.getElementById("gps-pause-btn").textContent = "▶ Resume";
    document.getElementById("gps-dot").className = "gps-dot gps-dot-acquiring";
    document.getElementById("gps-status-text").textContent = "Paused";
  } else {
    gpsState.paused = false; gpsState.pausedTime += Date.now() - gpsState.pauseStart;
    document.getElementById("gps-pause-btn").textContent = "⏸ Pause";
    document.getElementById("gps-dot").className = "gps-dot gps-dot-active";
    document.getElementById("gps-status-text").textContent = "Tracking";
  }
}

function gpsStop() {
  if(!gpsState.active) return;
  gpsState.active = false;
  if(gpsState.watchId) navigator.geolocation.clearWatch(gpsState.watchId);
  if(gpsState.timerInterval) clearInterval(gpsState.timerInterval);
  document.getElementById("gps-stop-btn").classList.add("hidden");
  document.getElementById("gps-pause-btn").classList.add("hidden");
  document.getElementById("gps-start-btn").classList.remove("hidden");
  document.getElementById("gps-start-btn").textContent = "▶ New Run";
  document.getElementById("gps-status-text").textContent = "Run complete — "+gpsState.distance.toFixed(2)+"km";
  document.getElementById("gps-dot").className = "gps-dot gps-dot-done";
  if(gpsState.distance > 0.05) document.getElementById("gps-fill-btn-wrap").classList.remove("hidden");
}

function gpsFillForm() {
  const elapsed = Math.floor((Date.now() - gpsState.startTime - gpsState.pausedTime) / 1000);
  const h = Math.floor(elapsed/3600), m = Math.floor((elapsed%3600)/60), s = elapsed%60;
  const timeStr = "00:"+String(m).padStart(2,"0")+":"+String(s).padStart(2,"0");
  document.getElementById("r-distance").value = gpsState.distance.toFixed(2);
  document.getElementById("r-time").value = timeStr;
  kmRows = gpsState.kmSplits.map(sp => ({ km: sp.km, partial: false, pace: sp.pace, hr: null }));
  const partial = parseFloat(gpsState.distance.toFixed(2));
  const full = Math.floor(partial);
  if(partial > full && full > 0) {
    const lastElapsed = (Date.now() - gpsState.startTime - gpsState.pausedTime)/1000;
    const lastKmTime = lastElapsed - gpsState.lastKmTime;
    const pm = Math.floor(lastKmTime/60), ps = Math.round(lastKmTime%60);
    kmRows.push({ km: partial, partial: true, pace: pm+":"+String(ps).padStart(2,"0"), hr: null });
  }
  if(kmRows.length > 0) { renderKmTable(); updateKmBtnState(); }
  document.getElementById("run-form").scrollIntoView({ behavior: "smooth" });
  showToast("Run data filled in! Add shoe and notes then save 👟");
  document.getElementById("gps-fill-btn-wrap").classList.add("hidden");
}

// Auto-bind when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(bindGPSTracker, 100);
});
