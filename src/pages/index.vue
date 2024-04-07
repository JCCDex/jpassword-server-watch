<template>
  <div id="home">
    <section class="left">
      <div>
        <el-col class="logo">
          <img @click="goWel" src="@/images/logo.svg" alt="" />
        </el-col>
        <div class="menusArea" v-for="(menu, index) in menus" :key="index">
          <div
            :class="currentMenuCss(index)"
            @click="menuClick(menu)"
            @mouseenter="menuHover(menu)"
            @mouseleave="menuHover(menu)"
          >
            <img
              style="margin-right: 14px"
              :src="currentMenuIndex === index || menu.meta.isHover ? menu.meta.selectedIcon : menu.meta.icon"
              alt=""
            />
            {{ menu.meta.title }}
          </div>
        </div>
      </div>
    </section>
    <section class="rightSide">
      <menuHead v-if="currentMenuIndex >= 0"></menuHead>
      <div style="width: 100%; height: 100%; overflow: auto">
        <router-view />
      </div>
    </section>
  </div>
</template>

<script>
import getRouters from "@/router/get-routers";
import menuHead from "@/components/menu-head";

export default {
  name: "index",
  computed: {
    menus() {
      const routers = getRouters();
      const router = routers.find((r) => r.meta && r.meta.isMenu);
      return router.children.filter((r) => r.meta && r.meta.showMenu);
    },
    currentMenuIndex() {
      return this.menus.findIndex((m) => {
        return (m.path === this.$route.path && m.meta.showMenu) || this.$route.path.indexOf(m.path) != -1;
      });
    },
  },
  components: {
    menuHead,
  },
  methods: {
    menuHover(menu) {
      if (menu.meta.isSelected) return;
      menu.meta.isHover = !menu.meta.isHover;
      this.$forceUpdate();
    },
    menuClick(menu) {
      this.$router.push(menu.path);
    },
    currentMenuCss(index) {
      return this.currentMenuIndex === index ? "clickMenu wide" : "menus";
    },
    goWel() {
      this.$router.push("/welcome");
    },
  },
};
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
  display: flex;

  section.left {
    width: 240px;
    background: #1e1475;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .logo {
      text-align: center;
      padding: 50px 0px 84px;
      cursor: pointer;
      img {
        width: 200px;
      }
    }
  }
}
.rightSide {
  box-sizing: border-box;
  flex: 1;
  min-width: 200px;
  height: 100%;
  padding: 0 20px;
  display: flex;
  flex-flow: column;
  background: #f8f9fb;
}
.menusArea {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  font-size: 16px;
  margin-bottom: 10px;
}
.menus {
  width: 200px;
  height: 50px;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: #ffffff;
}
.menus:hover {
  background: #ffffff !important;
  color: #4825b5;
  font-weight: 500;
}
.clickMenu {
  width: 200px;
  height: 50px;
  display: flex;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: #4825b5;
  background: #ffffff !important;
}
</style>
