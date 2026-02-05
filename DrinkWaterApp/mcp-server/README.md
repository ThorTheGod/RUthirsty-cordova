# 🦊 Ahri Dialogue MCP Server

Model Context Protocol server for generating AI-powered dialogues using Claude API.

## Quick Start

```bash
# Install dependencies
npm install

# Configure API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start server
npm start
```

## API Endpoints

### POST /api/dialogue

Generate dialogue based on context.

**Request:**
```json
{
  "type": "click",
  "context": {
    "todayCount": 5,
    "totalCount": 50,
    "timeOfDay": "afternoon"
  }
}
```

**Response:**
```json
{
  "success": true,
  "dialogue": "下午好~ 今天已经喝了5次水了，做得很棒！💖",
  "type": "click",
  "timestamp": "2026-02-05T14:30:00.000Z"
}
```

### GET /health

Health check endpoint.

## Configuration

See `.env.example` for all available options.

## Documentation

See [MCP_SETUP_GUIDE.md](../MCP_SETUP_GUIDE.md) for detailed setup instructions.
