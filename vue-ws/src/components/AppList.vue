<template>
  <ol id="applist" class="scrollbar">
    <AppItem
      v-for="(val, name) in applist"
      :key="name"
      :isAlive="val"
      :name="name"
    ></AppItem>
  </ol>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import AppItem from "../components/AppItem.vue";

export default {
  name: "AppList",
  computed: {
    ...mapState(["applist"]),
  },
  components: {
    AppItem,
  },
};
</script>