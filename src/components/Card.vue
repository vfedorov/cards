<template>
  <transition :name="transition" appear mode="out-in">
    <div v-if="image">
      <transition appear mode="out-in" name="fade">
        <img :key="image" :src="image" class="isImage mx-auto d-block">
      </transition>
    </div>
    <div v-else class="noImage d-flex justify-content-center">
    </div>
  </transition>
</template>

<script>
export default {
  name: "Card-Component",
  props: {
    image: String,
    transition: String
  }
}
</script>

<style>
.noImage {
  width: 226px;
  height: 314px;
  border: solid 2px black;
  border-radius: 15px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active {
  transition: all .3s ease;
}

.slide-left-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-left-enter, .slide-left-leave-to {
  transform: translateX(-200px);
}
</style>