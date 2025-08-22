const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Can\'Lift'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/scss/variables.scss";`
      }
    }
  },
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    hot: true,
    client: {
      overlay: false
    }
  },
  chainWebpack: config => {
    config.module
      .rule('eslint')
      .exclude.add('/home/sdris/canlift/client/src/components/ui/calendar/Calendar.vue')
      .add('/home/sdris/canlift/client/src/components/ui/card/Card.vue')
      .add('/home/sdris/canlift/client/src/components/ui/popover/Popover.vue')
      .end()
  }
})

