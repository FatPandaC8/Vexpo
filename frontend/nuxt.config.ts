import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss() as any,
    ],
  },
  modules: ['@nuxt/ui', 'nuxt-svgo', '@nuxt/image'],
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3001'
    }
  }
});