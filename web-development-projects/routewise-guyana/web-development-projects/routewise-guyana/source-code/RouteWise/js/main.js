/* RouteWise Guyana - Main JS
   CSE 2201 Group Project 2026 */

function toggleNav() {
  document.getElementById("navMenu").classList.toggle("open");
}

//.pop() grabs just the filename so "/about/routes.html" doesnt accidentally match "routes.html"
function setActiveNav() {
  var current = window.location.pathname.split("/").pop().toLowerCase();
  document.querySelectorAll(".nav-menu a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").toLowerCase();
    if (href === current) link.classList.add("active");
  });
}

setActiveNav();

/* INDEX PAGE - hero search with live dropdown */

var heroForm = document.getElementById("heroSearchForm");
var heroInput = document.getElementById("heroSearch");
var heroResEl = document.getElementById("heroResults");

//routes-data.js isnt loaded on every page, dont crash if its missing
if (heroForm && heroInput && typeof allRoutes !== "undefined") {
  function renderHeroResults(q) {
    if (!q) {
      heroResEl.classList.remove("show");
      heroResEl.innerHTML = "";
      return;
    }

    //cap at 6 or the dropdown swallows the whole screen
    var matches = allRoutes
      .filter(function (r) {
        return (
          r.name.toLowerCase().includes(q) ||
          String(r.num).includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          r.corridorLabel.toLowerCase().includes(q)
        );
      })
      .slice(0, 6);

    if (matches.length === 0) {
      heroResEl.innerHTML =
        '<div class="hero-result-empty">No matching routes. Press search to see all.</div>';
    } else {
      heroResEl.innerHTML = matches
        .map(function (r) {
          return (
            '<div class="hero-result-item" onclick="window.location=\'route-detail.html?route=' +
            r.num +
            "'\">" +
            '<span class="hero-result-num">' +
            r.num +
            "</span>" +
            '<div class="hero-result-text">' +
            "<strong>" +
            r.name +
            "</strong>" +
            "<small>" +
            r.corridorLabel +
            " &middot; est. from GYD " +
            r.fareFrom +
            "</small>" +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }

    heroResEl.classList.add("show");
  }

  heroInput.addEventListener("input", function () {
    renderHeroResults(this.value.trim().toLowerCase());
  });

  //close it when user clicks anywhere else on the page
  document.addEventListener("click", function (e) {
    if (!heroForm.contains(e.target)) heroResEl.classList.remove("show");
  });

  heroForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let q = heroInput.value.trim();
    window.location = q
      ? "routes.html?q=" + encodeURIComponent(q)
      : "routes.html";
  });
}

/* ROUTES PAGE - filter, search, sort, pagination */

let routesGrid = document.getElementById("routesGrid");

if (routesGrid && typeof allRoutes !== "undefined") {
  const perPage = 9;
  var cur_page = 1;
  var theRoutes = allRoutes.slice();

  function buildCard(route) {
    var col = route.color || "#c8e575";
    let fareLabel = "Est. from GYD " + route.fareFrom;

    return (
      '<div class="route-card routes-page-card">' +
      '<div class="route-card-top">' +
      '<div class="paper-badge" style="background-color:' +
      col +
      ';">' +
      '<span class="lbl">Route</span>' +
      '<span class="num">' +
      route.num +
      "</span>" +
      "</div>" +
      "<div>" +
      '<span class="dest-title">' +
      route.name +
      "</span>" +
      '<p class="region">' +
      route.corridorLabel +
      "</p>" +
      "</div>" +
      "</div>" +
      '<div class="route-meta-grid">' +
      '<div class="meta-col">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>' +
      '<span class="typewriter-text" style="font-size:12px;">' +
      fareLabel +
      "</span>" +
      "</div>" +
      '<div class="meta-col">' +
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
      '<span class="typewriter-text" style="font-size:12px;">' +
      route.time +
      "</span>" +
      "</div>" +
      "</div>" +
      '<button class="view-btn" onclick="window.location=\'route-detail.html?route=' +
      route.num +
      "'\">View Details</button>" +
      "</div>"
    );
  }

  function renderPage() {
    let start = (cur_page - 1) * perPage;
    var pg_routes = theRoutes.slice(start, start + perPage);

    if (pg_routes.length === 0) {
      routesGrid.innerHTML =
        '<div class="no-results">No routes found. Try a different search.</div>';
    } else {
      routesGrid.innerHTML = pg_routes.map(buildCard).join("");
    }

    renderPagination();
  }

  function renderPagination() {
    var total = Math.ceil(theRoutes.length / perPage);
    let pg = document.getElementById("pagination");
    if (!pg) return;

    var html =
      "<button " +
      (cur_page === 1 ? "disabled" : "") +
      ' onclick="goPage(' +
      (cur_page - 1) +
      ')">Prev</button>';

    for (var i = 1; i <= total; i++) {
      html +=
        '<button class="' +
        (i === cur_page ? "active" : "") +
        '" onclick="goPage(' +
        i +
        ')">' +
        i +
        "</button>";
    }

    html +=
      "<button " +
      (cur_page === total || total === 0 ? "disabled" : "") +
      ' onclick="goPage(' +
      (cur_page + 1) +
      ')">Next</button>';
    pg.innerHTML = html;
  }

  window.goPage = function (n) {
    let total = Math.ceil(theRoutes.length / perPage);
    if (n < 1 || n > total) return;
    cur_page = n;
    renderPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function applyAll() {
    var q = (
      document.getElementById("searchInput") || { value: "" }
    ).value.toLowerCase();
    let sortVal = (
      document.getElementById("sortSelect") || { value: "num-asc" }
    ).value;
    var corridor = (
      document.querySelector(".filter-btn.active") || {
        dataset: { corridor: "all" },
      }
    ).dataset.corridor;

    theRoutes = allRoutes.filter(function (r) {
      let matchC = corridor === "all" || r.corridor === corridor;
      var matchQ =
        !q ||
        r.name.toLowerCase().includes(q) ||
        String(r.num).includes(q) ||
        r.corridorLabel.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q);
      return matchC && matchQ;
    });

    //strip everything thats not a digit before parseInt - handles "$1,200" etc
    if (sortVal === "fare-asc") {
      theRoutes.sort(function (a, b) {
        return (
          parseInt(a.fareFrom.replace(/\D/g, "")) -
          parseInt(b.fareFrom.replace(/\D/g, ""))
        );
      });
    } else if (sortVal === "fare-desc") {
      theRoutes.sort(function (a, b) {
        return (
          parseInt(b.fareFrom.replace(/\D/g, "")) -
          parseInt(a.fareFrom.replace(/\D/g, ""))
        );
      });
    } else {
      theRoutes.sort(function (a, b) {
        return a.num - b.num;
      });
    }

    cur_page = 1;
    renderPage();
  }

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      this.classList.add("active");
      applyAll();
    });
  });

  var searchBox = document.getElementById("searchInput");
  if (searchBox) searchBox.addEventListener("input", applyAll);

  var sort_select = document.getElementById("sortSelect");
  if (sort_select) sort_select.addEventListener("change", applyAll);

  //handle ?corridor= from the direction buttons on the home page and ?q= from hero search
  const urlP = new URLSearchParams(window.location.search);
  var corridor_param = urlP.get("corridor");
  let search_param = urlP.get("q");

  if (corridor_param) {
    var btn = document.querySelector(
      '.filter-btn[data-corridor="' + corridor_param + '"]',
    );
    if (btn) {
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
    }
  }

  if (search_param && document.getElementById("searchInput")) {
    document.getElementById("searchInput").value = search_param;
  }

  applyAll();
}

