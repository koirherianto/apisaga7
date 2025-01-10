// vite.config.ts
import { defineConfig } from "file:///C:/D/program/typescipt/apisaga7/node_modules/vite/dist/node/index.js";
import { getDirname } from "file:///C:/D/program/typescipt/apisaga7/node_modules/@adonisjs/core/build/src/helpers/main.js";
import inertia from "file:///C:/D/program/typescipt/apisaga7/node_modules/@adonisjs/inertia/build/src/plugins/vite.js";
import { svelte } from "file:///C:/D/program/typescipt/apisaga7/node_modules/@sveltejs/vite-plugin-svelte/src/index.js";
import adonisjs from "file:///C:/D/program/typescipt/apisaga7/node_modules/@adonisjs/vite/build/src/client/main.js";
import { sveltePreprocess } from "file:///C:/D/program/typescipt/apisaga7/node_modules/svelte-preprocess/dist/index.js";
var __vite_injected_original_import_meta_url = "file:///C:/D/program/typescipt/apisaga7/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    svelte({
      preprocess: [sveltePreprocess({ typescript: true, postcss: true, sass: true })]
    }),
    adonisjs({ entrypoints: ["inertia/app/app.ts"], reload: ["resources/views/**/*.edge"] })
  ],
  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      "~/": `${getDirname(__vite_injected_original_import_meta_url)}/inertia/`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxEXFxcXHByb2dyYW1cXFxcdHlwZXNjaXB0XFxcXGFwaXNhZ2E3XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxEXFxcXHByb2dyYW1cXFxcdHlwZXNjaXB0XFxcXGFwaXNhZ2E3XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9EL3Byb2dyYW0vdHlwZXNjaXB0L2FwaXNhZ2E3L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB7IGdldERpcm5hbWUgfSBmcm9tICdAYWRvbmlzanMvY29yZS9oZWxwZXJzJ1xuaW1wb3J0IGluZXJ0aWEgZnJvbSAnQGFkb25pc2pzL2luZXJ0aWEvY2xpZW50J1xuaW1wb3J0IHsgc3ZlbHRlIH0gZnJvbSAnQHN2ZWx0ZWpzL3ZpdGUtcGx1Z2luLXN2ZWx0ZSdcbmltcG9ydCBhZG9uaXNqcyBmcm9tICdAYWRvbmlzanMvdml0ZS9jbGllbnQnXG5pbXBvcnQgeyBzdmVsdGVQcmVwcm9jZXNzIH0gZnJvbSAnc3ZlbHRlLXByZXByb2Nlc3MnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBpbmVydGlhKHsgc3NyOiB7IGVuYWJsZWQ6IGZhbHNlIH0gfSksXG4gICAgc3ZlbHRlKHtcbiAgICAgIHByZXByb2Nlc3M6IFtzdmVsdGVQcmVwcm9jZXNzKHsgdHlwZXNjcmlwdDogdHJ1ZSwgcG9zdGNzczogdHJ1ZSwgc2FzczogdHJ1ZSB9KV0sXG4gICAgfSksXG4gICAgYWRvbmlzanMoeyBlbnRyeXBvaW50czogWydpbmVydGlhL2FwcC9hcHAudHMnXSwgcmVsb2FkOiBbJ3Jlc291cmNlcy92aWV3cy8qKi8qLmVkZ2UnXSB9KSxcbiAgXSxcblxuICAvKipcbiAgICogRGVmaW5lIGFsaWFzZXMgZm9yIGltcG9ydGluZyBtb2R1bGVzIGZyb21cbiAgICogeW91ciBmcm9udGVuZCBjb2RlXG4gICAqL1xuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICd+Lyc6IGAke2dldERpcm5hbWUoaW1wb3J0Lm1ldGEudXJsKX0vaW5lcnRpYS9gLFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5UixTQUFTLG9CQUFvQjtBQUN0VCxTQUFTLGtCQUFrQjtBQUMzQixPQUFPLGFBQWE7QUFDcEIsU0FBUyxjQUFjO0FBQ3ZCLE9BQU8sY0FBYztBQUNyQixTQUFTLHdCQUF3QjtBQUw4SSxJQUFNLDJDQUEyQztBQU9oTyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsTUFBTSxFQUFFLENBQUM7QUFBQSxJQUNuQyxPQUFPO0FBQUEsTUFDTCxZQUFZLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxNQUFNLFNBQVMsTUFBTSxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQUEsSUFDaEYsQ0FBQztBQUFBLElBQ0QsU0FBUyxFQUFFLGFBQWEsQ0FBQyxvQkFBb0IsR0FBRyxRQUFRLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztBQUFBLEVBQ3pGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLE1BQU0sR0FBRyxXQUFXLHdDQUFlLENBQUM7QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
