<template>
  <Transition name="fade">
    <div :id="`map-${address?.id}`" style="width: 100%; height: 50vw">mapa</div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { Address } from "@/services/api/types";
import { PropType } from "vue";
import MapOptions = google.maps.MapOptions;

const props = defineProps({
  address: {
    type: Object as PropType<Address>,
    default: () => null
  }
})

const buildMap = async (address: Address) => {

  const loader = new Loader({
    apiKey: 'AIzaSyBuzYmU9c19xWHZ6JObfuX4PgfMtUzRydo',
    version: 'weekly',
    libraries: ['places']
  })

  const { Map } = await loader.importLibrary('maps')

  const mapOptions: MapOptions = {
    center: {
      lat: address.lat as number,
      lng: address.lng as number
    },
    zoom: 16,
    zoomControl: false,
    fullscreenControl: false,
    scrollwheel: false,
    gestureHandling: 'none'
  }

  const map = new Map(document.getElementById('map-' + address.id) as HTMLElement, mapOptions)

  new google.maps.Marker({
    position: map.getCenter(),
    map
  })
}


watch(() => props.address, (value) => {
  if (value) {
    buildMap(value)
  }
})

onMounted(() => {
  buildMap(props.address)
})



</script>

<style scoped>
iframe {
  border: 0;
}
</style>
