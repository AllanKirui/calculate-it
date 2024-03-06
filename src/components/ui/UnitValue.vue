<template>
  <!-- Unit Value -->
  <div
    @click="$emit('setActiveDropdown', handleDropdownSelection())"
    class="results-wrapper"
  >
    <h2
      class="result"
      :class="[
        activeDropdown === 'top' && dropdownOwner === 'top' ? 'active' : '',
        activeDropdown === 'bottom' && dropdownOwner === 'bottom'
          ? 'active'
          : '',
        unitValue && unitValue.length > 20 ? 'text-2xl' : ''
      ]"
    >
      {{ unitValue || defaultResult }}
    </h2>
  </div>

  <!-- Unit Name -->
  <div
    @click="$emit('setActiveDropdown', handleDropdownSelection())"
    class="unit-name-wrapper"
  >
    <span>{{ unitName }}</span>
  </div>
</template>

<script setup>
const props = defineProps([
  "dropdownOwner",
  "activeDropdown",
  "unit-value",
  "unit-name",
  "default-result"
])
defineEmits(["setActiveDropdown"])

const handleDropdownSelection = () => {
  if (props.dropdownOwner === "top") return "top"
  if (props.dropdownOwner === "bottom") return "bottom"
}
</script>
