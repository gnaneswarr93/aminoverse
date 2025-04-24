module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
          },
        },
      },
    },
  };