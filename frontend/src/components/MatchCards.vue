<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import { useMatchStore } from '@/stores/matchStore'
import { useUserStore } from '@/stores/userStore'
import { useSwipeStore } from '@/stores/swipeStore'

const props = defineProps<{
  isSidebarCollapsed: boolean
}>()

const matchStore = useMatchStore()
const userStore = useUserStore()
const swipeStore = useSwipeStore()
const stackSize = 3 // Number of cards to show in the stack

const hasNoDevelopers = computed(() => matchStore.potentialMatches.length === 0)

// Watch for user changes to fetch matches when user logs in
watch(() => userStore.user, (newUser) => {
  if (newUser && newUser.id) {
    console.log('User loaded, fetching matches for:', newUser.id)
    matchStore.fetchPotentialMatches()
  }
}, { immediate: true })

const visibleCards = computed(() => {
  const cards = []
  for (let i = 0; i < stackSize; i++) {
    const card = matchStore.potentialMatches[matchStore.currentIndex + i]
    // Skip if the card belongs to the current user
    if (card && (!userStore.user || card.email !== userStore.user.email)) {
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

const handleSwipeRight = async () => {
  if (visibleCards.value.length === 0) return

  const swipedUser = visibleCards.value[0]
  console.log('Swiping right on developer:', swipedUser)

  // Add swipe to swipe store if user is logged in
  if (userStore.user && userStore.user.id) {
    // Record the swipe in the swipe store
    const swipedId = String(swipedUser.id) // Ensure ID is a string
    console.log(`Adding swipe: ${userStore.user.id} → ${swipedId} (liked: true)`)

    await swipeStore.addSwipe({
      swiperId: userStore.user.id,
      swipedId: swipedId,
      isLiked: true
    })

    // Manually force the match detection if this is David Kim (id: 4)
    if (swipedId === "4") {
      console.log("Swiped on David Kim! Checking for mutual like...")
      // Directly fetch matches to update the UI
      await matchStore.fetchMatches()
    }
  }

  // Original match store logic handles UI updates
  matchStore.likeDeveloper(swipedUser.id)
}

const handleSwipeLeft = async () => {
  if (visibleCards.value.length === 0) return

  const swipedUser = visibleCards.value[0]

  // Add swipe to swipe store if user is logged in
  if (userStore.user && userStore.user.id) {
    // Record the swipe in the swipe store
    await swipeStore.addSwipe({
      swiperId: userStore.user.id,
      swipedId: swipedUser.id.toString(),
      isLiked: false
    })
  }

  // Original match store logic handles UI updates
  matchStore.passDeveloper(swipedUser.id)
}
</script>

<template>
  <div class="fixed top-16 right-0 bottom-0 bg-background flex items-center justify-center" :style="{ left: isSidebarCollapsed ? '4rem' : '16rem' }">
    <div class="relative w-full max-w-2xl h-[calc(100vh-4rem)] flex items-center justify-center">
    <div v-if="hasNoDevelopers" class="text-center px-4 py-6 bg-card rounded-xl shadow-lg max-w-md mx-auto">
      <div class="mb-4">
        <svg class="mx-auto h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-xl font-semibold text-text-primary mb-2">You're All Caught Up!</h2>
      <p class="text-text-secondary">You've reviewed all available developers. Check back later for new potential matches!</p>
    </div>
    <div v-else class="w-full max-w-lg px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <!-- Main Container -->
      <div class="relative flex justify-center w-full max-h-[90vh] aspect-[3/4]">
        <!-- Cards Container -->
        <div class="relative w-full h-full">
          <div v-for="(card, index) in visibleCards" :key="card.id"
            class="absolute w-full h-full rounded-3xl bg-card shadow-xl ring-1 ring-gray-900/10 transition-all duration-500 ease-out hover:shadow-2xl"
            :style="getCardStyle(index)">

            <div class="relative h-[60%] w-full overflow-hidden rounded-t-3xl">
              <img :src="card.image" :alt="card.name" class="h-full w-full object-cover object-center" />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div class="text-white">
                  <h1 class="text-xl font-bold">{{ card.name }}</h1>
                  <p class="text-base opacity-90">{{ card.role }}</p>
                  <p class="text-sm opacity-80">{{ card.location }}</p>
                </div>
              </div>
            </div>

            <div class="p-4 h-[40%] overflow-hidden flex flex-col">
              <div class="flex justify-between items-start mb-2">
                <p class="text-sm text-text-secondary line-clamp-3">{{ card.bio }}</p>
              </div>

              <div class="mt-2 flex-grow">
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

              <div class="flex justify-end mt-auto">
                <router-link
                  :to="`/developer/${card.id}`"
                  class="flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-medium whitespace-nowrap hover:translate-x-0.5 transition-transform"
                >
                  View Profile
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </router-link>
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
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>
