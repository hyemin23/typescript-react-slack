import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'hidden-source-map' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['IE 10'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      // babel이 css도 javascript로 바꿔주기 때문에 여기서 css관련 loader를 설정해줘야함
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // ts,webpack이랑 동시에 돌아가게 해주는 기능
    new ForkTsCheckerWebpackPlugin({
      async: false,
    }),
    // react 에서 NODE_ENV 변수를 사용할 수 있게 만들어줌 원래는 backend에서만 실행 가능함(노드 런타임 때만 접근 가능하지만)
    // 해당 설정을 해주면 NODE_ENV 접근 가능
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
  ],
  // 위에 entry부터 뚝딱뚝딱 설정해서 나온 파일들이 output에 저장 됨.
  output: {
    // alecture의 dist 폴더 = alecture/dist 폴더
    path: path.join(__dirname, 'dist'),
    // 여기 name은 entry의 key 값이 됨. entry key는 여러개를 만들 수 있음
    filename: '[name].js',
    publicPath: '/dist/',
  },

  devServer: {
    historyApiFallback: true, //react router설정 시 필요한 설정. 새로고침 시 사이트가 오류남, 새로고침 시 올바른 주소로 매핑시켜 주게끔 도와줌
    port: 3090,
    publicPath: '/dist/',
    // cors 오류 해결 방법 중 하나 proxy. 또는 server에서 설정
    // proxy에서 api로 시작하는 요청은 3095로 보내야겠다는 의미.
    // 추가적인 option 요청이 안 감.  ex) 마치 3095 포트를 쓰는 것 마냥 도메인 속여버림
    // 단, 둘 다 localhost일 경우에만 cors 오류를 피해갈 수 있음
    // 또한 proxy를 사용하지 않으면 axios 요청시 localhost:3095:~~ 이렇게 명시적으로 적어줘야함
    // 배포시에는 proxy를 사용하지 않음
    proxy: {
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
        ws: true,
      },
    },
  },
};

// 개발환경일 때 쓸 플러그인들
if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzeMode: 'server', openAnalyzer: false }));
}

// 배포환경일 때
if (!isDevelopment && config.plugins) {
  // config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