/* ROUTE DETAIL PAGE */

function initRouteDetail() {
  const params = new URLSearchParams(window.location.search);
  var route_id = params.get("route");
  let route_info = null;

  for (var i = 0; i < allRoutes.length; i++) {
    if (String(allRoutes[i].num) === route_id) {
      route_info = allRoutes[i];
      break;
    }
  }

  if (!route_info) {
    document.getElementById("heroTitle").textContent = "Route not found";
    document.getElementById("heroFare").textContent = "--";
    document.getElementById("heroTime").textContent = "--";
    document.getElementById("detailMain").innerHTML =
      '<p style="padding:40px;font-family:monospace;">Route not found. <a href="routes.html">Back to routes.</a></p>';
    return;
  }

  document.title = "Route " + route_info.num + " - RouteWise Guyana";
  document.getElementById("heroRouteName").textContent =
    "Route " + route_info.num;
  document.getElementById("heroBadge").textContent = "ROUTE " + route_info.num;
  document.getElementById("heroTitle").textContent = route_info.name;
  document.getElementById("heroRegion").textContent = route_info.corridorLabel;
  document.getElementById("heroFare").textContent =
    "GYD " + route_info.fareFull;
  document.getElementById("heroTime").textContent = route_info.time;

  var stops_el = document.getElementById("stopsList");

  var domIdx = 0;
  route_info.stops.forEach(function (stop, idx) {
    //"curve" entries are just invisible bending coords, not real stops
    if (stop.type === "curve") return;

    var btn = document.createElement("button");
    btn.className = "stop-item" + (stop.type === "terminal" ? " terminal" : "");
    btn.innerHTML =
      '<div class="stop-dot"></div>' +
      '<div class="stop-text"><strong>' +
      stop.name +
      "</strong><small>" +
      stop.desc +
      "</small></div>" +
      '<span class="stop-fare-tag">' +
      stop.fare +
      "</span>";

    (function (stopsIdx, listIdx) {
      btn.addEventListener("click", function () {
        selectStop(stopsIdx, listIdx);
      });
    })(idx, domIdx);

    stops_el.appendChild(btn);
    domIdx++;
  });

  if (route_info.altStops) {
    var altVisible = route_info.altStops.filter(function (s) {
      return s.name && s.name.trim() !== "";
    });

    if (altVisible.length > 0) {
      var divider = document.createElement("div");
      divider.className = "alt-path-divider";
      divider.innerHTML = "<span>&#8645; Alternate Path (via Thomas St)</span>";
      stops_el.appendChild(divider);

      altVisible.forEach(function (stop) {
        var btn = document.createElement("button");
        btn.className =
          "stop-item alt-stop" + (stop.type === "terminal" ? " terminal" : "");
        btn.innerHTML =
          '<div class="stop-dot"></div>' +
          '<div class="stop-text"><strong>' +
          stop.name +
          "</strong><small>" +
          (stop.desc || "Alternate route") +
          "</small></div>" +
          '<span class="stop-fare-tag">' +
          (stop.fare || "—") +
          "</span>";

        (function (s) {
          btn.addEventListener("click", function () {
            stops_el.querySelectorAll(".stop-item").forEach(function (b) {
              b.classList.remove("active");
            });
            this.classList.add("active");
            if (sel_marker) {
              map.removeLayer(sel_marker);
              sel_marker = null;
            }
            sel_marker = L.circleMarker(s.coords, {
              radius: 12,
              color: "#456dff",
              weight: 3,
              fillColor: "#456dff",
              fillOpacity: 0.5,
            })
              .addTo(map)
              .bindPopup("<b>" + s.name + "</b><br>Alternate path stop")
              .openPopup();
            map.panTo(s.coords, { animate: true, duration: 0.8 });
            var callout = document.getElementById("fareCallout");
            callout.innerHTML =
              "&#8645; <strong>" +
              s.name +
              '</strong><br><span style="font-weight:normal;font-size:12px;">This stop is on the alternate path (dashed blue line on map).</span>';
            callout.classList.add("show");
          });
        })(stop);

        stops_el.appendChild(btn);
      });
    }
  }

  var tags_el = document.getElementById("landmarkTags");
  route_info.landmarks.forEach(function (lm) {
    tags_el.innerHTML += "<span>&#128205; " + lm + "</span>";
  });

  //Leaflet docs: https://leafletjs.com/reference.html#map
  var map = L.map("routeMap").setView(
    route_info.stops[0].coords,
    route_info.zoom || 12,
  );
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  var sel_marker = null;
  var full_line = null;
  var partLine = null;
  var road_coords = null;
  var seg_ends = [];

  function makeIcon(color, size) {
    size = size || 14;
    return L.divIcon({
      className: "",
      html:
        '<div style="width:' +
        size +
        "px;height:" +
        size +
        "px;background:" +
        color +
        ";border-radius:50%;border:2px solid white;box-shadow:0 0 6px " +
        color +
        ';"></div>',
      iconAnchor: [size / 2, size / 2],
    });
  }

  route_info.stops.forEach(function (stop) {
    if (stop.type === "curve") return;
    var isT = stop.type === "terminal";
    L.marker(stop.coords, {
      icon: makeIcon(isT ? "#456dff" : "#f0b429", isT ? 18 : 14),
    })
      .addTo(map)
      .bindPopup(
        "<b>" +
          stop.name +
          "</b><br>" +
          stop.desc +
          "<br><b>Fare: " +
          stop.fare +
          "</b>",
      );
  });

  //no sqrt needed - we just want whichever is smallest, not the actual distance value
  //https://www.w3schools.com/js/js_math.asp
  function closestIdx(coords, target) {
    var best = 0;
    let min_dist = Infinity;

    for (var n = 0; n < coords.length; n++) {
      var d =
        Math.pow(coords[n][0] - target[0], 2) +
        Math.pow(coords[n][1] - target[1], 2);
      if (d < min_dist) {
        min_dist = d;
        best = n;
      }
    }

    return best;
  }

  //leaflet doesnt auto-remove old layers so we do it manually before drawing a new orange line
  function drawPartial(idx) {
    if (partLine) {
      map.removeLayer(partLine);
      partLine = null;
    }
    if (!road_coords || idx === 0) return;

    var slice = road_coords.slice(
      0,
      (seg_ends[idx] || road_coords.length - 1) + 1,
    );
    partLine = L.polyline(slice, {
      color: "#d97e30",
      weight: 6,
      opacity: 0.95,
    }).addTo(map);
  }

  //if OSRM is down or rate-limits us, just draw straight lines between stops
  function useFallback() {
    road_coords = route_info.stops.map(function (s) {
      return s.coords;
    });
    full_line = L.polyline(road_coords, {
      color: "#b91c1c",
      weight: 5,
      opacity: 0.7,
    }).addTo(map);
    map.fitBounds(full_line.getBounds(), { padding: [40, 40] });
    route_info.stops.forEach(function (_, i) {
      seg_ends.push(i);
    });
  }

  //OSRM is free with no API key 
  //IMPORTANT: OSRM gives back [lng, lat] but leaflet needs [lat, lng] - easy to miss
  //https://leafletjs.com/examples/geojson/
  var wp_str = route_info.stops
    .map(function (s) {
      return s.coords[1] + "," + s.coords[0];
    })
    .join(";");

  fetch(
    "https://router.project-osrm.org/route/v1/driving/" +
      wp_str +
      "?overview=full&geometries=geojson",
  )
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      document.getElementById("mapLoading").style.display = "none";

      if (data.routes && data.routes.length > 0) {
        road_coords = data.routes[0].geometry.coordinates.map(function (c) {
          return [c[1], c[0]];
        }); //lng,lat -> lat,lng
        full_line = L.polyline(road_coords, {
          color: "#b91c1c",
          weight: 5,
          opacity: 0.7,
        }).addTo(map);
        map.fitBounds(L.latLngBounds(road_coords), { padding: [40, 40] });
        route_info.stops.forEach(function (stop) {
          seg_ends.push(closestIdx(road_coords, stop.coords));
        });
      } else {
        useFallback();
      }
    })
    .catch(function () {
      document.getElementById("mapLoading").style.display = "none";
      useFallback();
    });

  //if the route has an alternate path (e.g. route 40 splits at Vlissengen) draw it as a dashed blue line
  if (route_info.altStops) {
    var alt_wp = route_info.altStops
      .map(function (s) {
        return s.coords[1] + "," + s.coords[0];
      })
      .join(";");

    fetch(
      "https://router.project-osrm.org/route/v1/driving/" +
        alt_wp +
        "?overview=full&geometries=geojson",
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.routes && data.routes.length > 0) {
          var alt_coords = data.routes[0].geometry.coordinates.map(
            function (c) {
              return [c[1], c[0]];
            },
          ); //lng,lat -> lat,lng
          L.polyline(alt_coords, {
            color: "#456dff",
            weight: 5,
            opacity: 0.7,
            dashArray: "8 4",
          }).addTo(map);
        }
      })
      .catch(function () {
        //fallback if OSRM fails - straight lines between the alt stops
        L.polyline(
          route_info.altStops.map(function (s) {
            return s.coords;
          }),
          { color: "#456dff", weight: 5, opacity: 0.7, dashArray: "8 4" },
        ).addTo(map);
      });
  }

  window.selectStop = function (idx, listIdx) {
    stops_el.querySelectorAll(".stop-item").forEach(function (b) {
      b.classList.remove("active");
    });
    if (sel_marker) {
      map.removeLayer(sel_marker);
      sel_marker = null;
    }

    stops_el.querySelectorAll(".stop-item")[listIdx].classList.add("active");
    var stop = route_info.stops[idx];

    sel_marker = L.circleMarker(stop.coords, {
      radius: 12,
      color: "#d97e30",
      weight: 3,
      fillColor: "#d97e30",
      fillOpacity: 0.5,
    })
      .addTo(map)
      .bindPopup(
        "<b>" +
          stop.name +
          "</b><br>Fare from Stabroek: <b>" +
          stop.fare +
          "</b>",
      )
      .openPopup();

    drawPartial(idx);
    map.panTo(stop.coords, { animate: true, duration: 0.8 });

    let callout = document.getElementById("fareCallout");
    callout.innerHTML =
      idx === 0
        ? "&#128652; Departure: Stabroek Market. Board here."
        : "&#128205; <strong>" +
          stop.name +
          "</strong><br>" +
          "Fare from Stabroek: <strong>GYD " +
          stop.fare +
          "</strong><br>" +
          '<span style="font-weight:normal;font-size:12px;">Estimated from 2018 Ministry of Business structure. Confirm with conductor.</span>';

    callout.classList.add("show");
  };
}

