declare module "*.svg" {
  const src: string;
  export default src;
}

// Side-effect-only style imports; the bundler resolves them, `vue-tsc` needs
// them declared (TS2882) and has nothing to bind, hence no exports.
declare module "*.scss" {}
