<template>
  <!-- Unit Value -->
  <div
    @click="$emit('setActiveDropdown', handleDropdownSelection())"
    class="results-wrapper"
  >
    <h2 class="result" :class="setStyles()">
      {{ getUnitValue() }}
    </h2>
  </div>

  <!-- Unit Name -->
  <div
    @click="$emit('setActiveDropdown', handleDropdownSelection())"
    class="unit-name-wrapper"
  >
    <span>{{ getUnitName() }}</span>
  </div>
</template>

<script setup>
const props = defineProps(["dropdownOwner", "converterData"])
defineEmits(["setActiveDropdown"])

/*
  Methods
*/
const setStyles = () => {
  let styles = ""

  if (
    props.converterData.activeDropdown === "top" &&
    props.dropdownOwner === "top"
  )
    styles += "active"

  if (
    props.converterData.activeDropdown === "bottom" &&
    props.dropdownOwner === "bottom"
  )
    styles += "active"

  if (props.dropdownOwner === "top") {
    if (
      props.converterData.topUnitValue &&
      props.converterData.topUnitValue.length > 16
    )
      styles += " text-2xl"
  }

  if (props.dropdownOwner === "bottom") {
    if (
      props.converterData.bottomUnitValue &&
      props.converterData.bottomUnitValue.length > 16
    )
      styles += " text-2xl"
  }

  return styles
}

const getUnitValue = () => {
  if (props.dropdownOwner === "top")
    return props.converterData.topUnitValue || props.converterData.defaultResult

  return (
    props.converterData.bottomUnitValue || props.converterData.defaultResult
  )
}

const getUnitName = () => {
  if (props.dropdownOwner === "top") return props.converterData.topUnitName
  return props.converterData.bottomUnitName
}

const handleDropdownSelection = () => {
  if (props.dropdownOwner === "top") return "top"
  if (props.dropdownOwner === "bottom") return "bottom"
}
</script>
