#!/bin/bash

# Usage debian_build.sh [-v version] [-b motech_trunk_directory] [-d destination_directory]

TMP_DIR=/tmp/motech-debian-build-$$
WARNAME=motech-platform-server.war
CURRENT_DIR=`pwd`

# exit on non-zero exit code
set -e

# Set motech directory
MOTECH_BASE=.

while getopts "v:b:d:" opt; do
	case $opt in
	v)
		MOTECH_VERSION=$OPTARG
		WARNAME=motech-platform-server-$MOTECH_VERSION.war
	;;
	b)
		MOTECH_BASE=$OPTARG
	;;
	d)
	    BUILD_DIR=$OPTARG
	;;
	s)
	    CONTENT_DIR=$OPTARG/main/debian
    ;;
	esac
done

if [ -z $CONTENT_DIR ]; then
    CONTENT_DIR=$MOTECH_BASE/packaging/deb/src/main/debian
fi

if [ -z $BUILD_DIR ]; then
    BUILD_DIR=$MOTECH_BASE/packaging/deb/target
fi

if [ -z $MOTECH_VERSION ]; then
    echo "Version not specified"
    exit 1
fi

mkdir -p $BUILD_DIR

ARTIFACT_DIR=$BUILD_DIR/artifacts
DEPENDENCY_DIR=$BUILD_DIR/dependencies

MOTECH_PACKAGENAME="motech_$MOTECH_VERSION.deb"
MOTECH_BASE_PACKAGENAME="motech-base_$MOTECH_VERSION.deb"

MOTECH_WAR=$ARTIFACT_DIR/$WARNAME

echo "====================="
echo "Building motech-base"
echo "====================="

if [ ! -f $MOTECH_WAR ]; then
    echo $MOTECH_WAR does not exist
    exit 2
fi

# Create a temp dir for package building
mkdir $TMP_DIR
cp $MOTECH_WAR $TMP_DIR
cd $TMP_DIR

# Create empty dirs if missing
mkdir -p motech-base/var/cache/motech/work/Catalina/localhost
mkdir -p motech-base/var/cache/motech/temp
mkdir -p motech-base/var/cache/motech/felix-cache
mkdir -p motech-base/var/lib/motech/webapps
mkdir -p motech-base/var/lib/motech/data/bundles
mkdir -p motech-base/var/lib/motech/data/rules
mkdir -p motech-base/var/lib/motech/data/config
mkdir -p motech-base/var/log/motech
mkdir -p motech-base/usr/share/motech

# copy motech-base
cp -R $CONTENT_DIR/motech-base .
mv $WARNAME ./motech-base/var/lib/motech/webapps/ROOT.war

# handle changelogs
perl -p -i -e "s/\\$\\{version\\}/$MOTECH_VERSION/g" ./motech-base/usr/share/doc/motech-base/changelog
perl -p -i -e "s/\\$\\{version\\}/$MOTECH_VERSION/g" ./motech-base/usr/share/doc/motech-base/changelog.Debian

gzip --best ./motech-base/usr/share/doc/motech-base/changelog
gzip --best ./motech-base/usr/share/doc/motech-base/changelog.Debian

# Update version
perl -p -i -e "s/\\$\\{version\\}/$MOTECH_VERSION/g" ./motech-base/DEBIAN/control

# Include dependencies
cp -R $DEPENDENCY_DIR/* ./motech-base/var/lib/motech/data/bundles

# set up permissions
find ./motech-base -type d | xargs chmod 755  # for directories
find ./motech-base -type f | xargs chmod 644  # for files
# special permissions for executbale files
chmod 755 ./motech-base/DEBIAN/postinst
chmod 755 ./motech-base/DEBIAN/prerm
chmod 755 ./motech-base/DEBIAN/postrm
chmod 755 ./motech-base/DEBIAN/control
chmod 755 ./motech-base/etc/init.d/motech

# Build package
echo "Building package"
fakeroot dpkg-deb --build motech-base

mv motech-base.deb $BUILD_DIR/$MOTECH_BASE_PACKAGENAME

# Check package for problems
echo "Checking package with lintian"
lintian -i $BUILD_DIR/$MOTECH_BASE_PACKAGENAME

echo "Done! Created $MOTECH_PACKAGENAME"

#clean up
rm -r $TMP_DIR/*

echo "====================="
echo "Building motech"
echo "====================="

# copy files
cp -R $CONTENT_DIR/motech .

# handle changelogs
perl -p -i -e "s/\\$\\{version\\}/$MOTECH_VERSION/g" ./motech/usr/share/doc/motech/changelog
perl -p -i -e "s/\\$\\{version\\}/$MOTECH_VERSION/g" ./motech/usr/share/doc/motech/changelog.Debian

gzip --best ./motech/usr/share/doc/motech/changelog
gzip --best ./motech/usr/share/doc/motech/changelog.Debian

# Update version
perl -p -i -e "s/\\$\\{version\\}/$MOTECH_VERSION/g" ./motech/DEBIAN/control

# set up permissions
find ./motech -type d | xargs chmod 755  # for directories
find ./motech -type f | xargs chmod 644  # for files
# special permissions for executbale files
chmod 755 ./motech/DEBIAN/control

echo "Building package"

fakeroot dpkg-deb --build motech
mv motech.deb $BUILD_DIR/$MOTECH_PACKAGENAME

echo "Checking package with lintian"
lintian -i $BUILD_DIR/$MOTECH_PACKAGENAME

echo "Done! Created $MOTECH_PACKAGENAME"

# clean up
cd $CURRENT_DIR
rm -r $TMP_DIR

