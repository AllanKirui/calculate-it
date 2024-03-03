<template>
  <Menu as="div" class="text-left">
    <!-- Initial Option -->
    <div>
      <MenuButton
        class="inline-flex w-full items-center justify-center gap-x-1.5 rounded-md px-3 py-2 text-lg text-navajo-white shadow-sm"
      >
        {{ unitType || activeUnit }}
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
        class="absolute z-10 mt-2 max-h-60 scrollable dropdown-items overflow-scroll w-4/5 sm:w-2/3 md:w-1/2 origin-top-left rounded-md bg-macaroni-and-cheese shadow-lg ring-2 ring-mellow-apricot ring-opacity-1 focus:outline-none text-base md:text-lg text-seal-brown"
      >
        <div v-for="unit in calcUnits" :key="unit" class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              @click="
                $emit('setActiveUnit', unit.shortName ? unit.shortName : unit)
              "
              href="#"
              :class="[active ? 'bg-mellow-apricot' : '', 'block px-4 py-2']"
              >{{ unit.longName ? unit.longName : unit }}</a
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
  unitType: { type: String },
  calcUnits: { type: Object },
  isActive: { type: Boolean, default: false },
  activeUnit: { type: String }
})

defineEmits(["setActiveUnit"])
</script>