/* MAP PAGE */

function initMapPage() {
  if (typeof L === "undefined" || typeof allRoutes === "undefined") return;

  var map = L.map("map", { zoomControl: false }).setView(
    [6.8013, -58.1551],
    11,
  );
  L.control.zoom({ position: "topleft" }).addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  //leaflet loses track of its own size when the window resizes
  window.addEventListener("resize", function () {
    map.invalidateSize();
  });

  var active_line = null;

  function loadRoute(routeId) {
    var data = null;
    for (let i = 0; i < allRoutes.length; i++) {
      if (String(allRoutes[i].num) === String(routeId)) {
        data = allRoutes[i];
        break;
      }
    }
    if (!data) return;

    var coords = data.stops.map(function (s) {
      return s.coords;
    });

    document.getElementById("bannerTitle").innerText =
      "Route " + data.num + ": " + data.name;
    document.getElementById("bannerCorridor").innerText =
      "Corridor: " + data.corridorLabel;
    document.getElementById("bannerTime").innerText = "Est. Time: " + data.time;
    document.getElementById("bannerFare").innerText =
      "Fare from Stabroek: " + data.fareFull;

    if (active_line) {
      map.removeLayer(active_line);
      active_line = null;
    }

    //show a dashed line right away while OSRM loads - feels more responsive
    let fallback = L.polyline(coords, {
      color: "#b91c1c",
      weight: 5,
      opacity: 0.5,
      dashArray: "8 6",
    }).addTo(map);
    map.flyToBounds(fallback.getBounds(), { padding: [80, 80], duration: 1.2 });
    active_line = fallback;

    var wp = coords
      .map(function (pt) {
        return pt[1] + "," + pt[0];
      })
      .join(";");

    fetch(
      "https://router.project-osrm.org/route/v1/driving/" +
        wp +
        "?overview=full&geometries=geojson",
    )
      .then(function (r) {
        return r.json();
      })
      .then(function (json) {
        if (json.routes && json.routes.length > 0) {
          //only swap out the dashed line if user hasnt already clicked another route
          if (active_line === fallback) map.removeLayer(fallback);

          let road = json.routes[0].geometry.coordinates.map(function (pt) {
            return [pt[1], pt[0]];
          }); //lng,lat -> lat,lng
          active_line = L.polyline(road, {
            color: "#b91c1c",
            weight: 5,
            opacity: 0.9,
            lineJoin: "round",
          }).addTo(map);
          map.flyToBounds(active_line.getBounds(), {
            padding: [80, 80],
            duration: 1.0,
          });
        }
      })
      .catch(function () {});
  }

  document.querySelectorAll(".route-link").forEach(function (link) {
    link.addEventListener("click", function () {
      document.querySelectorAll(".route-link").forEach(function (l) {
        l.classList.remove("active-route");
      });
      this.classList.add("active-route");
      loadRoute(this.dataset.route);
    });
  });

  loadRoute("31"); //default on page load
}

