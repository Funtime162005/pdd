const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const path = require("path");
const config = getDefaultConfig(__dirname);
config.resolver.blockList = [
  new RegExp(`^${path.resolve(__dirname, "dist").replace(/\\/g, "\\\\")}[\\\\/].*`),
];

module.exports = withNativeWind(config, { input: "./global.css" });
