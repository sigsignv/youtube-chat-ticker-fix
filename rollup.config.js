import typescript from '@rollup/plugin-typescript'
import metablock from 'rollup-plugin-userscript-metablock'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/youtube-chat-ticker-fix.user.js',
      format: 'iife',
      indent: false,
    },
    plugins: [
      typescript(),
      metablock(),
    ],
  },
]
