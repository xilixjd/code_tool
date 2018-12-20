module.exports = {
  presets: [
    // ["@babel/preset-env"]
    ["env", {
      "targets": {
        "browsers": ["last 2 Chrome versions"]
      }
    }]
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
