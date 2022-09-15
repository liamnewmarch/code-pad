<script>
export default {
  computed: {
    isListRoute() {
      return this.$route.name === 'list';
    },
    isGlobalSettingsRoute() {
      return this.$route.name === 'global-settings';
    },
  },
};
</script>

<template>
  <div>
    <nav
      v-if="isListRoute"
      class="top-nav"
    >
      <div class="top-nav__item top-nav__item--title">
        Code Pad
      </div>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--settings"
        replace
        :to="{ name: 'global-settings' }"
      >
        ⚙
      </RouterLink>
    </nav>
    <nav
      v-else-if="isGlobalSettingsRoute"
      class="top-nav"
    >
      <RouterLink
        class="top-nav__item top-nav__item--back"
        :to="{ name: 'list' }"
      >
        ←
      </RouterLink>
      <div class="top-nav__item top-nav__item--title">
        Settings
      </div>
    </nav>
    <nav
      v-else
      class="top-nav"
    >
      <RouterLink
        class="top-nav__item top-nav__item--back"
        :to="{ name: 'list' }"
      >
        ←
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        replace
        :to="{ name: 'editor', params: { type: 'html' }}"
      >
        HTML
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        replace
        :to="{ name: 'editor', params: { type: 'css' }}"
      >
        CSS
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        replace
        :to="{ name: 'editor', params: { type: 'javascript' }}"
      >
        JS
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        replace
        :to="{ name: 'result' }"
      >
        Result
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--settings"
        replace
        :to="{ name: 'project-settings' }"
      >
        ⚙
      </RouterLink>
    </nav>
  </div>
</template>

<style>
.top-nav {
  background-color: #fff2;
  display: flex;
  flex-shrink: 0;
  list-style: none;
  overflow: scroll;
  padding: 0 .2rem;
}

.top-nav__item {
  background-color: #0006;
  border-radius: .2rem .2rem 0 0;
  color: inherit;
  flex: 0 0 2rem;
  line-height: 3rem;
  margin: .4rem .2rem 0;
  padding: 0 1rem;
  text-align: center;
  text-decoration: none;
  user-select: none;
}

.top-nav__item--active {
  background-color: #111;
}

.top-nav__item--tab,
.top-nav__item--title {
  flex-grow: 1;
}

.top-nav__item--title {
  font-size: 1.2rem;
}
</style>
