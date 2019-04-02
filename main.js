      // Function that shows splash screen
      function hideShow() {
        var map1 = document.getElementById("map");
        var splash1 = document.getElementById("splash");
        setTimeout(function hidden() {
          splash1.style.display = "none";
        }, 2500);
        setTimeout(function visible() {
          map1.style.display = "block";
        }, 2000);
      }
      hideShow();

      var map;

      // Function that creates icon button.
      // takes in part of icon name. Ex "fa-plus" where dir = "plus".
      function createButton(dir) {
        var button = document.createElement("button");
        button.classList.add("fas");
        const className = "fa-" + dir;
        button.classList.add(className);
        return button;
      }

      function FullScreen(fullScreenDiv) {
        const fullScreen = createButton("expand");
        fullScreenDiv.appendChild(fullScreen);

        fullScreenDiv.addEventListener(
          "click",
          function() {
            document.body.requestFullscreen();
            fullScreenDiv.style.display = none;
          },
          false
        );
      }

      // Creates custom zoom controls
      function ZoomControl(zoomControlDiv, map) {
        const zoomIn = createButton("plus");
        zoomControlDiv.appendChild(zoomIn);
        const zoomOut = createButton("minus");
        zoomControlDiv.appendChild(zoomOut);

        zoomIn.addEventListener("click", function() {
          map.setZoom(1 + map.getZoom());
        });
        zoomOut.addEventListener("click", function() {
          map.setZoom(map.getZoom() - 1);
        });
      }

      // Creates custom pan controls
      function PanControl(panControlDiv, map) {
        const panUp = createButton("angle-up");
        panControlDiv.appendChild(panUp);
        const panDown = createButton("angle-down");
        panControlDiv.appendChild(panDown);
        const panLeft = createButton("angle-left");
        panControlDiv.appendChild(panLeft);
        const panRight = createButton("angle-right");
        panControlDiv.appendChild(panRight);

        let center = map.getCenter();
        let lat = center.lat();
        let lng = center.lng();

        function calculatePan() {
          let pan = 1 / map.getZoom();
          pan = pan * 0.01;
          return pan;
        }

        panUp.addEventListener("click", function() {
          map.setCenter({ lat: (lat += calculatePan()), lng: lng });
        });
        panDown.addEventListener("click", function() {
          map.setCenter({ lat: (lat -= calculatePan()), lng: lng });
        });
        panLeft.addEventListener("click", function() {
          map.setCenter({ lat: lat, lng: (lng -= calculatePan()) });
        });
        panRight.addEventListener("click", function() {
          map.setCenter({ lat: lat, lng: (lng += calculatePan()) });
        });
      }

      // Initiates map in the div with id map
      function initMap() {
        var myLatlng = new google.maps.LatLng(59.330792, 18.059048);
        map = new google.maps.Map(document.getElementById("map"), {
          center: myLatlng,
          // TC 59.330792, 18.059048
          // KTH  59.3498092 18.0684758
          zoom: 18,
          mapTypeId: "hybrid",
          disableDefaultUI: true,
          draggable: false
        });

        // ZOOM CONTROL
        var zoomControlDiv = document.createElement("div");
        zoomControlDiv.classList.add("zoom");
        // calling the zoomcontroll constructor and passing in the div
        var zoomControl = new ZoomControl(zoomControlDiv, map);
        // Attaches the control to the DOM through the map object
        // And adds it to the map at a specific position by pushing it on the position's array
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(
          zoomControlDiv
        );

        // PAN CONTROL
        var panControlDiv = document.createElement("div");
        panControlDiv.classList.add("pan");
        var panControl = new PanControl(panControlDiv, map);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(panControlDiv);

        var fullScreenDiv = document.createElement("div");
        panControlDiv.classList.add("fs");
        var fullScreen = new FullScreen(fullScreenDiv, map);
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(fullScreenDiv);

        // MARKER
        var marker = new google.maps.Marker({
          position: myLatlng,
          draggable: true,
          map: map,
          animation: google.maps.Animation.DROP,
          title: "I drop and bounce!"
        });
        marker.addListener("click", toggleBounce);
        function toggleBounce() {
          if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
          }
        }
      }
      initMap();