import path from 'path';
// import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';


const isDevelopment = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
    name: 'slack'
    , mode: isDevelopment ? 'development' : 'production'
    , devtool: isDevelopment ? 'hidden-source-map' : 'inline-source-map'
    , resolve: {
        extensions: ['.ts', '.js', 'jsx', 'tsx', '.json'],
        alias: {
            '@hooks': path.resolve(__dirname, 'hooks')
            , '@components': path.resolve(__dirname, 'components')
            , '@layouts': path.resolve(__dirname, 'layouts')
            , '@pages': path.resolve(__dirname, 'pages')
            , '@typings': path.resolve(__dirname, 'typings')
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
                                targets: { browsers: ['last 2 versions', 'safari >= 7'] },
                                debug: isDevelopment,
                            },
                        ],
                        '@babel/preset-react'
                        , '@bable/preset-typescript'
                    ],
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
        // new ForkTsCheckerWebpackPlugin({
        //     async: false,
        // }),
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
    // devServer: {
    //     historyApiFallback: true,
    //     port: 3090,
    //     publickPath: '/dist/',
    //     proxy: {
    //     }
    // }
};

// 개발환경일 때 쓸 플러그인들
if (isDevelopment && config.plugins) {
    // config.plugins.push(new webpack.HotModuleReplacementPlugin());
    // config.plugins.push(new ReactRefreshWebpackPlugin());
    // config.plugins.push(new BundleAnalyzerPlugin({ analyzeMode: 'server', openAnalyzer: false }));

}

// 배포환경일 때
if (!isDevelopment && config.plugins) {
    // config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
    // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}
    
