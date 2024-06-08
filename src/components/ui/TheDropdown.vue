<template>
  <Menu v-slot="{ close }" as="div" class="text-left">
    <!-- Initial Option -->
    <div>
      <MenuButton class="menu-button">
        {{ unitType || activeUnit }}
        <ChevronDownIcon
          class="-mr-1 h-6 w-6 text-navajo-white"
          aria-hidden="true"
        />
      </MenuButton>
    </div>

    <!-- Menu Items -->
    <Teleport to="body">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems class="menu-items-wrapper">
          <!-- Menu Items Wrapper -->
          <div class="pb-10">
            <div v-for="unit in calcUnits" :key="unit" class="py-1">
              <MenuItem v-slot="{ active }">
                <a
                  @click="
                    $emit(
                      'setActiveUnit',
                      unit.shortName ? unit.shortName : unit
                    )
                  "
                  href="#"
                  :class="[
                    active ? 'bg-mellow-apricot' : '',
                    'block px-2 py-2 rounded-md'
                  ]"
                  >{{ unit.longName ? unit.longName : unit }}</a
                >
              </MenuItem>
            </div>
          </div>

          <!-- Close Button Wrapper -->
          <div class="absolute w-full px-5 left-0 right-0 bottom-5">
            <button
              class="w-full p-2 bg-sandy-brown text-seal-brown rounded-md"
              @click="close"
            >
              Close
            </button>
          </div>
        </MenuItems>
      </transition>
    </Teleport>
  </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { ChevronDownIcon } from "@heroicons/vue/20/solid"

defineProps({
  unitType: { type: String },
  calcUnits: { type: Object },
  activeUnit: { type: String }
})

defineEmits(["setActiveUnit"])
</script>
