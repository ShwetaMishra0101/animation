require 'socket'
require 'digest/sha1'
require 'base64'
require 'json'

# Helper method to generate random data
def generate_random_data
  id = "rectangle#{rand(1..3)}"
  width = rand(50..200)
  height = rand(50..200)
  x = rand(0..500)
  y = rand(0..500)
  color = generate_random_color
  content = "<p>Example text content</p>"

  {
    id: id,
    width: width,
    height: height,
    x: x,
    y: y,
    color: color,
    content: content
  }
end

# Helper method to generate a random color
def generate_random_color
  "%06x" % (rand * 0xffffff)
end

# WebSocket server
server = TCPServer.new(3000)
puts "WebSocket server listening on port 3000..."

# Handshake response headers
HANDSHAKE_RESPONSE = <<~HTTP.freeze
  HTTP/1.1 101 Switching Protocols
  Upgrade: websocket
  Connection: Upgrade
  Sec-WebSocket-Accept: %s

HTTP

# Accept incoming connections
loop do
  socket = server.accept

  # Read the request headers
  request = socket.gets

  # Check if it's a WebSocket handshake request
  if request&.include?("Upgrade: websocket")
    # Parse the Sec-WebSocket-Key
    key = request.match(/Sec-WebSocket-Key: (.+)/)&.captures&.first

    if key
      # Generate the WebSocket accept value
      accept = Base64.strict_encode64(Digest::SHA1.digest(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'))

      # Send the handshake response to upgrade the connection
      socket.write(HANDSHAKE_RESPONSE % accept)
      socket.flush

      # Create WebSocket connection
      while (frame = socket.gets)
        # Ignore ping and pong frames
        next if frame.start_with?("Ping:") || frame.start_with?("Pong:")

        # Send random data infinitely
        loop do
          data = generate_random_data
          socket.write(JSON.dump(data))
          socket.flush
          sleep 1
        end
      end
    end
  end

  # Close the socket
  socket.close
end
