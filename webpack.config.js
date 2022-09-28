const path = require ('path'); //path viene dentro de node, no hay que instalarlo 
// se trae dicho elemento a la constante path
const HtmlWebpackPlugin = require('html-webpack-plugin');  // plugin paratrabajar con el html en el webpack 
const { Template } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //plugin para poder trabajar con css
const { constants } = require('buffer');
const CopyPlugin = require('copy-webpack-plugin'); // PARA PODER USAR EL PLUGIN DE COPIA DE ARCHIVOS 
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //AGREGAR CONFIGURACION DE WEBPACK PARA EL MODO DESARROLLO

module.exports = {
    entry: './src/index.js', //punto de entrada de la aplicacion en este caso seria index.js
    output:{
        path: path.resolve(__dirname, 'dist'), //path donde se va a guardar nuestro proyecto
        //resolve nos permite saber donde se encuentra nuestro proyecto
        //busca directamente el directorio, cabe reslatar que aqui se usa dist (es un estandar) pero puede ser una carpta con cualquier nombre
        filename: '[name].[contenthash].js', // es el resultante del javascript que se unificara 
        assetModuleFilename: 'asests/images/[hash][ext][query]' // para el estilo de fuentes 
    },
    resolve:{// aqui inidicaremos con que extensiones vamos a usar puede ser js o react depende de con que estes trabajando 
        extensions: ['.js'],
        alias:{ // para crearles una alias a las ubiaciones y facilitar el invocarlas
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: {
        rules:[// agrega los recursos de babel que instalamos anteriormente 
            {
                test: /\.m?js$/, // utiliza cualquier extension mjs o js 
                exclude: /node_modules/, // este se usa para evitar que corra los archivos de node modules ya que romperian la aplicacion
                use:{
                    loader: 'babel-loader' // ya usamos babel
                }
            },
            {
                test : /\.css|.styl$/i,
                use: [
                    MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'stylus-loader'
                ],

            },
            {
                test: /\.png/, //mejora optimizacion de imagenes
                type: "asset/resource"
            },
            {
                test: /\.(woff|woff2)$/,
                use:{
                    loader: "url-loader",
                    options: {
                        // limit => limite de tamaño
                        limit: 10000,
                        // Mimetype => tipo de dato
                        mimetype: "application/font-woff",
                        // name => nombre de salida
                        name: "[name].[contenthash].[ext]",
                        // outputPath => donde se va a guardar en la carpeta final
                        outputPath: "./assets/fonts/",
                        publicPath: "../assets/fonts/",
                        esModule: false,
                    }
                }
            },
        ]
    },
    plugins:[ // se colocan los ´plugins que se estan usando
        new HtmlWebpackPlugin({// configuracion a usar 
            inject: true,
            template: './public/index.html',
            filename: 'index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'
        }),
        new CopyPlugin({
            patterns:[// ubicacion de origen y destino del archivo que vamos a mover 
                {
                    from: path.resolve(__dirname, "src", "assets/images"),
                    to: "assets/images"
                }
            ]
        }),
        new Dotenv(),// variables de entornos 
        new CleanWebpackPlugin(),
    ],
    optimization:{
        minimize : true,
        minimizer :[
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ]
    }

}