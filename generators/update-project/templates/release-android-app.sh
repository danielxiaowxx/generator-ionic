#!/usr/bin/env bash
gulp clean
gulp release
mv www www_back
mv release/www www

ionic plugin rm cordova-plugin-console

#多渠道-开始
mkdir ./tmp
mv ./platforms/android/AndroidManifest.xml ./tmp/
echo '' > release.log

for version in 'YingYongBao' 'Test'
do
  cp -f ./tmp/AndroidManifest.xml ./platforms/android/
  sed -i -- "s/Channel_ID/$version/g" ./platforms/android/AndroidManifest.xml
  cat ./platforms/android/AndroidManifest.xml | grep $version >> release.log

  ionic build --release android
  jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <%= appName %>-release-key.keystore -storepass $<%= snakeCaseAppName %>_storepass -keypass $<%= snakeCaseAppName %>_keypass platforms/android/build/outputs/apk/android-release-unsigned.apk <%= appName %>
  $ANDROID_HOME/build-tools/23.0.1/zipalign -v 4 platforms/android/build/outputs/apk/android-release-unsigned.apk release/<%= appName %>-$version.apk
done

mv -f ./tmp/AndroidManifest.xml ./platforms/android/
rm -rf ./tmp
#多渠道-结束

ionic plugin add cordova-plugin-console

rm -rf www
mv www_back www

cat release.log