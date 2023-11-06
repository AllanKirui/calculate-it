<template>
  <Menu as="div" class="text-left">
    <!-- Initial Option -->
    <div>
      <MenuButton
        class="inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-lg text-navajo-white shadow-sm ring-inset ring-mellow-apricot"
        :class="[isActive ? 'ring-1' : '']"
      >
        {{ activeUnit }}
        <ChevronDownIcon
          class="-mr-1 h-6 w-6 text-navajo-white"
          aria-hidden="true"
        />
      </MenuButton>
    </div>

    <!-- Menu Items -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-macaroni-and-cheese shadow-lg ring-2 ring-mellow-apricot ring-opacity-1 focus:outline-none text-base md:text-lg text-seal-brown"
      >
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              @click="$emit('setActiveUnit', 't')"
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >Tonne t</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="$emit('setActiveUnit', 'kg')"
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >Kilogram kg</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="$emit('setActiveUnit', 'g')"
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >Gram g</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="$emit('setActiveUnit', 'mg')"
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >Milligram mg</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="$emit('setActiveUnit', 'lb')"
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >Pound lb</a
            >
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click="$emit('setActiveUnit', 'oz')"
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >Ounce oz</a
            >
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { ChevronDownIcon } from "@heroicons/vue/20/solid"

defineProps({
  isActive: { type: Boolean, default: false },
  activeUnit: { type: String, default: "kg" }
})

defineEmits(["setActiveUnit"])
</script>
