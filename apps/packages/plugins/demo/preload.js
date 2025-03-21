// proload.js

// 定义 plugin 的 API
const pluginAPI = {
  sayHi() {
    console.log('hello world =======!!!');
  },
}

window.pluginAPI = pluginAPI;