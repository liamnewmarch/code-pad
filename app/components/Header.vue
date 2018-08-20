<script>
export default {
  computed: {
    fiddle() {
      return this.$store.state.fiddles[this.$route.params.key];
    },
    isListRoute() {
      return this.$route.name === 'list';
    },
    isSettingsRoute() {
      return this.$route.name === 'settings';
    },
  },
};
</script>

<style>
.top-nav {
  background: linear-gradient(to right, #c678dd, #56b6c2);
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

<template>
  <div>
    <nav v-if="isListRoute" class="top-nav">
      <div class="top-nav__item top-nav__item--title"> Fiddle </div>
    </nav>
    <nav v-else-if="isSettingsRoute" class="top-nav">
      <router-link
        class="top-nav__item top-nav__item--back"
        tag="button"
        :to="{ name: 'list' }"
      > ← </router-link>
      <div class="top-nav__item top-nav__item--title"> Settings </div>
      <router-link
        class="top-nav__item top-nav__item--settings"
        tag="button"
        :to="{ name: 'editor', params: { key: fiddle.key, type: 'html' }}"
      > ⋮ </router-link>
    </nav>
    <nav v-else class="top-nav">
      <router-link
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'editor', params: { key: fiddle.key, type: 'html' }}"
      > HTML </router-link>
      <router-link
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'editor', params: { key: fiddle.key, type: 'css' }}"
      > CSS </router-link>
      <router-link
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'editor', params: { key: fiddle.key, type: 'javascript' }}"
      > JS </router-link>
      <router-link
        active-class="top-nav__item--active"
        class="top-nav__item top-nav__item--tab"
        tag="button"
        replace
        :to="{ name: 'result', params: { key: fiddle.key }}"
      > Result </router-link>
      <router-link
        class="top-nav__item top-nav__item--settings"
        tag="button"
        replace
        :to="{ name: 'settings', params: { key: fiddle.key }}"
      > ⋮ </router-link>
    </nav>
  </div>
</template>
