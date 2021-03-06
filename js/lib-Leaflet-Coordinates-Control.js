"use strict";

/**
 * author Michal Zimmermann <zimmicz@gmail.com>
 * original url: https://github.com/zimmicz/Leaflet-Coordinates-Control
 * Displays coordinates of mouseclick.
 * @param object options:
 *        position: bottomleft, bottomright etc. (just as you are used to it with Leaflet)
 *        latitudeText: description of latitude value (defaults to lat.)
 *        longitudeText: description of latitude value (defaults to lon.)
 *        precision: number of decimals to be displayed
 */
L.Control.Coordinates = L.Control.extend({
  options: {
    position: 'bottomleft',
    latitudeText: 'lat.',
    longitudeText: 'lon.',
    precision: 4
  },

  initialize: function(options)
  {
    L.Control.prototype.initialize.call(this, options);
  },

  onAdd: function(map)
  {
    var className = 'leaflet-control-coordinates',
      that = this,
      container = this._container = L.DomUtil.create('div', className);
    this.visible = false;

    L.DomUtil.addClass(container, 'hidden');

    L.DomEvent.disableClickPropagation(container);

    this._addText(container, map);

    L.DomEvent.addListener(container, 'click', function() {
      var lat = L.DomUtil.get(that._lat),
        lng = L.DomUtil.get(that._lng),
        gps = L.DomUtil.get(that._gps),
        latTextLen = this.options.latitudeText.length + 1,
        lngTextLen = this.options.longitudeText.length + 1,
        latTextIndex = lat.textContent.indexOf(this.options.latitudeText) + latTextLen,
        lngTextIndex = lng.textContent.indexOf(this.options.longitudeText) + lngTextLen,
        latCoordinate = lat.textContent.substr(latTextIndex),
        lngCoordinate = lng.textContent.substr(lngTextIndex),
        latCoordinateDM = DDToDM(latCoordinate, this.options.precision, "lat", true),
        lngCoordinateDM = DDToDM(lngCoordinate, this.options.precision, "lon", true),
        latCoordinateDMS = DDToDMS(latCoordinate, this.options.precision, "lat", true),
        lngCoordinateDMS = DDToDMS(lngCoordinate, this.options.precision, "lon", true)
        ;

      var coorsText = "<h4>GPS souřadnice</h4>";
      coorsText += '<div class="gpsCoor">' + latCoordinate + " " + lngCoordinate + "</div>";
      coorsText += '<div class="gpsCoor">' + latCoordinateDM + " " + lngCoordinateDM + "</div>";
      coorsText += '<div class="gpsCoor">' + latCoordinateDMS + " " + lngCoordinateDMS + "</div>";

      L.DomUtil.get(this._gps).innerHTML = coorsText;
      L.DomUtil.get(this._icon).innerHTML = "";
    }, this);

    return container;
  },

  _addText: function(container, context)
  {
    this._gps = L.DomUtil.create('div', 'leaflet-control-coordinates-gps' , container),
    this._lat = L.DomUtil.create('span', 'leaflet-control-coordinates-lat' , container),
    this._lng = L.DomUtil.create('span', 'leaflet-control-coordinates-lng' , container);
    this._icon = L.DomUtil.create('span', 'leaflet-control-coordinates-icon' , container);

    return container;
  },

  /**
   * This method should be called when user clicks the map.
   * @param event object
   */
  setCoordinates: function(obj)
  {
    if (!this.visible) {
      L.DomUtil.removeClass(this._container, 'hidden');
    }

    L.DomUtil.get(this._gps).innerHTML = "";

    if (obj.latlng) {
      L.DomUtil.get(this._lat).innerHTML = '<strong>' + this.options.latitudeText + ':</strong> ' + obj.latlng.lat.toFixed(this.options.precision).toString();
      L.DomUtil.get(this._lng).innerHTML = '<strong>' + this.options.longitudeText + ':</strong> ' + obj.latlng.lng.toFixed(this.options.precision).toString();
      L.DomUtil.get(this._icon).innerHTML = '<span class="glyphicon glyphicon-triangle-top"></span>';
    }
  }
});