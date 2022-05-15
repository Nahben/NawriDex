 var results = [];
 var bureaux, quartier, panneaux;
          //open sidebar and more content when clicking button in popup
          var thisResult;
          function openSidebar(ID) {
              if ($('#sidebar-text').text().length > 0) {
                  $("#sidebar-text").removeText();
              }
              for (var i = 0, len = results.length; i < len; i++) {
                  if (results[i].objectid === parseInt(ID)) {
                      thisResult = (results[i]);
                  }
              }
              var divToAddContent = document.getElementById('home');
              console.log(thisResult);
              divToAddContent.innerHTML = "Name:</br>" + thisResult.lieux + "</br>Address:</br>" + thisResult.adresse + "</br>Category:</br>" + thisResult.type;
          }
          // create gray basemap
          var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

          var map = L.map('map', {
              center: [50.6894, 3.1823],
              zoom: 13,
              layers: [Stamen_Terrain]
          });

          $.getJSON("/JSON/bureaux.json", function (data) {

            bureaux = L.geoJSON(data, {
                style: function(feature) {
                    return {color: "#7ABFC4"};
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('Bureau n° ' + feature.properties.bureau + '<br/>' + feature.properties.nom_du_bureau );
                },
                filter: function(feature, layer) {
                    return feature.properties.circonscri === '8EME';
                }
            });
            bureaux.addTo(map);
        });

        $.getJSON("/JSON/quartier.json", function (data) {

            quartier = L.geoJSON(data, {
                style: function(feature) {
                    return {color: "#D87CAC"};
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(feature.properties.nom_de_quartier);
                },
                filter: function(feature, layer) {
                    return feature.properties.nom_de_quartier != 'FRESNOY MACKELLERIE' && 'EPEULE' && 'TRICHON' && 'ESPERANCE' && 'CROUY';
                }
            });
            quartier.addTo(map);
            map.removeLayer(quartier);
        });
          
          $.getJSON("/JSON/panneaux.json", function (data) {
              var geojsonMarkerOptions = {
                  radius: 8,
                  fillColor: "#ff7800",
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              };


              panneaux = L.geoJSON(data, {
                  pointToLayer: function (feature, latlng) {
                      var marker = L.circleMarker(latlng, geojsonMarkerOptions);
                      marker.bindPopup(feature.properties.lieux +
                                                       '<br/><button type="button" class="btn btn-primary sidebar-open-button" data = "' + feature.properties.objectid + '" ' + '>Modifier état </button>');
                      results.push(feature.properties);  
                      return marker;
                  }

              });
              panneaux.addTo(map);
          });


            $("div").on("click", '.sidebar-open-button', function () {
                var ID = $(this).attr("data");
                openSidebar(ID);
            });

            $("#qrt").click(function() {
                map.addLayer(quartier);
                map.removeLayer(bureaux);
                map.removeLayer(panneaux);
                map.addLayer(panneaux);
            });
            $("#bdv").click(function() {
                map.addLayer(bureaux);
                map.removeLayer(quartier);
                map.removeLayer(panneaux);
                map.addLayer(panneaux);
            });



