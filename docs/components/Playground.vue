<script setup lang="ts">
const props = defineProps({
  link: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: "View on Playground",
  },
});
</script>

<template>
  <div class="mt-4">
    <a :href="props.link" target="_blank" rel="noopener">
      <strong>{{ props.text }}</strong>
      <svg
        class="_icon"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path d="M14 3h7v7" stroke="currentColor" stroke-width="2" fill="none" />
        <path d="M21 3l-12 12" stroke="currentColor" stroke-width="2" fill="none" />
        <rect
          x="5"
          y="5"
          width="14"
          height="14"
          rx="2"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    </a>
  </div>
</template>

<style scoped>
.mt-4 {
  margin-top: 4em;
}

._icon {
  display: inline;
  vertical-align: middle;
  margin-left: 0.3em;
}
</style>
