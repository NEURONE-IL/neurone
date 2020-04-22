import template from './mapsSearch.html';
import * as L from 'leaflet'


class MapsSearch {


  constructor($scope, $reactive) {
    'ngInject';

    this.map = L.map('map', {
        center: [0,0],
        zoom: 1
    })
    this.key = process.env.MAPTILER_KEY || 'XNctrGMVMOj0xErblNkx'
    this.query = '';

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=FK6IyF0SSYRBgXIOez8T',{//'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                              maxZoom: 19,
                              attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'})
    .addTo(this.map);

    //setTimeout(function(){this.map.invalidateSize()},100) 

  }

  Search(){
    this.map.invalidateSize()
    const fetch = require('node-fetch');
    var urlGet = 'https://api.maptiler.com/geocoding/'+this.query+'.json?key='+this.key,
        popup;

    fetch(urlGet)
    .then(res => res.json())   
    .then(json => {
      this.doc = json.features[0];
      this.map.fitBounds([[this.doc.bbox[1],[this.doc.bbox[0]]],[this.doc.bbox[3],[this.doc.bbox[2]]]])
      popup =L.popup().setLatLng(this.doc.center.reverse()).setContent(this.doc.place_type +' '+ this.doc.place_name).openOn(this.map)
    })
  }

  parseMapsForm() {
    
    let form = {
      query: this.query,
    };
    return form;
  }
}

const name = 'mapsSearch';

export default angular.module(name, [
])
.component(name, {
  template: template.default,
  controllerAs: name,
  controller: MapsSearch
});
