#!/bin/bash

# $1 == platform
# $2 == targetVersion

echo "Did you remember to bump the version number? (y/n)"

read ANSWER

if [[ $ANSWER == "y" ]]
then
  if [[ $1 == "ios" ]]
  then
    echo "Releasing for iOS Beta..."
    fastlane ios beta
    exit
  elif [[ $1 == "and" ]]
  then
    echo "Releasing for Android Beta..."
    fastlane android beta
    exit
  fi
  echo "Releasing for both iOS & Android Beta..."
  fastlane ios beta && fastlane android beta
fi
