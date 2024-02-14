<template>
  <div class="app-note">
    <div class="app-note__details">
      <b>PLEASE NOTE:</b> This service is intended for demonstration purposes and should not be used as a working DeFi
      platform.
    </div>
  </div>
</template>

<style lang="scss">
.app-note {
  position: relative;
  overflow: hidden;
  height: 68px;
  background-color: $light-gray;
  color: #000;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
  display: flex;
  align-items: center;
  margin-right: 40px;
  border-radius: 6px 0px 0px 6px;

  @media (max-width: $breakpoint-lg) {
    margin-right: 20px;
  }

  @media (max-width: $breakpoint-sm) {
    margin-right: 0;
  }

  &__details {
    padding: 0 35px 0 20px;
  }

  &::before {
    content: '';
    width: 20px;
    min-width: 20px;
    height: 100%;
    background-color: $warning;
  }
}
</style>
