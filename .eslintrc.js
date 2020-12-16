module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'    
  },
  env: {
    "node": true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended"
  ],  
  rules: {
    "no-console": "off"
  }, 
}
