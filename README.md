## Releasing
### Beta

`yarn beta <ios|and>`

BUMP VERSION MANUALLY BEFORE RUNNING THIS. You can have `1.0.0 (2)` and `1.0.0 (5)` and it'll increment that build number for you, but the patch / minor / major number needs to be manually set.

#### Setting the Version number

**iOS**: Open Xcode. Click project. Click General. Change "Version".<br />
**Android**: Line ~140 of `android/app/build.gradle` - change the string for "versionName"

#### Building on Mac

1. get [yarn](https://yarnpkg.com/)
1. get [cocoapods](https://cocoapods.org/)
1. download repo
1. `cd ditto`
1. `yarn`
1. `cd ios`
1. `pod install`
1. Open the `ditto.xcworkspace` in Xcode
1. Click the Product -> Run menu items.