function toggleAccordion(btn) {
  var item = btn.parentElement;
  let isOpen = item.classList.contains("active");

  document.querySelectorAll(".accordion-item").forEach(function (el) {
    el.classList.remove("active");
    el.querySelector(".accordion-content").style.display = "none";
    el.querySelector("span").textContent = "+";
  });

  if (!isOpen) {
    item.classList.add("active");
    item.querySelector(".accordion-content").style.display = "flex";
    btn.querySelector("span").textContent = "-";
  }
}

/* GUIDE PAGE - faq accordion */

document.querySelectorAll(".faq-q").forEach(function (q) {
  q.addEventListener("click", function () {
    var item = this.parentElement;
    let ico = this.querySelector(".faq-icon");

    if (item.classList.contains("closed")) {
      item.classList.remove("closed");
      ico.textContent = "\u2212";
    } else {
      item.classList.add("closed");
      ico.textContent = "+";
    }
  });
});

// TUTORIAL 7: JAVASCRIPT FORM VALIDATION
//
const feedbackForm = document.querySelector(
  'form[action="process_feedback.php"]',
);

if (feedbackForm != null) {
  feedbackForm.addEventListener("submit", function (event) {
    var desc_box = document.querySelector('textarea[name="description"]');
    let val = desc_box.value.trim();

    //php checks this too but catching it here saves a full page reload
    if (val.length < 10) {
      event.preventDefault();
      alert(
        "Your description is too short. Please provide at least 10 characters of detail so we can fix the issue.",
      );
      return;
    }

    //email is optional but if filled in it should look like an email
    var email_box = document.querySelector('input[name="email"]');
    var email_val = email_box.value.trim();

    if (email_val !== "" && (!email_val.includes("@") || !email_val.includes("."))) {
      event.preventDefault();
      alert("Please enter a valid email address or leave the field blank.");
    }
  });
}

