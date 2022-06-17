const bootstrapSassAbstractsImports = require('vue-cli-plugin-bootstrap-vue/sassAbstractsImports.js')
module.exports = {
    css: {
		loaderOptions: {
			sass: {
				additionalData: '@import "~bootstrap/scss/_functions.scss"\n@import "~@/assets/scss/vendors/bootstrap-vue/_custom.scss"\n@import "~bootstrap/scss/_variables.scss"\n@import "~bootstrap/scss/_mixins.scss"\n@import "~bootstrap-vue/src/_variables.scss"'
			},
			scss: {
				additionalData: '@import "~bootstrap/scss/_functions.scss";\n@import "~@/assets/scss/vendors/bootstrap-vue/_custom.scss";\n@import "~bootstrap/scss/_variables.scss";\n@import "~bootstrap/scss/_mixins.scss";\n@import "~bootstrap-vue/src/_variables.scss";\n'
			}
		}
	},

    publicPath: '/BobaID/',
    outputDir: 'docs'
}