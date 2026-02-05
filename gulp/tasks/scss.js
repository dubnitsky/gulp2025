import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import cleanCss from 'gulp-clean-css'; // Сжатие CSS
import webpcss from 'gulp-webpcss'; // Вывод WEBP изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендорных префиксов, кроссбраузерность
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Групировка медиазапросов

const sass = gulpSass(dartSass);

export const scss = () => {
   return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
      .pipe(app.plugins.plumber(
         app.plugins.notify.onError({
            title: "SCSS",
            message: "Error: <%= error.message %>"
         }))) //алерты
      .pipe(app.plugins.replace(/@img\//g, '../img/')) //обработка аллиасов
      .pipe(sass({
         outputStyle: 'expanded'
      }))
      .pipe(
         app.plugins.if(
            app.isBuild,
            groupCssMediaQueries()
         )
      )

      .pipe(
         app.plugins.if(
            app.isBuild,
            webpcss(
               {
                  webpClass: ".webp", //если браузер поддерживает то выводится, JS код проверяет
                  noWebpClass: ".no-webp"
               }
            )
         )
      )

      .pipe(
         app.plugins.if(
            app.isBuild,
            autoprefixer({
               grid: true, //поддержка гридов
               overrideBrowserslist: ["last 3 version"], //кол-во версий браузера
               cascade: true
            })
         )
      )

      .pipe(app.gulp.dest(app.path.build.css)) //раскоментить если нужен не сжатый дубль файла стилей
      .pipe(
         app.plugins.if(
            app.isBuild,
            cleanCss()
         )
      )

      .pipe(rename({
         extname: ".min.css"
      }))
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream());
}