// FEEDBACK PAGE: SUCCESS / ERROR BANNERS
// php cant write to the page after a POST so it redirects back with ?submitted=1 or ?error=..
// we read that param here and show the right bannersss
var status_div = document.getElementById("formStatus");

if (status_div != null) {
  const p = new URLSearchParams(window.location.search);

  if (p.get("submitted")) {
    status_div.className = "form-status success";
    status_div.textContent = "Thank you! Your report has been submitted.";
  } else if (p.get("error") === "missing_fields") {
    status_div.className = "form-status error";
    status_div.textContent =
      "Please fill in the required fields (Category and Description).";
  } else if (p.get("error") === "spam") {
    status_div.className = "form-status error";
    status_div.textContent =
      "Please wait 30 seconds before submitting another report.";
  }
}

// TUTORIAL 8: LOCAL STORAGE (MULTIPLE FAVORITES)
var favBtn = document.getElementById("favBtn");
let welcome_banner = document.getElementById("welcomeMessage");
var fav_links_el = document.getElementById("favLinksContainer");

//localStorage only stores plain text so we JSON.stringify the array going in and parse it coming out
//took a while to figure this out: hhttps://www.w3schools.com/js/js_api_web_storage.asp
function getSavedRoutes() {
  const raw = localStorage.getItem("favoriteRoutes");

  if (raw == null) {
    return [];
  } else {
    return JSON.parse(raw);
  }
}

