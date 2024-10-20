# Custom Console Logger

This project provides a custom logging utility that overrides the default `console.log` and `console.error` methods in JavaScript. It captures log messages along with their origin (the line of code that generated the log) and sends them to a specified endpoint via a POST request.

## Features

- Overrides `console.log` to capture log messages.
- Overrides `console.error` to capture error messages.
- Includes the line of code and file location from where the log/error was generated.
- Sends captured logs and errors to a server endpoint for monitoring and analysis.

## Installation

To use this utility, you can either download the JavaScript file or include it in your project through a package manager. 
