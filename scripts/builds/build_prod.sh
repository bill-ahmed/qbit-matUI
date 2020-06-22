# A script to create production builds for both Windows and Unix systems
# The only difference between them is the file path delimeter used, where
# '\' is for Windows while '/' is for Unix-based systems.
#
# ***
# NOTE: IT IS ASSUMED THIS SCRIPT IS RUN FROM THE PROJECT ROOT
# ***

# Current application version -- SHOULD BE SAME AS IN app.config.json
app_ver="1.6.1"

# Where the build is stored
default_build_path="dist"
default_build_dir="dist/qbit-WebUI"

# Names of each build
win_build="qbit-matUI_Windows_$app_ver"
unix_build="qbit-matUI_Other_OS_$app_ver"
login_build="login"

# Step (0) -- Delete all existing builds
echo "Deleting existing builds..."
rm -rf "$default_build_path/$win_build" "$default_build_path/$win_build.zip"
rm -rf "$default_build_path/$unix_build" "$default_build_path/$unix_build.zip"
rm -rf "$default_build_path/$login_build"

# Step (1) -- Build for Windows
echo
echo "Building for Windows..."
cp -v -f scripts/assets/config.windows.json src/assets/config.prod.json
ng build --prod
mkdir "$default_build_path/$win_build"
mv -v $default_build_dir "$default_build_path/$win_build/private"        # Each application should be under private folder

# Step (2) -- Build for Unix
echo
echo "Building for Unix..."
cp -v -f scripts/assets/config.unix.json src/assets/config.prod.json
ng build --prod
mkdir "$default_build_path/$unix_build"
mv -v $default_build_dir "$default_build_path/$unix_build/private"       # Each application should be under private folder

# Step (4) -- Build login page
echo
echo "Building login page..."
ng build --prod --project="login"

# Step (5) -- Copy login page to both Unix & Windows builds
echo
echo "Copying login page to existing builds..."
cp -r "$default_build_path/$login_build" "$default_build_path/$win_build/public"
cp -r "$default_build_path/$login_build" "$default_build_path/$unix_build/public"

# Step (6) -- Compress both builds into .zip
echo "Compressing builds..."
pushd "$default_build_path" > /dev/null
tar.exe -a -c -f "$win_build.zip" "$win_build"
tar.exe -a -c -f "$unix_build.zip" "$unix_build"
popd > /dev/null

echo
echo "Done!"