//run on detail page load - show the star as already filled if this route is saved
function checkFavoriteState() {
  if (favBtn == null) return;

  let params = new URLSearchParams(window.location.search);
  var cur = params.get("route");
  const favs = getSavedRoutes();
  var is_saved = false;

  for (let i = 0; i < favs.length; i++) {
    if (favs[i] === cur) {
      is_saved = true;
      break;
    }
  }

  if (is_saved == true) {
    favBtn.innerHTML = "⭐ Saved as Favorite";
    favBtn.style.backgroundColor = "#c8e575";
  }
}

checkFavoriteState();

//clicking toggles - adds if not saved, removes if already saved
function saveFavorite() {
  const params = new URLSearchParams(window.location.search);
  var cur = params.get("route");

  if (cur != null) {
    let favs = getSavedRoutes();
    var idx = favs.indexOf(cur);

    if (idx === -1) {
      //not saved yet - add it
      favs.push(cur);
      favBtn.innerHTML = "⭐ Saved as Favorite";
      favBtn.style.backgroundColor = "#c8e575";
    } else {
      favs.splice(idx, 1); //already saved, remove it
      favBtn.innerHTML = "☆ Save as Favorite";
      favBtn.style.backgroundColor = "#e5f1f5";
    }

    localStorage.setItem("favoriteRoutes", JSON.stringify(favs));
  }
}

