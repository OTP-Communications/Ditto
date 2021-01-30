## Running Locally

### iOS

### Android
## Releasing
### Beta

`yarn beta <ios|and>`

BUMP VERSION MANUALLY BEFORE RUNNING THIS. You can have `1.0.0 (2)` and `1.0.0 (5)` and it'll increment that build number for you, but the patch / minor / major number needs to be manually set.

#### Setting the Version number

**iOS**: Open Xcode. Click project. Click General. Change "Version".<br />
**Android**: Line ~140 of `android/app/build.gradle` - change the string for "versionName"