import Clipboard from '@react-native-community/clipboard';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {navPush} from '../navigator';
import {matrix} from '@rn-matrix/core';
import base64 from 'base-64';

// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: ({token, os}) => {
    console.log({token});
    Clipboard.setString(token);
    const pushkey = base64.encode(token);
    const interval = setInterval(() => {
      console.log('attempt to set pusher ', pushkey);
      // check for matrix until you can set the pusher
      if (matrix && matrix.getClient()) {
        console.log('setting pusher');
        matrix.getClient().setPusher({
          profile_tag: '',
          kind: 'http',
          app_id: os === 'ios' ? 'chat.ditto.ios' : 'chat.ditto.and',
          app_display_name: 'Ditto',
          device_display_name: '',
          pushkey,
          lang: 'en',
          data: {
            default_payload: {
              aps: {
                'content-available': 1,
                'mutable-content': 1,
              },
            },
            format: 'event_id_only',
            url: 'https://push.ditto.chat/_matrix/push/v1/notify',
          },
        });
        clearInterval(interval);
      }
    }, 3000);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: (notification) => {
    console.log('NOTIFICATION:', notification);
    if (notification.foreground && !notification.userInteraction) return;
    if (!notification.data.roomId) return;
    const chat = matrix.getRoomById(notification.data.roomId);
    navPush('Chat', {
      chatId: notification.data.roomId,
      chatName: chat.name$.getValue(),
      chatAvatar: chat.avatar$.getValue(),
    });

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
