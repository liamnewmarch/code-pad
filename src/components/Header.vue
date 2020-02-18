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
        &lt;/&gt;
      </div>
    </nav>
    <nav
      v-else-if="isGlobalSettingsRoute"
      class="top-nav"
    >
      <RouterLink
        class="top-nav__item top-nav__item--back"
        tag="button"
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
        tag="button"
        :to="{ name: 'list' }"
      >
        ←
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'editor', params: { type: 'html' }}"
      >
        HTML
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'editor', params: { type: 'css' }}"
      >
        CSS
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'editor', params: { type: 'javascript' }}"
      >
        JS
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'result' }"
      >
        Result
      </RouterLink>
      <RouterLink
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--settings"
        tag="button"
        replace
        :to="{ name: 'project-settings' }"
      >
        ⋮
      </RouterLink>
    </nav>
  </div>
</template>

<style>
.top-nav {
  background: linear-gradient(to right, #e06c75, #56b6c2);
  display: flex;
  flex-shrink: 0;
  list-style: none;
  overflow: scroll;
  padding: 0 .2rem;
}

.top-nav__item {
  background-color: #272822;
  background-color: #27282288;
  border: 0;
  border-radius: .2rem .2rem 0 0;
  flex: 0 0 2rem;
  line-height: 3rem;
  margin: .4rem .2rem 0;
  padding: 0 1rem;
  text-align: center;
  user-select: none;
}

.top-nav__item--active {
  background-color: #272822;
}

.top-nav__item--tab,
.top-nav__item--title {
  flex-grow: 1;
}
</style>
