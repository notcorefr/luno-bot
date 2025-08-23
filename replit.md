# Discord Bot

## Overview

This is a Discord bot built using Discord.js v14 that provides utility functions, fun commands, and AFK management capabilities. The bot supports both traditional prefix commands (using `!`) and modern slash commands, with features like cooldown management, nickname manipulation for AFK status, and interactive command handling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Command System Architecture
The bot uses a modular command system with dual support for both prefix and slash commands:
- **Command Collections**: Utilizes Discord.js Collections to store and manage commands efficiently
- **Dynamic Loading**: Commands are automatically loaded from the `/commands` directory at startup
- **Dual Command Support**: Each command module can export both traditional prefix commands and slash commands
- **Alias Support**: Commands can have multiple aliases for improved user experience

### Event-Driven Architecture
The bot follows Discord.js event-driven patterns:
- **Event Handler**: Automatically loads event files from `/events` directory
- **Message Processing**: Handles both regular messages and interaction events
- **AFK Detection**: Monitors messages for AFK status changes and mentions

### Data Management
- **In-Memory Storage**: Uses JavaScript Maps for temporary data storage (AFK status)
- **Session-Based**: Data persists only during bot runtime (no permanent database)
- **Guild-Scoped**: AFK data is stored per guild to prevent cross-server conflicts

### Permission Management
- **Graceful Degradation**: Bot functionality continues even without certain permissions
- **Nickname Management**: Attempts to modify nicknames for AFK status but handles permission failures gracefully
- **Error Handling**: Comprehensive error catching and user-friendly error messages

### Cooldown System
- **Per-Command Cooldowns**: Individual cooldown timers for each command
- **User-Specific**: Cooldowns are tracked per user to prevent spam
- **Configurable**: Each command can specify its own cooldown duration (defaults to 3 seconds)

## External Dependencies

### Core Dependencies
- **Discord.js v14.22.1**: Primary Discord API wrapper for bot functionality
- **dotenv v17.2.1**: Environment variable management for secure token storage

### Discord API Integration
- **Gateway Intents**: Configured for guilds, messages, message content, and guild members
- **REST API**: Uses Discord's REST API for slash command registration and management
- **WebSocket Gateway**: Maintains persistent connection for real-time event handling

### Node.js Built-ins
- **File System (fs)**: For dynamic command and event loading
- **Path**: For cross-platform file path handling
- **Process Environment**: For accessing environment variables and configuration