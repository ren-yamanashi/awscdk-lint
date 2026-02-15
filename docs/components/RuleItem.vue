<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  isRecommended: {
    type: Boolean,
    default: false,
  },
  isFixable: {
    type: Boolean,
    default: false,
  },
  isDeprecated: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <li class="rule-item">
    <div class="rule-info">
      <a :href="props.link" class="rule-name">
        <slot name="name">{{ props.name }}</slot>
      </a>
      <span class="rule-description">
        <slot name="description">{{ props.description }}</slot>
      </span>
    </div>
    <div class="rule-status">
      <span v-if="props.isRecommended" class="status-icon recommended" title="Recommended">
        <slot name="recommendedIcon">✅</slot>
      </span>
      <span v-if="props.isFixable" class="status-icon fixable" title="Fixable">
        <slot name="fixableIcon">🔧</slot>
      </span>
      <span v-if="props.isDeprecated" class="status-icon deprecated" title="Deprecated">
        <slot name="deprecatedIcon">⚠️</slot>
      </span>
    </div>
  </li>
</template>

<style scoped>
.rule-item {
  margin: 8px 0;
  padding: 16px;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.rule-info {
  flex-grow: 1;
}

.rule-name {
  color: var(--vp-c-brand);
  font-weight: 600;
  text-decoration: none;
  display: block;
  margin-bottom: 4px;
}

.rule-description {
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

.rule-status {
  display: flex;
  gap: 8px;
  padding-top: 4px;
}

.status-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Removed margin-right to rely on gap from .rule-status */
}

.status-icon.recommended {
  color: var(--vp-c-green);
}

.status-icon.fixable {
  color: var(--vp-c-yellow);
}

.status-icon.deprecated {
  color: var(--vp-c-red);
}
</style>
