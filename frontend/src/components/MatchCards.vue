<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useMatchStore } from '../stores/matchStore'

const props = defineProps<{
  isSidebarCollapsed: boolean
}>()

const matchStore = useMatchStore()
const stackSize = 3 // Number of cards to show in the stack

const visibleCards = computed(() => {
  const cards = []
  for (let i = 0; i < stackSize; i++) {
    const card = matchStore.potentialMatches[matchStore.currentIndex + i]
    if (card) {
      cards.push({
        ...card,
        name: card.name,
        role: card.bio.split(' ').slice(0, 3).join(' '),
        location: card.location,
        bio: card.bio,
        skills: card.skills,
        image: card.avatar,
        index: i
      })
    }
  }
  return cards
})

const getCardStyle = (index: number) => {
  return {
    transform: `translate(0, 0) scale(${1 - (index * 0.05)})`,
    zIndex: stackSize - index,
    opacity: 1 - (index * 0.2),
    top: `${index * 8}px`
  }
}

const handleSwipeRight = () => {
  if (visibleCards.value.length === 0) return
  matchStore.likeDeveloper(visibleCards.value[0].id)
}

const handleSwipeLeft = () => {
  if (visibleCards.value.length === 0) return
  matchStore.passDeveloper(visibleCards.value[0].id)
}

onMounted(() => {
  matchStore.fetchPotentialMatches()
})
</script>

<template>
  <div class="fixed top-16 right-0 bottom-0 bg-background flex items-center justify-center" :style="{ left: isSidebarCollapsed ? '4rem' : '16rem' }">
    <div class="relative w-full max-w-2xl h-[calc(100vh-4rem)] flex items-center justify-center">
    <div class="w-full max-w-lg px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <!-- Main Container -->
      <div class="relative flex justify-center w-full max-h-[90vh] aspect-[3/4]">
        <!-- Cards Container -->
        <div class="relative w-full h-full">
          <div v-for="(card, index) in visibleCards" :key="card.id"
            class="absolute w-full h-full rounded-3xl bg-card shadow-xl ring-1 ring-gray-900/10 transition-all duration-500 ease-out hover:shadow-2xl"
            :style="getCardStyle(index)">

            <div class="relative h-[60%] w-full overflow-hidden rounded-t-3xl">
              <img :src="card.image" :alt="card.name" class="h-full w-full object-cover" />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div class="text-white">
                  <h1 class="text-xl font-bold">{{ card.name }}</h1>
                  <p class="text-base opacity-90">{{ card.role }}</p>
                  <p class="text-sm opacity-80">{{ card.location }}</p>
                </div>
              </div>
            </div>

            <div class="p-4 h-[40%] overflow-hidden">
              <p class="text-sm text-text-secondary line-clamp-3">{{ card.bio }}</p>

              <div class="mt-2">
                <h2 class="text-base font-semibold text-text-primary mb-2">Skills</h2>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="skill in card.skills"
                    :key="skill"
                    class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons Container -->
        <div class="absolute inset-y-0 -left-48 -right-48 flex items-center justify-between pointer-events-none" style="z-index: 20">
          <button
            @click="handleSwipeLeft"
            class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-error/10 text-error transition-all hover:bg-error/20 hover:scale-105 shadow-lg"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="hidden sm:inline font-medium">Not Interested</span>
          </button>

          <button
            @click="handleSwipeRight"
            class="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success transition-all hover:bg-success/20 hover:scale-105 shadow-lg"
          >
            <span class="hidden sm:inline font-medium">Let's Connect</span>
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