//show the banner on the home page if the user has any saved routes
if (welcome_banner != null && fav_links_el != null) {
  const favs = getSavedRoutes();

  if (favs.length > 0) {
    var html = "";

    for (let i = 0; i < favs.length; i++) {
      let r = favs[i];
      html +=
        "<a href='route-detail.html?route=" +
        r +
        "' style='color: #d97e30; text-decoration: underline; text-decoration-style: wavy; font-size: 18px; font-weight: 900; font-family: sans-serif; padding: 5px;'>";
      html += "Route " + r;
      html += "</a>";
    }

    fav_links_el.innerHTML = html;
    welcome_banner.style.display = "block";
  }
}

// TUTORIAL 10: READING THE PHP COOKIE
var name_field = document.querySelector('input[name="name"]');

//autofill the name box using the cookie that process_feedback.php set after last submit
if (name_field != null) {
  //document.cookie is one big string like "a=1; b=2" not an array so we split it
  //https://www.w3schools.com/js/js_cookies.asp
  var all_cookies = document.cookie.split(";");

  for (var i = 0; i < all_cookies.length; i++) {
    let c = all_cookies[i].trim();

    if (c.startsWith("reporterName=")) {
      let saved_name = c.substring("reporterName=".length);
      name_field.value = decodeURIComponent(saved_name); //spaces get encoded so decode it
      break;
    }
  }
}
