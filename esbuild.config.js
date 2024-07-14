const esbuild = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');

let minify = true;
if (process.argv.includes('--watch')) {
	minify = false;
}

const buildOptions = {
  entryPoints: ['frontend/src/js/main.js'],  // Your main JS file
  bundle: true,
  outdir: 'dist',
  plugins: [sassPlugin()],
  minify: minify,
  loader: {
    '.js': 'jsx',  // JSX loader
    '.jsx': 'jsx',
    '.woff': 'file',  // Add loaders for font files
    '.woff2': 'file',
    '.ttf': 'file',
    '.eot': 'file',
    '.svg': 'file',
    '.png': 'file',  // Add loaders for images
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
  },
  define: {
    'window.IS_PRODUCTION': minify,
  },
};

async function watchAndServe() {
  try {
    const ctx = await esbuild.context(buildOptions);

    // Watch for changes
    await ctx.watch();
    console.log('Watching for changes...');
	 console.log('Press Ctrl + C to stop.');

    // Serve the files on a separate port
    const server = await ctx.serve({
      port: 3001,
      servedir: 'dist',
    });

    console.log(`Serving at http://${server.host}:${server.port}`);
  } catch (error) {
    console.error('Build or serve failed:', error);
    process.exit(1);
  }
}

if (process.argv.includes('--watch')) {
  watchAndServe();
} else {
  esbuild.build(buildOptions).catch(() => process.exit(1));
}
