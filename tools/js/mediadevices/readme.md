# Devices List

This project displays a list of available devices (audio and video inputs) on a user's machine, such as cameras and microphones, and checks whether they are currently in use or available. It leverages the Web APIs like `navigator.mediaDevices.enumerateDevices()` and `getUserMedia()` to gather information about the devices.

## Features

- **Device Enumeration**: Lists all available input devices (audio and video).
- **Device Status**: Indicates whether each device is in use (red) or available (green).
- **Permission Check**: Automatically checks for permissions to access the camera and microphone.
- **Error Handling**: Displays appropriate messages when no devices are detected or when permissions are denied.
