import { sxzz } from '@sxzz/eslint-config'

export default sxzz({
  typescript: true,
  ignores: ['dist', 'node_modules', 'coverage'],
  vue: false,
  react: false,
  json: true,
  markdown: true,
})
