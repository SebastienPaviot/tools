# Custom Console Logger

This project provides a custom logging utility that overrides the default `console.log` and `console.error` methods in JavaScript. It captures log messages along with their origin (the line of code that generated the log) and sends them to a specified endpoint via a POST request.

## Features

- Overrides `console.log` to capture log messages.
- Overrides `console.error` to capture error messages.
- Includes the line of code and file location from where the log/error was generated.
- Sends captured logs and errors to a server endpoint for monitoring and analysis.

# log.php - Log Processing Script

The `log.php` script is responsible for receiving log messages from the custom console logger, processing the incoming data, and saving it to a log file with additional context information.

## Overview

This PHP script handles incoming POST requests containing log data in JSON format. It captures the following information:

- The log message
- The client's IP address
- The referer URL
- The user agent string

The logs are saved in a text file named `logs_YYYY-MM-DD.txt` in the same directory as the script, allowing you to maintain a daily log of messages.

## How It Works

1. **Log File Creation**:
   - The script generates a log file name based on the current date in the format `logs_YYYY-MM-DD.txt`.

2. **Data Retrieval**:
   - It retrieves the raw JSON data from the request body using `file_get_contents('php://input')`.

3. **Data Processing**:
   - If the data is present, it decodes the JSON and checks for the presence of the `log` field.
   - It retrieves client information, including the IP address, referer, and user agent.

4. **Log Entry Formatting**:
   - The log entry is formatted to include a timestamp, client IP, referer, user agent, and the log message, which is safely escaped for HTML output.

5. **File Writing**:
   - The script appends the log entry to the log file. If writing fails, it responds with a 500 error.

6. **Response Handling**:
   - The script returns a success response if the log is saved successfully or appropriate error messages if issues arise.
