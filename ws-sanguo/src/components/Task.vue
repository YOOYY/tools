<template>
<div class="panel">
    <code class="scrollbar" v-html="taskContent"></code>
</div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "Task",
    computed: {
        ...mapState(["taskContent"])
    },
}
</script>