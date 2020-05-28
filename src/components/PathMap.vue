<template>
  <div class="deck-container">
    <div id="map" ref="map"></div>
    <canvas id="deck-canvas" ref="canvas"></canvas>
  </div>
</template>

<script>
import { PathLayer } from "@deck.gl/layers";
import deck, { Deck, FlyToInterpolator } from "@deck.gl/core";
const data = require("../assets/routes-data.json");
import mapboxgl from "mapbox-gl";

export default {
  data() {
    return {
      accessToken: process.env.VUE_APP_MAPBOX_TOKEN,
      mapStyle: "mapbox://styles/haxzie/ck0aryyna2lwq1crp7fwpm5vz",
      pathData: data,
      viewState: {
        latitude: 12.976387,
        longitude: 77.571529,
        zoom: 4,
        bearing: 0,
        pitch: 0,
      },
    };
  },
  computed: {
    getLayers() {
      const paths = new PathLayer({
        id: "path-layer",
        data: this.pathData,
        widthScale: 20,
        widthMinPixels: 2,
        getPath: (d) => d.path,
        getColor: (d) => [255, (1 - d.data.distance / 100) * 255, 0],
        getWidth: (d) => 2,
      });
      return [paths];
    },
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.map = null;
    this.deck = null;
  },
  methods: {
    updateMapPosition(viewState) {
      console.log("updating view state...");
      this.map.jumpTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        bearing: viewState.bearing,
        pitch: viewState.pitch,
      });
    },
    setInitialView() {
      const { latitude, longitude, pitch, bearing, zoom } = this.viewState;
      this.deck.setProps({
        viewState: {
          latitude,
          longitude,
          pitch,
          bearing,
          zoom: 12,
          transitionDuration: 3000,
          transitionInterpolator: new FlyToInterpolator(),
        },
      });
    },
  },
  mounted() {
    console.log("rerendering...");
    // creating the map
    this.map = new mapboxgl.Map({
      accessToken: this.accessToken,
      container: this.$refs.map,
      interactive: false,
      style: "mapbox://styles/haxzie/ck52gt5wl4t521cqh8fq9kbme",
      center: [this.viewState.longitude, this.viewState.latitude],
      zoom: this.viewState.zoom,
      pitch: this.viewState.pitch,
      bearing: this.viewState.bearing,
    });

    this.deck = new Deck({
      canvas: this.$refs.canvas,
      width: "100%",
      height: "100%",
      initialViewState: this.viewState,
      controller: true,
      // change the map's viewstate whenever the view state of deck.gl changes
      onViewStateChange: ({ viewState }) => {
        console.log("Viewstate changed");
        this.updateMapPosition(viewState);
        //this.$emit("viewStateChange", viewState);
      },
      layers: this.getLayers,
    });

    setTimeout(() => {
      this.setInitialView()
    }, 5000);
  },
};
</script>

<style lang="scss">
.deck-container {
  width: 100%;
  height: 100%;
  position: relative;
  #map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #e5e9ec;
    overflow: hidden;
  }
  #deck-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
