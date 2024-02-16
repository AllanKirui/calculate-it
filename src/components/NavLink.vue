<template>
  <li>
    <RouterLink :to="routeName">
      <img :src="imgSrc" width="24" height="24" :alt="setImageAltText()" />
      <span>{{ uppercaseFirstLinkChar() }}</span>
    </RouterLink>
  </li>
</template>

<script setup>
const props = defineProps(["routeName", "imgSrc"])

const setImageAltText = () => {
  const routeName = props.routeName

  // set dynamic alt text for the link's image
  return routeName === "math" || routeName === "bmi"
    ? `${routeName} calculator icon`
    : `${routeName} converter icon`
}

const uppercaseFirstLinkChar = () => {
  return props.routeName.slice(0, 1).toUpperCase() + props.routeName.slice(1)
}
</script>
