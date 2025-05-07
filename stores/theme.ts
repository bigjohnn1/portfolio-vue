import { defineStore } from "pinia";
import { useColorMode } from "@vueuse/core";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const colorMode = useColorMode({
      attribute: "class",
      modes: {
        light: "light",
        dark: "dark",
      },
      initialValue: "light",
    });

    const currentTheme = ref(colorMode.value);

    const toggleTheme = () => {
      currentTheme.value = currentTheme.value === "light" ? "dark" : "light";
      colorMode.value = currentTheme.value;
    };

    return { currentTheme, toggleTheme };
  },
  {
    persist: true,
  }
);
